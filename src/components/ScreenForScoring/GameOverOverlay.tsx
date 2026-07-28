'use client'

import { RoundTransitionPhase } from '@/components/RoundTransitionContext'
import { StyledText } from '@/components/StyledText'
import { RefObject } from 'react'
import { twMerge } from 'tailwind-merge'

interface GameOverOverlayProps {
  gameOverWinningTeam: 'A' | 'B'
  onNewGame: () => void
  roundTransitionPhase: RoundTransitionPhase
  scoreWinnerLabelRef: RefObject<HTMLDivElement | null>
  scoreWinnerNewGameRef: RefObject<HTMLDivElement | null>
}

export function GameOverOverlay({
  gameOverWinningTeam,
  onNewGame,
  roundTransitionPhase,
  scoreWinnerLabelRef,
  scoreWinnerNewGameRef,
}: GameOverOverlayProps) {
  return (
    <>
      <div
        ref={scoreWinnerLabelRef}
        className="
          js-score-winner-label
          text-neutralColor-100
          pointer-events-none
          invisible
          fixed
          top-0
          left-0
          z-[80]
          text-2xl
          leading-none
          uppercase
          opacity-0
          [text-shadow:2px_2px_2px_rgba(0,0,0,0.35)]
        "
      >
        Winner:
      </div>
      <div
        ref={scoreWinnerNewGameRef}
        className={twMerge(
          `
            js-score-new-game
            invisible
            fixed
            top-0
            left-0
            z-[80]
            w-[calc(100vw-48px)]
            max-w-[14rem]
            opacity-0
          `,
          roundTransitionPhase === 'scoringGameOver'
            ? 'pointer-events-auto'
            : 'pointer-events-none',
        )}
      >
        <StyledText
          as="button"
          className={twMerge(
            'h-14 w-full rounded-xl text-2xl',
            gameOverWinningTeam === 'A'
              ? 'border-teamAFillColor bg-teamAFillColor text-textOnTeamAColor'
              : 'border-teamBFillColor bg-teamBFillColor text-textOnTeamBColor',
          )}
          variant="button.primary"
          onClick={onNewGame}
        >
          New Game
        </StyledText>
      </div>
    </>
  )
}
