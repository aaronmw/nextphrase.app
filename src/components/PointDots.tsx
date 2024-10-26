'use client'

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
  const { dispatch, state, sounds } = useAppContext()
  const { pointsToWin, pointsForTeamA, pointsForTeamB, isNewGame } = state
  const isClient = useIsClient()
  const pointsForTeam = team === 'A' ? pointsForTeamA : pointsForTeamB
  const previousPointsForTeam = usePrevious(pointsForTeam) ?? 0
  const pointBgColor =
    team === 'A' ? 'text-teamAColor-500' : 'text-teamBColor-500'
  const didIncrease =
    isClient && !isNewGame && pointsForTeam > previousPointsForTeam
  const didDecrease =
    isClient && !isNewGame && pointsForTeam < previousPointsForTeam
  const [pointToAnimate, setPointToAnimate] = useState<number | null>(null)
  const isGameOver =
    pointsForTeamA === pointsToWin || pointsForTeamB === pointsToWin

  useEffect(() => {
    if (didIncrease || didDecrease) {
      setPointToAnimate(didIncrease ? pointsForTeam : previousPointsForTeam)
    }
  }, [pointsForTeam, previousPointsForTeam, didIncrease, didDecrease])

  useEffect(() => {
    if (pointToAnimate) {
      setTimeout(() => {
        setPointToAnimate(null)
        sounds.playSound('pop')
        if (isGameOver) {
          setTimeout(() => {
            sounds.playSound('cheering')
            dispatch({ type: 'END_GAME' })
          }, 500)
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
        {range(1, pointsToWin + 1).map(currentPointNumber => {
          const isAnimating = currentPointNumber === pointToAnimate
          const isHeart = isAnimating || currentPointNumber > pointsForTeam

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
              key={currentPointNumber}
            >
              <Icon name={isHeart ? 'solid:heart' : 'solid:xmark'} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
