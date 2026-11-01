'use client'

import { RoundTransitionPhase } from '@/components/RoundTransitionContext'
import { Button } from '@/components/Button'
import { RefObject } from 'react'
import { twMerge } from 'tailwind-merge'

interface GameOverOverlayProps {
  gameOverWinningTeam: 'A' | 'B'
  onNewGame: () => void
  roundTransitionPhase: RoundTransitionPhase
  scoreWinnerLabelRef: RefObject<HTMLDivElement | null>
  scoreWinnerNewGameRef: RefObject<HTMLDivElement | null>
  scoreWinnerTrophyRef: RefObject<HTMLDivElement | null>
}

export function GameOverOverlay({
  gameOverWinningTeam,
  onNewGame,
  roundTransitionPhase,
  scoreWinnerLabelRef,
  scoreWinnerNewGameRef,
  scoreWinnerTrophyRef,
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
        <Button
          fullWidth
          size="large"
          tone={gameOverWinningTeam === 'A' ? 'teamA' : 'teamB'}
          variant="primary"
          onClick={onNewGame}
        >
          New Game
        </Button>
      </div>
      <div
        ref={scoreWinnerTrophyRef}
        aria-hidden="true"
        className="
          pointer-events-none
          invisible
          fixed
          top-0
          left-0
          z-[90]
          flex
          size-[clamp(3.5rem,12dvh,5rem)]
          items-center
          justify-center
          text-[clamp(3.5rem,12dvh,5rem)]
          leading-none
          opacity-0
          backface-visible
        "
      >
        🏆
      </div>
    </>
  )
}
