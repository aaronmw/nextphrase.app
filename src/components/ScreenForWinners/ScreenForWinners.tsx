'use client'

import { AppScreen } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { ScreenContainer } from '@/components/ScreenContainer'
import { StyledText } from '@/components/StyledText'

export function ScreenForWinners() {
  const { state, dispatch } = useAppContext()
  const { heartsRemainingForTeamA } = state

  const winner = heartsRemainingForTeamA === 0 ? 'B' : 'A'

  return (
    <ScreenContainer
      extendIntoBottomSafeArea
      screenName={AppScreen.Winners}
      slotForMain={
        <div className="flex h-full flex-col items-center justify-center gap-12 px-3">
          <div className="flex flex-col items-center">
            <div className="text-neutralColor-100 text-2xl uppercase">
              Winner:
            </div>
            <div className="text-8xl">{winner}</div>
          </div>
          <StyledText
            as="button"
            variant="button.primary"
            onClick={() => dispatch({ type: 'NEW_GAME' })}
          >
            New Game
          </StyledText>
        </div>
      }
    />
  )
}
