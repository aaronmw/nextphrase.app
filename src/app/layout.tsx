import { AppContext } from '@/components'
import { InstallPrompt } from '@/components/InstallPrompt'
import { isScreenshotMode } from './screenshotMode'
import type { Metadata, Viewport } from 'next'
import { Atma } from 'next/font/google'
import Script from 'next/script'
import { ReactNode } from 'react'
import { twJoin } from 'tailwind-merge'
import './global.css'

export const metadata: Metadata = {
  title: 'NextPhrase App',
  description: 'A game!',
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
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
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
  return (
    <html
      className={twJoin(bodyFont.className, bodyFont.variable, 'font-bold')}
      data-screenshot-mode={isScreenshotMode ? 'true' : undefined}
      lang="en-US"
    >
      <head>
        <Script
          crossOrigin="anonymous"
          src="https://kit.fontawesome.com/401fb1e734.js"
        />
      </head>

      <body>
        <AppContext>{children}</AppContext>
        {!isScreenshotMode && <InstallPrompt />}
      </body>
    </html>
  )
}
