'use client'

import { AppScreen } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { AppHeader } from '@/components/AppHeader'
import {
  PhraseFlipper,
  type PhraseFlipperHandle,
} from '@/components/PhraseFlipper'
import { useRoundTransition } from '@/components/RoundTransitionContext'
import { ScreenContainer } from '@/components/ScreenContainer'
import { SpinningAlertLight } from '@/components/SpinningAlertLight'
import { TeamSelector } from '@/components/TeamSelector'
import { useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { useGuessingRoundTransition } from './useGuessingRoundTransition'

export function ScreenForGuessing() {
  const { state, dispatch } = useAppContext()
  const { activeScreen, activeTeamInRound } = state
  const {
    countdownLabel,
    finishGuessingEnter,
    finishGuessingExit,
    finishPhraseEnter,
    phase: roundTransitionPhase,
    requestAbortRound,
  } = useRoundTransition()
  const alertElementRef = useRef<HTMLDivElement>(null)
  const countdownElementRef = useRef<HTMLDivElement>(null)
  const countdownLabelElementRef = useRef<HTMLSpanElement>(null)
  const handoffTrackElementRef = useRef<HTMLDivElement>(null)
  const phraseElementRef = useRef<HTMLDivElement>(null)
  const spinningLightRef = useRef<React.ComponentRef<
    typeof SpinningAlertLight
  > | null>(null)
  const phraseFlipperRef = useRef<PhraseFlipperHandle | null>(null)
  const selectorElementRef = useRef<HTMLDivElement>(null)
  const isTeamSelectorInteractive =
    activeScreen === AppScreen.Guessing && roundTransitionPhase === 'idle'

  useGuessingRoundTransition({
    activeScreen,
    alertElementRef,
    countdownElementRef,
    countdownLabel,
    countdownLabelElementRef,
    finishGuessingEnter,
    finishGuessingExit,
    finishPhraseEnter,
    handoffTrackElementRef,
    phraseElementRef,
    roundTransitionPhase,
    selectorElementRef,
  })

  return (
    <ScreenContainer
      className="touch-auto"
      screenName={AppScreen.Guessing}
      slotForMain={
        <div className="flex h-full flex-col">
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <div
              ref={handoffTrackElementRef}
              className="
                js-guess-handoff-track
                absolute
                inset-y-0
                left-0
                z-20
                grid
                w-[200vw]
                grid-cols-[100vw_100vw]
              "
            >
              <div
                ref={countdownElementRef}
                className="
                  js-guess-countdown
                  pointer-events-none
                  invisible
                  relative
                  z-20
                  flex
                  h-full
                  w-screen
                  overflow-hidden
                  items-center
                  justify-center
                  text-center
                  text-5xl
                  leading-none
                  text-white
                  uppercase
                  [text-shadow:2px_2px_2px_rgba(0,0,0,0.25)]
                "
              >
                <span
                  ref={countdownLabelElementRef}
                  className="inline-block"
                >
                  {countdownLabel}
                </span>
              </div>
              <div
                ref={phraseElementRef}
                className="
                  js-guess-phrase
                  relative
                  z-10
                  h-full
                  w-screen
                  overflow-hidden
                "
              >
                <PhraseFlipper ref={phraseFlipperRef} />
              </div>
            </div>
          </div>
          <TeamSelector
            ref={selectorElementRef}
            activeTeam={activeTeamInRound}
            className={twMerge(
              'js-guess-selector z-30',
              !isTeamSelectorInteractive && 'pointer-events-none',
            )}
            onSelectTeam={team => {
              dispatch({ type: 'SET_ACTIVE_TEAM', team })
              phraseFlipperRef.current?.triggerPhraseTransition(() => {
                dispatch({ type: 'NEXT_PHRASE' })
                spinningLightRef.current?.triggerQuickSpin()
              })
            }}
          />
        </div>
      }
      slotForHeader={
        <AppHeader
          centerSlot={
            <div
              ref={alertElementRef}
              className="js-guess-alert"
            >
              <SpinningAlertLight
                ref={spinningLightRef}
                activeTeam={activeTeamInRound}
                onClick={requestAbortRound}
              />
            </div>
          }
        />
      }
    />
  )
}
