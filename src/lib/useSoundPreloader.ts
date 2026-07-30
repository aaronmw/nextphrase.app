'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export interface SoundProperties {
  trimStart?: number
  trimEnd?: number
  fadeInDuration?: number
  fadeOutDuration?: number
  delay?: number
  src: string
  volume?: number
}

interface LoadedSound extends SoundProperties {
  buffer: AudioBuffer
}

type LoadedSounds<T extends string> = Partial<Record<T, LoadedSound>>

type WindowWithWebkitAudioContext = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext
  }

function scheduleRepeating(
  callback: () => void,
  intervalInMilliseconds: number,
) {
  const interval = setInterval(callback, intervalInMilliseconds)

  return () => clearInterval(interval)
}

export const useSoundPreloader = <T extends string>(
  sounds: Record<T, SoundProperties>,
) => {
  const [isPreloading, setIsPreloading] = useState(true)
  const [loadedSounds, setLoadedSounds] = useState<LoadedSounds<T>>({})
  const loadedSoundsRef = useRef<LoadedSounds<T>>({})
  const stopRepeatingSounds = useRef<Partial<Record<T, () => void>>>({})
  const audioContextRef = useRef<AudioContext | null>(null)
  const resumeAudioContextPromiseRef = useRef<Promise<void> | null>(null)

  const ensureAudioContextIsRunning = useCallback(
    (audioContext: AudioContext) => {
      if (audioContext.state === 'running' || audioContext.state === 'closed') {
        return
      }

      if (!resumeAudioContextPromiseRef.current) {
        resumeAudioContextPromiseRef.current = audioContext
          .resume()
          .catch(() => undefined)
          .finally(() => {
            resumeAudioContextPromiseRef.current = null
          })
      }
    },
    [],
  )

  useEffect(() => {
    setIsPreloading(true)

    const AudioContextConstructor =
      window.AudioContext ||
      (window as WindowWithWebkitAudioContext).webkitAudioContext

    if (!AudioContextConstructor) {
      setIsPreloading(false)
      return
    }

    const audioContext = new AudioContextConstructor({
      latencyHint: 'interactive',
    })
    const abortController = new AbortController()
    let isCancelled = false

    audioContextRef.current = audioContext

    function unlockAudioContext() {
      ensureAudioContextIsRunning(audioContext)
    }

    // Keep listening after the initial unlock because installed iOS apps can
    // interrupt the audio session whenever they move into the background.
    window.addEventListener('pointerdown', unlockAudioContext, true)
    window.addEventListener('touchstart', unlockAudioContext, true)
    window.addEventListener('keydown', unlockAudioContext, true)

    async function loadSound(
      name: T,
      soundProperties: SoundProperties,
    ): Promise<void> {
      try {
        const response = await fetch(soundProperties.src, {
          signal: abortController.signal,
        })

        if (!response.ok) {
          throw new Error(
            `Could not load ${soundProperties.src}: ${response.status}`,
          )
        }

        const arrayBuffer = await response.arrayBuffer()
        const buffer = await audioContext.decodeAudioData(arrayBuffer)

        if (isCancelled) return

        const nextLoadedSounds = {
          ...loadedSoundsRef.current,
          [name]: {
            ...soundProperties,
            buffer,
          },
        }

        loadedSoundsRef.current = nextLoadedSounds
        setLoadedSounds(nextLoadedSounds)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        console.error(`Failed to preload sound "${name}"`, error)
      }
    }

    const soundEntries = Object.entries(sounds) as [T, SoundProperties][]

    async function preloadSounds() {
      await Promise.all(
        soundEntries.map(([name, soundProperties]) =>
          loadSound(name, soundProperties),
        ),
      )

      if (!isCancelled) {
        setIsPreloading(false)
      }
    }

    void preloadSounds()

    return () => {
      isCancelled = true
      abortController.abort()
      window.removeEventListener('pointerdown', unlockAudioContext, true)
      window.removeEventListener('touchstart', unlockAudioContext, true)
      window.removeEventListener('keydown', unlockAudioContext, true)

      for (const name of Object.keys(stopRepeatingSounds.current) as T[]) {
        stopRepeatingSounds.current[name]?.()
      }

      stopRepeatingSounds.current = {}
      loadedSoundsRef.current = {}
      audioContextRef.current = null
      resumeAudioContextPromiseRef.current = null
      void audioContext.close()
    }
  }, [ensureAudioContextIsRunning, sounds])

  const fadeAudio = useCallback(
    (
      gainNode: GainNode,
      targetVolume: number,
      duration: number,
      onComplete?: () => void,
    ) => {
      const audioContext = audioContextRef.current

      if (!audioContext) return

      const currentTime = audioContext.currentTime
      gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime)
      gainNode.gain.linearRampToValueAtTime(
        targetVolume,
        currentTime + duration,
      )

      if (onComplete) {
        setTimeout(onComplete, duration * 1000)
      }
    },
    [],
  )

  const startSound = useCallback(
    (name: T) => {
      const audioContext = audioContextRef.current
      const sound = loadedSoundsRef.current[name]

      if (!(audioContext && sound)) return

      const startAudio = () => {
        const {
          buffer,
          trimStart,
          trimEnd,
          fadeInDuration,
          fadeOutDuration,
          delay,
          volume,
        } = sound
        const source = audioContext.createBufferSource()
        const gainNode = audioContext.createGain()
        const initialVolume = volume ?? 1

        source.buffer = buffer
        source.connect(gainNode)
        gainNode.connect(audioContext.destination)
        gainNode.gain.setValueAtTime(initialVolume, audioContext.currentTime)

        const startTime = audioContext.currentTime + (delay ?? 0)
        const offset = trimStart ?? 0
        const end = trimEnd ?? buffer.duration
        const duration = end - offset

        if (fadeInDuration) {
          gainNode.gain.setValueAtTime(0, audioContext.currentTime)
          fadeAudio(gainNode, initialVolume, fadeInDuration)
        }

        source.start(startTime, offset, duration)

        if (trimEnd !== undefined && fadeOutDuration) {
          const duration = ((delay ?? 0) + trimEnd - (trimStart ?? 0)) * 1000

          setTimeout(() => {
            fadeAudio(gainNode, 0, fadeOutDuration, () => source.stop())
          }, duration)
        }
      }

      if (audioContext.state === 'running') {
        startAudio()
        return
      }

      // Schedule immediately while Safari resumes. AudioContext time is frozen
      // while suspended, so the source begins as soon as the session unlocks
      // instead of being dropped during Safari's transient state change.
      ensureAudioContextIsRunning(audioContext)
      startAudio()
    },
    [ensureAudioContextIsRunning, fadeAudio],
  )

  const playSound = useCallback(
    (name: T, repeatEvery?: number) => {
      startSound(name)

      if (!repeatEvery) return

      stopRepeatingSounds.current[name]?.()
      stopRepeatingSounds.current[name] = scheduleRepeating(
        () => startSound(name),
        repeatEvery * 1000,
      )
    },
    [startSound],
  )

  const stopSound = useCallback((name: T) => {
    stopRepeatingSounds.current[name]?.()
    delete stopRepeatingSounds.current[name]
  }, [])

  return useMemo(
    () => ({ isPreloading, loadedSounds, playSound, stopSound }),
    [isPreloading, loadedSounds, playSound, stopSound],
  )
}
