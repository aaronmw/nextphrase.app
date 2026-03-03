'use client'

import { AppScreen } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { AppHeader } from '@/components/AppHeader'
import { Icon } from '@/components/Icon'
import { PointDots } from '@/components/PointDots'
import { ScreenContainer } from '@/components/ScreenContainer'
import { StyledText } from '@/components/StyledText'
import { usePrevious } from '@/lib/usePrevious'
import { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { classNames } from './classNames'
import { DistressMarks } from './DistressMarks'

export function ScreenForScoring() {
  const { dispatch, state } = useAppContext()
  const {
    activeTeamInRound,
    heartsRemainingForTeamA,
    heartsRemainingForTeamB,
  } = state
  const timerRef = useRef<NodeJS.Timeout>(null)
  const touchStartedAtRef = useRef<number | null>(null)

  const prevHeartsA = usePrevious(heartsRemainingForTeamA)
  const prevHeartsB = usePrevious(heartsRemainingForTeamB)
  const didChangeA = prevHeartsA != null && heartsRemainingForTeamA !== prevHeartsA
  const didChangeB = prevHeartsB != null && heartsRemainingForTeamB !== prevHeartsB

  const [shakingA, setShakingA] = useState(false)
  const [shakingB, setShakingB] = useState(false)
  const shakeRemoveARef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const shakeRemoveBRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const SHAKE_MS = 1000

  useEffect(() => {
    if (!didChangeA) return
    setShakingA(false)
    const addBackId = setTimeout(() => {
      setShakingA(true)
      shakeRemoveARef.current = setTimeout(() => {
        setShakingA(false)
        shakeRemoveARef.current = null
      }, SHAKE_MS)
    }, 0)
    return () => {
      clearTimeout(addBackId)
      if (shakeRemoveARef.current) {
        clearTimeout(shakeRemoveARef.current)
        shakeRemoveARef.current = null
      }
    }
  }, [didChangeA])

  useEffect(() => {
    if (!didChangeB) return
    setShakingB(false)
    const addBackId = setTimeout(() => {
      setShakingB(true)
      shakeRemoveBRef.current = setTimeout(() => {
        setShakingB(false)
        shakeRemoveBRef.current = null
      }, SHAKE_MS)
    }, 0)
    return () => {
      clearTimeout(addBackId)
      if (shakeRemoveBRef.current) {
        clearTimeout(shakeRemoveBRef.current)
        shakeRemoveBRef.current = null
      }
    }
  }, [didChangeB])

  function handleTouchStart(team: 'A' | 'B') {
    touchStartedAtRef.current = Date.now()
    timerRef.current = setTimeout(() => {
      dispatch({ type: 'ADD_HEART', team })
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
      dispatch({ type: 'SET_ACTIVE_TEAM', team })
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
                dispatch({
                  type: 'SET_ACTIVE_SCREEN',
                  screen: AppScreen.MainMenu,
                })
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
          {(['A', 'B'] as const).map(team => {
            const heartsLeft =
              team === 'A' ? heartsRemainingForTeamA : heartsRemainingForTeamB
            const shaking = team === 'A' ? shakingA : shakingB

            return (
              <div
                key={team}
                className={twMerge(
                  'relative overflow-hidden',
                  shaking && 'animate__animated animate__shakeX',
                  team === 'A'
                    ? 'col-start-1 col-end-2 row-start-1 row-end-2 rounded-tl-xl'
                    : 'col-start-2 col-end-3 row-start-1 row-end-2 rounded-tr-xl',
                )}
              >
                <StyledText
                  as="button"
                  className={twMerge(
                    'h-full w-full',
                    classNames.pointButton,
                    team === 'A'
                      ? classNames.pointButtonTeamA
                      : classNames.pointButtonTeamB,
                    team !== activeTeamInRound && 'opacity-50',
                  )}
                  variant="button.primary"
                  onTouchStart={() => handleTouchStart(team)}
                  onTouchEnd={() => handleTouchEnd(team)}
                >
                  {team}
                </StyledText>
                <DistressMarks
                  flip={team === 'B'}
                  heartsLeft={heartsLeft}
                />
              </div>
            )
          })}

          <div className="relative col-start-1 col-end-3 row-start-2 row-end-4 grid min-h-0 overflow-hidden rounded-b-xl [grid-template:1fr/1fr]">
            <StyledText
              as="button"
              className={twMerge(
                'h-full w-full [grid-area:1/1]',
                classNames.startButton({ activeTeam: activeTeamInRound }),
              )}
              variant="button.primary"
              onClick={() => dispatch({ type: 'START_ROUND' })}
            >
              Start
            </StyledText>
            <div className="pointer-events-none relative z-10 min-h-0 [grid-area:1/1]">
              {(['A', 'B'] as const).map(team => {
                const heartsLeft =
                  team === 'A'
                    ? heartsRemainingForTeamA
                    : heartsRemainingForTeamB
                const isActive = activeTeamInRound === team
                return (
                  <div
                    key={team}
                    className="absolute inset-0"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transition: 'opacity 2000ms',
                    }}
                  >
                    <DistressMarks heartsLeft={heartsLeft} />
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      }
    />
  )
}
