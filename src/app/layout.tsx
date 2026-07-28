import { AppContext } from '@/components'
import { InstallPrompt } from '@/components/InstallPrompt'
import { isScreenshotMode } from './screenshotMode'
import { soundSources } from './sounds'
import { appBackgroundColor } from './theme'
import type { Metadata, Viewport } from 'next'
import { Atma } from 'next/font/google'
import Script from 'next/script'
import { ReactNode } from 'react'
import { preload } from 'react-dom'
import { twJoin } from 'tailwind-merge'
import './global.css'

export const metadata: Metadata = {
  title: 'NextPhrase App',
  description: 'A game!',
  appleWebApp: {
    capable: true,
    startupImage: '/apple-touch-startup-image.png',
    statusBarStyle: 'black-translucent',
    title: 'NextPhrase',
  },
  icons: {
    icon: {
      url: '/icon.png',
      sizes: '500x500',
      type: 'image/png',
    },
    apple: {
      url: '/icon.png',
      sizes: '500x500',
      type: 'image/png',
    },
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: appBackgroundColor,
}

const bodyFont = Atma({
  subsets: ['latin'],
  variable: '--font-atma',
  weight: ['300', '400', '500', '600', '700'],
})

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  soundSources.forEach(src => {
    preload(src, {
      as: 'fetch',
      crossOrigin: 'anonymous',
      type: 'audio/mpeg',
    })
  })

  return (
    <html
      className={twJoin(bodyFont.className, bodyFont.variable, 'font-bold')}
      data-screenshot-mode={isScreenshotMode ? 'true' : undefined}
      lang="en-US"
      suppressHydrationWarning
      style={{ backgroundColor: appBackgroundColor }}
    >
      <head>
        <Script
          crossOrigin="anonymous"
          src="https://kit.fontawesome.com/401fb1e734.js"
        />
      </head>

      <body style={{ backgroundColor: appBackgroundColor }}>
        <AppContext>{children}</AppContext>
        {!isScreenshotMode && <InstallPrompt />}
      </body>
    </html>
  )
}
