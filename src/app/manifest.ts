import type { MetadataRoute } from 'next'
import { appBackgroundColor } from './theme'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NextPhrase App',
    short_name: 'NextPhrase',
    description: 'A game!',
    start_url: '/',
    display: 'standalone',
    background_color: appBackgroundColor,
    theme_color: appBackgroundColor,
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon.png',
        sizes: '500x500',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
