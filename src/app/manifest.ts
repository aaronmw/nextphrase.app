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
        src: '/app-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/app-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/app-icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
