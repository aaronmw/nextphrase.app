'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

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

type LoadedSounds = Record<string, LoadedSound>

export const useSoundPreloader = <T extends string>(
  sounds: Record<T, SoundProperties>,
) => {
  const [loadedSounds, setLoadedSounds] = useState<LoadedSounds>({})
  const repeatIntervals = useRef<Partial<Record<T, NodeJS.Timeout>>>({})
  const audioContext =
    typeof window !== 'undefined'
      ? new (window.AudioContext || (window as any).webkitAudioContext)()
      : null

  useEffect(() => {
    const loadSounds = async () => {
      if (!audioContext) return

      const preloadedSounds: Record<T, LoadedSound> = {} as Record<
        T,
        LoadedSound
      >

      for (const name in sounds) {
        const {
          src,
          trimStart,
          trimEnd,
          fadeInDuration,
          fadeOutDuration,
          delay,
          volume,
        } = sounds[name]
        const response = await fetch(src)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        preloadedSounds[name] = {
          buffer: audioBuffer,
          trimStart,
          trimEnd,
          fadeInDuration,
          fadeOutDuration,
          delay,
          src,
          volume,
        }
      }

      setLoadedSounds(preloadedSounds)
    }

    loadSounds()
  }, [sounds])

  function fadeAudio(
    gainNode: GainNode,
    targetVolume: number,
    duration: number,
    onComplete?: () => void,
  ) {
    if (!audioContext) return

    const currentTime = audioContext.currentTime
    gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime)
    gainNode.gain.linearRampToValueAtTime(targetVolume, currentTime + duration)
    if (onComplete) {
      setTimeout(onComplete, duration * 1000)
    }
  }

  function playSound(name: T, repeatEvery?: number) {
    const sound = loadedSounds[name]

    if (!audioContext || !sound) return

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

    if (repeatEvery) {
      const existingInterval = repeatIntervals.current[name]

      if (existingInterval) {
        clearInterval(existingInterval)
      }

      const interval = setInterval(() => {
        playSound(name)
      }, repeatEvery * 1000)

      repeatIntervals.current[name] = interval
    }
  }

  function stopSound(name: T) {
    const interval = repeatIntervals.current[name]

    if (interval) {
      clearInterval(interval)
      delete repeatIntervals.current[name]
    }
  }

  const memoizedLoadedSounds = useMemo(() => loadedSounds, [loadedSounds])

  return { loadedSounds: memoizedLoadedSounds, playSound, stopSound }
}
