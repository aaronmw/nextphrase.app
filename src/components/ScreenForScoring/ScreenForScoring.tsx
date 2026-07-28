'use client'

import { AppScreen } from '@/app/reducer'
import { teamAColor, teamBColor } from '@/app/theme'
import { useAppContext } from '@/components/AppContext'
import { AppHeader } from '@/components/AppHeader'
import { Confetti } from '@/components/Confetti'
import { Icon } from '@/components/Icon'
import { PointDots } from '@/components/PointDots'
import { useRoundTransition } from '@/components/RoundTransitionContext'
import { ScreenContainer } from '@/components/ScreenContainer'
import { StyledText } from '@/components/StyledText'
import { useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { classNames } from './classNames'
import { DistressMarks } from './DistressMarks'
import { GameOverOverlay } from './GameOverOverlay'
import { useScoringRoundTransition } from './useScoringRoundTransition'

export function ScreenForScoring() {
  const { dispatch, state } = useAppContext()
  const {
    applyPendingRoundEndDamage,
    finishScoringEnter,
    finishScoringExit,
    finishScoringGameOverExit,
    finishScoringGameOverReset,
    finishScoringGameOverResetEnter,
    finishScoringGameOverReveal,
    finishScoringImpact,
    gameOverResetWinningTeam,
    pendingRoundEndIsFinalHit,
    pendingRoundEndTeam,
    phase: roundTransitionPhase,
    requestNewGame,
    startRoundTransition,
  } = useRoundTransition()
  const {
    activeTeamInRound,
    heartsRemainingForTeamA,
    heartsRemainingForTeamB,
  } = state
  const scoreBackRef = useRef<HTMLDivElement>(null)
  const scoreFlashRef = useRef<HTMLDivElement>(null)
  const scoreHeartsARef = useRef<HTMLDivElement>(null)
  const scoreHeartsBRef = useRef<HTMLDivElement>(null)
  const scoreStartRef = useRef<HTMLDivElement>(null)
  const scoreTeamARef = useRef<HTMLDivElement>(null)
  const scoreTeamBRef = useRef<HTMLDivElement>(null)
  const scoreWinnerLabelRef = useRef<HTMLDivElement>(null)
  const scoreWinnerNewGameRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout>(null)
  const touchStartedAtRef = useRef<number | null>(null)
  const gameOverWinningTeam =
    heartsRemainingForTeamA === 0
      ? 'B'
      : heartsRemainingForTeamB === 0
        ? 'A'
        : null
  const gameOverTransitionTeam = gameOverWinningTeam ?? gameOverResetWinningTeam
  const isGameOver = gameOverTransitionTeam !== null
  const shouldHideLosingTeam =
    isGameOver && roundTransitionPhase !== 'scoringGameOverResetEnter'
  const displayedActiveTeam = gameOverTransitionTeam ?? activeTeamInRound
  const confettiTeam = gameOverTransitionTeam ?? activeTeamInRound
  const confettiColors =
    confettiTeam === 'A' ? Object.values(teamAColor) : Object.values(teamBColor)

  const canPlayPointAnimations = ![
    'scoringImpact',
    'scoringGameOverExit',
    'scoringGameOverReveal',
    'scoringGameOver',
    'scoringGameOverReset',
    'scoringGameOverResetEnter',
  ].includes(roundTransitionPhase)
  const shouldApplyDamageInstantly =
    roundTransitionPhase === 'scoringImpact' ||
    roundTransitionPhase === 'scoringHeartLoss' ||
    roundTransitionPhase === 'scoringGameOverExit' ||
    roundTransitionPhase === 'scoringGameOverReveal' ||
    roundTransitionPhase === 'scoringGameOver' ||
    roundTransitionPhase === 'scoringGameOverReset' ||
    roundTransitionPhase === 'scoringGameOverResetEnter'

  useScoringRoundTransition({
    applyPendingRoundEndDamage,
    finishScoringEnter,
    finishScoringExit,
    finishScoringGameOverExit,
    finishScoringGameOverReset,
    finishScoringGameOverResetEnter,
    finishScoringGameOverReveal,
    finishScoringImpact,
    gameOverTransitionTeam,
    pendingRoundEndIsFinalHit,
    pendingRoundEndTeam,
    roundTransitionPhase,
    scoreBackRef,
    scoreFlashRef,
    scoreHeartsARef,
    scoreHeartsBRef,
    scoreStartRef,
    scoreTeamARef,
    scoreTeamBRef,
    scoreWinnerLabelRef,
    scoreWinnerNewGameRef,
  })

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

  function handleNewGame() {
    requestNewGame()
  }

  return (
    <ScreenContainer
      className="[&_.js-header-container]:z-40"
      screenName={AppScreen.Scoring}
      slotForHeader={
        <AppHeader
          leftSlot={
            <div
              ref={scoreHeartsARef}
              className="js-score-hearts-a"
            >
              <PointDots
                playChangeAnimation={canPlayPointAnimations}
                team="A"
              />
            </div>
          }
          centerSlot={
            <div
              ref={scoreBackRef}
              className="js-score-back"
            >
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
            </div>
          }
          rightSlot={
            <div
              ref={scoreHeartsBRef}
              className="js-score-hearts-b"
            >
              <PointDots
                playChangeAnimation={canPlayPointAnimations}
                team="B"
              />
            </div>
          }
        />
      }
      slotForMain={
        <>
          <main className={classNames.mainContainer}>
            {(['A', 'B'] as const).map(team => {
              const heartsLeft =
                team === 'A' ? heartsRemainingForTeamA : heartsRemainingForTeamB

              return (
                <div
                  ref={team === 'A' ? scoreTeamARef : scoreTeamBRef}
                  key={team}
                  className={twMerge(
                    'relative overflow-hidden',
                    team === 'A' ? 'js-score-team-a' : 'js-score-team-b',
                    team === 'A'
                      ? 'col-start-1 col-end-2 row-start-1 row-end-2 rounded-tl-xl'
                      : 'col-start-2 col-end-3 row-start-1 row-end-2 rounded-tr-xl',
                    shouldHideLosingTeam &&
                      team !== gameOverTransitionTeam &&
                      'pointer-events-none invisible',
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
                      team !== displayedActiveTeam && 'opacity-50',
                      isGameOver && 'pointer-events-none',
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
                    instant={shouldApplyDamageInstantly}
                  />
                </div>
              )
            })}

            <div
              ref={scoreStartRef}
              className="js-score-start relative col-start-1 col-end-3 row-start-2 row-end-4 grid min-h-0 overflow-hidden rounded-b-xl [grid-template:1fr/1fr]"
            >
              <StyledText
                as="button"
                className={twMerge(
                  'h-full w-full [grid-area:1/1]',
                  classNames.startButton({ activeTeam: displayedActiveTeam }),
                )}
                variant="button.primary"
                disabled={roundTransitionPhase !== 'idle' || isGameOver}
                onClick={startRoundTransition}
              >
                Start
              </StyledText>
              <div className="pointer-events-none relative z-10 min-h-0 [grid-area:1/1]">
                {(['A', 'B'] as const).map(team => {
                  const heartsLeft =
                    team === 'A'
                      ? heartsRemainingForTeamA
                      : heartsRemainingForTeamB
                  const isActive = displayedActiveTeam === team
                  return (
                    <div
                      key={team}
                      className="absolute inset-0"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transition: 'opacity 500ms',
                      }}
                    >
                      <DistressMarks
                        heartsLeft={heartsLeft}
                        instant={shouldApplyDamageInstantly}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </main>
          <div
            ref={scoreFlashRef}
            className="js-score-flash bg-neutralColor-100 pointer-events-none invisible fixed top-0 left-0 z-[100] size-1 rounded-full opacity-0"
          />
          <Confetti
            colors={confettiColors}
            recycle={roundTransitionPhase === 'scoringGameOver'}
            trigger={roundTransitionPhase === 'scoringGameOver'}
          />
          {gameOverTransitionTeam && (
            <GameOverOverlay
              gameOverWinningTeam={gameOverTransitionTeam}
              onNewGame={handleNewGame}
              roundTransitionPhase={roundTransitionPhase}
              scoreWinnerLabelRef={scoreWinnerLabelRef}
              scoreWinnerNewGameRef={scoreWinnerNewGameRef}
            />
          )}
        </>
      }
    />
  )
}
