import { AppContext } from '@/components'
import { InstallPrompt } from '@/components/InstallPrompt'
import type { Metadata, Viewport } from 'next'
import { Lilita_One } from 'next/font/google'
import Script from 'next/script'
import { ReactNode } from 'react'
import { twJoin } from 'tailwind-merge'
import './global.css'

export const metadata: Metadata = {
  title: 'NextPhrase App',
  description: 'A game!',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

const bodyFont = Lilita_One({
  subsets: ['latin'],
  variable: '--font-lilita-one',
  weight: '400',
})

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html
      className={twJoin(bodyFont.className, bodyFont.variable)}
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
        <InstallPrompt />
      </body>
    </html>
  )
}
