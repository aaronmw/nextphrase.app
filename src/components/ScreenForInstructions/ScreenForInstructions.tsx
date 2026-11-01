'use client'

import { AppScreen } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { AppHeader } from '@/components/AppHeader'
import { Button, ButtonVisual } from '@/components/Button'
import { ScreenContainer } from '@/components/ScreenContainer'
import { useState } from 'react'
import { InstructionCarousel } from './InstructionCarousel'

export function ScreenForInstructions() {
  const { dispatch } = useAppContext()
  const [hasCompletedFinalScene, setHasCompletedFinalScene] = useState(false)

  const backButtonAppearance = {
    icon: 'arrow-left-long' as const,
    variant: hasCompletedFinalScene
      ? ('primary' as const)
      : ('neutral' as const),
    className: 'relative z-[110] -my-0.5',
  }

  return (
    <ScreenContainer
      aria-label="How to Play"
      className="touch-pan-y"
      extendIntoBottomSafeArea
      screenName={AppScreen.Instructions}
      slotForHeader={
        <AppHeader
          centerSlot="How to Play"
          leftSlot={
            <Button
              {...backButtonAppearance}
              aria-label="Back to main menu"
              onClick={() =>
                dispatch({
                  type: 'SET_ACTIVE_SCREEN',
                  screen: AppScreen.MainMenu,
                })
              }
            />
          }
        />
      }
      slotForMain={
        <InstructionCarousel
          backButtonOverlay={<ButtonVisual {...backButtonAppearance} />}
          onFinalSceneCompleteChange={setHasCompletedFinalScene}
        />
      }
    />
  )
}
