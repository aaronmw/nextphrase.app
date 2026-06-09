'use client'

import { AppScreen } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { AppHeader } from '@/components/AppHeader'
import {
  PhraseFlipper,
  type PhraseFlipperHandle,
} from '@/components/PhraseFlipper'
import { ScreenContainer } from '@/components/ScreenContainer'
import { SpinningAlertLight } from '@/components/SpinningAlertLight'
import { TeamSelector } from '@/components/TeamSelector'
import { useEffect, useRef } from 'react'

export function ScreenForGuessing() {
  const { state, dispatch } = useAppContext()
  const { activeTeamInRound, currentPhraseId } = state
  const spinningLightRef = useRef<React.ComponentRef<
    typeof SpinningAlertLight
  > | null>(null)
  const phraseFlipperRef = useRef<PhraseFlipperHandle | null>(null)
  const prevPhraseIdRef = useRef(currentPhraseId)

  useEffect(() => {
    const next = currentPhraseId
    const prev = prevPhraseIdRef.current
    prevPhraseIdRef.current = next
    if (next != null && next !== prev) {
      spinningLightRef.current?.triggerQuickSpin()
    }
  }, [currentPhraseId])

  return (
    <ScreenContainer
      className="touch-auto"
      screenName={AppScreen.Guessing}
      slotForMain={
        <div className="flex h-full flex-col">
          <div className="min-h-0 flex-1">
            <PhraseFlipper ref={phraseFlipperRef} />
          </div>
          <div className="flex justify-center p-3">
            <TeamSelector
              activeTeam={activeTeamInRound}
              onSelectTeam={team => {
                dispatch({ type: 'SET_ACTIVE_TEAM', team })
                phraseFlipperRef.current?.triggerPhraseTransition(() => {
                  dispatch({ type: 'NEXT_PHRASE' })
                })
              }}
            />
          </div>
        </div>
      }
      slotForHeader={
        <AppHeader
          centerSlot={
            <SpinningAlertLight
              ref={spinningLightRef}
              activeTeam={activeTeamInRound}
              onClick={() => dispatch({ type: 'ABORT_ROUND' })}
            />
          }
        />
      }
    />
  )
}
