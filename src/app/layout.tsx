import { AppContextProvider } from '@/components'
import type { Metadata, Viewport } from 'next'
import { Boogaloo } from 'next/font/google'
import Script from 'next/script'
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
}

const bodyFont = Boogaloo({
  subsets: ['latin'],
  variable: '--font-boogaloo',
  weight: '400',
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AppContextProvider>
      <html
        className={twJoin(
          bodyFont.className,
          bodyFont.variable,
          `
            overflow-x-hidden
            bg-bgColor
            text-4xl
            text-textColor
          `,
        )}
        lang="en"
      >
        <head>
          <Script
            crossOrigin="anonymous"
            src="https://kit.fontawesome.com/401fb1e734.js"
          />
        </head>

        <body>
          <AppContextProvider>{children}</AppContextProvider>
        </body>
      </html>
    </AppContextProvider>
  )
}
