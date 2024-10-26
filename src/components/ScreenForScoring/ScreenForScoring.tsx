'use client'

import { AppScreen } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { AppHeader } from '@/components/AppHeader'
import { Icon } from '@/components/Icon'
import { PointDots } from '@/components/PointDots'
import { ScreenContainer } from '@/components/ScreenContainer'
import { StyledText } from '@/components/StyledText'
import { useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { classNames } from './classNames'

export function ScreenForScoring() {
  const { dispatch, state } = useAppContext()
  const { isRoundOver } = state
  const timerRef = useRef<NodeJS.Timeout>(null)
  const touchStartedAtRef = useRef<number | null>(null)

  function handleTouchStart(team: 'A' | 'B') {
    touchStartedAtRef.current = Date.now()
    timerRef.current = setTimeout(() => {
      dispatch({ type: 'SUBTRACT_POINT', team })
    }, 1000)
  }

  function handleTouchEnd(team: 'A' | 'B') {
    const touchStartedAt = touchStartedAtRef.current!
    const touchDuration = Date.now() - touchStartedAt

    touchStartedAtRef.current = null

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    if (touchDuration < 500) {
      dispatch({ type: 'ADD_POINT', team })
    }
  }

  return (
    <ScreenContainer
      screenName={AppScreen.Scoring}
      slotForHeader={
        <AppHeader
          leftSlot={<PointDots team="A" />}
          centerSlot={
            <StyledText
              as="button"
              variant="button.tool"
              onClick={() =>
                dispatch({ type: 'SET_ACTIVE_SCREEN', screen: AppScreen.Intro })
              }
            >
              <Icon name="arrow-left-long" />
            </StyledText>
          }
          rightSlot={<PointDots team="B" />}
        />
      }
      slotForMain={
        <main className={classNames.mainContainer}>
          {(['A', 'B'] as const).map(team => (
            <StyledText
              as="button"
              className={twMerge(
                classNames.pointButton,
                team === 'A'
                  ? classNames.pointButtonTeamA
                  : classNames.pointButtonTeamB,
              )}
              key={team}
              variant="button.primary"
              onTouchStart={() => handleTouchStart(team)}
              onTouchEnd={() => handleTouchEnd(team)}
            >
              {team}
            </StyledText>
          ))}

          <StyledText
            as="button"
            className={classNames.startButton({ isRoundOver })}
            variant="button.primary"
            onClick={() => dispatch({ type: 'START_ROUND' })}
          >
            Start
          </StyledText>
        </main>
      }
    />
  )
}
