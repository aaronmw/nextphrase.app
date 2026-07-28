'use client'

import { AppScreen } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { LoadingScreen } from '@/components/LoadingScreen'
import {
  RoundTransitionProvider,
  ScreenForGuessing,
  ScreenForInstructions,
  ScreenForMainMenu,
  ScreenForOptions,
  ScreenForScoring,
  ScreenForWinners,
} from '@/components'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { useEffect } from 'react'
import { useIsClient } from 'usehooks-ts'

gsap.registerPlugin(useGSAP, MotionPathPlugin)

function DevelopmentTools() {
  if (process.env.NODE_ENV !== 'development') return null

  // Keep the full Tailwind palette out of production while loading the
  // development tools synchronously, so persisted tokens apply before paint.
  const { DevPanel } =
    require('@/components/DevPanel') as typeof import('@/components/DevPanel')
  return <DevPanel />
}

export default function Page() {
  const isClient = useIsClient()
  const { isLoading, state } = useAppContext()

  useEffect(() => {
    const preventDefault = (event: Event) => event.preventDefault()
    document.body.addEventListener('selectstart', preventDefault)
    document.body.addEventListener('dragstart', preventDefault)
    return () => {
      document.body.removeEventListener('selectstart', preventDefault)
      document.body.removeEventListener('dragstart', preventDefault)
    }
  }, [])

  return (
    <>
      {isClient && (
        <RoundTransitionProvider>
          <ScreenForOptions />
          <ScreenForInstructions />
          <ScreenForMainMenu />
          <ScreenForScoring />
          <ScreenForGuessing />
          <ScreenForWinners />
          <DevelopmentTools />
        </RoundTransitionProvider>
      )}
      <LoadingScreen
        animateToIntro={isClient && state.activeScreen === AppScreen.MainMenu}
        isLoading={!isClient || isLoading}
      />
    </>
  )
}
