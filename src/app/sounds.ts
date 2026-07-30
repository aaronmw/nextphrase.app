import type { SoundProperties } from '@/lib/useSoundPreloader'

export const soundFiles = {
  'bonk': { src: '/sounds/bonk.mp3' },
  'cheering': { src: '/sounds/cheering.mp3', trimStart: 0.4 },
  'sad-trombone': { src: '/sounds/sad-trombone.mp3' },
  'pop': { src: '/sounds/pop.mp3', trimStart: 0.2 },
  'spacebar-click': { src: '/sounds/spacebar-click.mp3', trimStart: 0.06 },
  'spacebar-down': {
    src: '/sounds/spacebar-click.mp3',
    trimStart: 0.06,
    trimEnd: 0.16,
  },
  'spacebar-up': {
    src: '/sounds/spacebar-click.mp3',
    trimStart: 0.17,
    trimEnd: 0.25,
  },
  'glass-explosion': { src: '/sounds/glass-explosion.mp3' },
} satisfies Record<string, SoundProperties>

export const soundSources = Object.values(soundFiles).map(({ src }) => src)
