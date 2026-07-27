'use client'

import { AppScreen } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { LoadingScreen } from '@/components/LoadingScreen'
import {
  DevPanel,
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
import { useEffect } from 'react'
import { useIsClient } from 'usehooks-ts'

gsap.registerPlugin(useGSAP)

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
          {process.env.NODE_ENV === 'development' && <DevPanel />}
        </RoundTransitionProvider>
      )}
      <LoadingScreen
        animateToIntro={isClient && state.activeScreen === AppScreen.MainMenu}
        isLoading={!isClient || isLoading}
      />
    </>
  )
}
