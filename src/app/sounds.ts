import { SoundProperties } from '@/lib/useSoundPreloader'

export const soundFiles = {
  'bonk': { src: '/sounds/bonk.mp3' },
  'cheering': { src: '/sounds/cheering.mp3', trimStart: 0.4 },
  'sad-trombone': { src: '/sounds/sad-trombone.mp3' },
  'pop': { src: '/sounds/pop.mp3', trimStart: 0.2 },
  'spacebar-click': { src: '/sounds/spacebar-click.mp3' },
  'glass-explosion': { src: '/sounds/glass-explosion.mp3' },
} satisfies Record<string, SoundProperties>
