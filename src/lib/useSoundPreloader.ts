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

  useEffect(() => {
    setIsPreloading(true)

    const AudioContextConstructor =
      window.AudioContext ||
      (window as WindowWithWebkitAudioContext).webkitAudioContext

    if (!AudioContextConstructor) {
      setIsPreloading(false)
      return
    }

    const audioContext = new AudioContextConstructor()
    const abortController = new AbortController()
    let isCancelled = false

    audioContextRef.current = audioContext

    function unlockAudioContext() {
      if (audioContext.state === 'suspended') {
        void audioContext.resume()
      }

      window.removeEventListener('pointerdown', unlockAudioContext, true)
      window.removeEventListener('keydown', unlockAudioContext, true)
    }

    window.addEventListener('pointerdown', unlockAudioContext, true)
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
      window.removeEventListener('keydown', unlockAudioContext, true)

      for (const name of Object.keys(stopRepeatingSounds.current) as T[]) {
        stopRepeatingSounds.current[name]?.()
      }

      stopRepeatingSounds.current = {}
      loadedSoundsRef.current = {}
      audioContextRef.current = null
      void audioContext.close()
    }
  }, [sounds])

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

      if (!audioContext) return

      if (audioContext.state === 'suspended') {
        void audioContext.resume()
      }

      if (!sound) return

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

      source.buffer = buffer
      source.connect(gainNode)
      gainNode.connect(audioContext.destination)

      const initialVolume = volume ?? 1
      gainNode.gain.setValueAtTime(initialVolume, audioContext.currentTime)

      const startAudio = () => {
        const startTime = audioContext.currentTime + (delay ?? 0)
        const offset = trimStart ?? 0
        const end = trimEnd ?? buffer.duration
        const duration = end - offset

        if (fadeInDuration) {
          gainNode.gain.setValueAtTime(0, audioContext.currentTime)
          fadeAudio(gainNode, initialVolume, fadeInDuration)
        }

        source.start(startTime, offset, duration)
      }

      if (trimStart !== undefined && trimStart >= 0) {
        setTimeout(startAudio, (delay ?? 0) * 1000)
      } else {
        startAudio()
      }

      if (trimEnd !== undefined && fadeOutDuration) {
        const duration = (trimEnd - (trimStart ?? 0)) * 1000

        setTimeout(() => {
          fadeAudio(gainNode, 0, fadeOutDuration, () => source.stop())
        }, duration)
      }
    },
    [fadeAudio],
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
