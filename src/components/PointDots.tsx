'use client'

import { HEARTS_PER_TEAM } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { Icon } from '@/components/Icon'
import { usePrevious } from '@/lib/usePrevious'
import { range } from 'lodash'
import { ComponentProps, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useIsClient } from 'usehooks-ts'

interface PointDotsProps extends Omit<ComponentProps<'div'>, 'children'> {
  team: 'A' | 'B'
}

export function PointDots({ className, team, ...otherProps }: PointDotsProps) {
  const { state, sounds } = useAppContext()
  const {
    heartsRemainingForTeamA,
    heartsRemainingForTeamB,
    isNewGame,
  } = state
  const isClient = useIsClient()
  const heartsRemaining =
    team === 'A' ? heartsRemainingForTeamA : heartsRemainingForTeamB
  const previousHeartsRemaining = usePrevious(heartsRemaining) ?? HEARTS_PER_TEAM
  const pointBgColor =
    team === 'A' ? 'text-teamAColor-500' : 'text-teamBColor-500'
  const didIncrease =
    isClient && !isNewGame && heartsRemaining > previousHeartsRemaining
  const didDecrease =
    isClient && !isNewGame && heartsRemaining < previousHeartsRemaining
  const [pointToAnimate, setPointToAnimate] = useState<number | null>(null)
  const isGameOver =
    heartsRemainingForTeamA === 0 || heartsRemainingForTeamB === 0

  useEffect(() => {
    if (didIncrease || didDecrease) {
      setPointToAnimate(
        didDecrease ? previousHeartsRemaining : heartsRemaining,
      )
    }
  }, [heartsRemaining, previousHeartsRemaining, didIncrease, didDecrease])

  useEffect(() => {
    if (pointToAnimate) {
      setTimeout(() => {
        setPointToAnimate(null)
        sounds.playSound('pop')
        if (isGameOver) {
          setTimeout(() => sounds.playSound('cheering'), 500)
        }
      }, 1000)
    }
  }, [pointToAnimate, isGameOver])

  return (
    <div
      className="js-point-dots"
      {...otherProps}
    >
      <div
        className={twMerge(
          `
            flex
            gap-px
          `,
          team === 'A' ? 'flex-row-reverse' : '',
          className,
        )}
      >
        {range(1, HEARTS_PER_TEAM + 1).map(slotNumber => {
          const isAnimating = slotNumber === pointToAnimate
          const isHeart = isAnimating || slotNumber <= heartsRemaining

          return (
            <div
              className={twMerge(
                pointBgColor,
                `
                  js-point-dot
                  flex
                  items-center
                  justify-center
                  text-[14px]
                  transition-all
                  duration-300
                `,
                isHeart
                  ? `
                    scale-100
                  `
                  : `
                    opacity-50
                    scale-75
                  `,
                isAnimating
                  ? `
                    text-red-500
                    duration-1000
                    translate-y-full
                    rotate-6
                    scale-[5]
                  `
                  : isHeart
                    ? `
                      scale-100
                    `
                    : `
                      rotate-[360deg]
                      scale-75
                    `,
              )}
              key={slotNumber}
            >
              <Icon name={isHeart ? 'solid:heart' : 'solid:xmark'} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
