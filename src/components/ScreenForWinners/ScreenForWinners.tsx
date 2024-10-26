'use client'

import { AppScreen } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { AppHeader } from '@/components/AppHeader'
import { Confetti } from '@/components/Confetti'
import { ScreenContainer } from '@/components/ScreenContainer'
import { StyledText } from '@/components/StyledText'
import { teamAColor, teamBColor } from '../../../tailwind.config'

export function ScreenForWinners() {
  const { state, dispatch } = useAppContext()
  const { activeScreen, pointsForTeamA, pointsForTeamB } = state
  const isActiveScreen = activeScreen === AppScreen.Winners

  const winner = pointsForTeamA > pointsForTeamB ? 'B' : 'A'
  const colors =
    winner === 'A' ? Object.values(teamAColor) : Object.values(teamBColor)

  return (
    <ScreenContainer
      className={winner === 'A' ? 'bg-teamAColor-950' : 'bg-teamBColor-950'}
      screenName={AppScreen.Winners}
      slotForHeader={<AppHeader centerSlot="Game Over" />}
      slotForMain={
        <div className="flex h-full flex-col items-center justify-center gap-12 px-3">
          <Confetti
            colors={colors}
            trigger={isActiveScreen}
          />

          <div className="flex flex-col items-center">
            <StyledText variant="label">Winner</StyledText>
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
