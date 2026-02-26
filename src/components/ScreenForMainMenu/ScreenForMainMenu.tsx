'use client'

import { AppScreen, HEARTS_PER_TEAM } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { AppHeader } from '@/components/AppHeader'
import { Logo } from '@/components/Logo'
import { ScreenContainer } from '@/components/ScreenContainer'
import { StyledText } from '@/components/StyledText'
import { classNames } from './classNames'

export function ScreenForMainMenu() {
  const { state, dispatch } = useAppContext()

  const { heartsRemainingForTeamA, heartsRemainingForTeamB } = state

  const gameInProgress =
    heartsRemainingForTeamA < HEARTS_PER_TEAM ||
    heartsRemainingForTeamB < HEARTS_PER_TEAM

  return (
    <ScreenContainer
      screenName={AppScreen.MainMenu}
      slotForHeader={<AppHeader />}
      slotForMain={
        <>
          <div className={classNames.logoContainer}>
            <Logo className={classNames.logo} />
          </div>

          <div className={classNames.mainContainer}>
            {gameInProgress && (
              <StyledText
                as="button"
                className={classNames.continueButton}
                variant="button.primary"
                onClick={() =>
                  dispatch({
                    type: 'SET_ACTIVE_SCREEN',
                    screen: AppScreen.Scoring,
                  })
                }
              >
                <div>Continue Game</div>

                <div className={classNames.scoreContainer}>
                  <div className={classNames.teamAScore}>
                    {heartsRemainingForTeamA}
                  </div>
                  <div className={classNames.teamBScore}>
                    {heartsRemainingForTeamB}
                  </div>
                </div>
              </StyledText>
            )}

            <StyledText
              as="button"
              variant="button.primary"
              onClick={() =>
                dispatch({
                  type: 'NEW_GAME',
                })
              }
            >
              {gameInProgress ? 'New Game' : 'Start Game'}
            </StyledText>

            <StyledText
              as="button"
              variant="button.secondary"
              onClick={() =>
                dispatch({
                  type: 'SET_ACTIVE_SCREEN',
                  screen: AppScreen.Instructions,
                })
              }
            >
              How to Play
            </StyledText>

            <StyledText
              as="button"
              variant="button.secondary"
              onClick={() =>
                dispatch({
                  type: 'SET_ACTIVE_SCREEN',
                  screen: AppScreen.Options,
                })
              }
            >
              Options
            </StyledText>
          </div>
        </>
      }
    />
  )
}
