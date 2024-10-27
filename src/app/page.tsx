'use client'

import {
  ScreenForGuessing,
  ScreenForMainMenu,
  ScreenForOptions,
  ScreenForScoring,
  ScreenForWinners,
} from '@/components'
import { useAppContext } from '@/components/AppContext'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useEffect } from 'react'
import { useIsClient } from 'usehooks-ts'

gsap.registerPlugin(useGSAP)

export default function Page() {
  const isClient = useIsClient()
  const { state } = useAppContext()
  const { rotateScreen } = state

  useEffect(() => {
    const preventDefault = (event: Event) => event.preventDefault()
    document.body.addEventListener('selectstart', preventDefault)
    document.body.addEventListener('dragstart', preventDefault)
    return () => {
      document.body.removeEventListener('selectstart', preventDefault)
      document.body.removeEventListener('dragstart', preventDefault)
    }
  }, [])

  if (!isClient) return null

  return (
    <>
      <ScreenForOptions />
      <ScreenForMainMenu />
      <ScreenForScoring />
      <ScreenForGuessing />
      <ScreenForWinners />
    </>
  )
}
