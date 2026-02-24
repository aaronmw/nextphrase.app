'use client'

import { AppScreen } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { AppHeader } from '@/components/AppHeader'
import { Icon } from '@/components/Icon'
import { PointDots } from '@/components/PointDots'
import { ScoreCard } from '@/components/ScoreCard'
import { ScreenContainer } from '@/components/ScreenContainer'
import { StyledText } from '@/components/StyledText'
import { classNames } from './classNames'

export function ScreenForScoring() {
  const { dispatch, state } = useAppContext()
  const { isNewGame } = state

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
          <ScoreCard
            team="A"
            className={classNames.scoreCardTeamA}
          />
          <ScoreCard
            team="B"
            className={classNames.scoreCardTeamB}
          />

          <StyledText
            as="button"
            className={classNames.startButton({ isNewGame })}
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
