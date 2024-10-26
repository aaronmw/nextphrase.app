import type { MetadataRoute } from 'next'
import colors from 'tailwindcss/colors'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NextPhrase App',
    short_name: 'NextPhrase',
    description: 'A game!',
    start_url: '/',
    display: 'standalone',
    background_color: colors.neutral['950'],
    theme_color: 'transparent',
    icons: [
      {
        src: '/icon.png',
        sizes: '429x429',
        type: 'image/png',
      },
    ],
  }
}
