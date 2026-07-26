'use client'

import { HEARTS_PER_TEAM } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { Icon } from '@/components/Icon'
import { usePrevious } from '@/lib/usePrevious'
import { ComponentProps, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useIsClient } from 'usehooks-ts'

interface PointDotsProps extends Omit<ComponentProps<'div'>, 'children'> {
  playChangeAnimation?: boolean
  team: 'A' | 'B'
}

export function PointDots({
  className,
  playChangeAnimation = true,
  team,
  ...otherProps
}: PointDotsProps) {
  const { state, sounds } = useAppContext()
  const {
    heartsRemainingForTeamA,
    heartsRemainingForTeamB,
    isNewGame,
  } = state
  const isClient = useIsClient()
  const playSoundRef = useRef(sounds.playSound)
  const heartsRemaining =
    team === 'A' ? heartsRemainingForTeamA : heartsRemainingForTeamB
  const previousHeartsRemaining = usePrevious(heartsRemaining) ?? HEARTS_PER_TEAM
  const pointBgColor =
    team === 'A' ? 'text-teamAColor-500' : 'text-teamBColor-500'
  const didIncrease =
    isClient && !isNewGame && heartsRemaining > previousHeartsRemaining
  const didDecrease =
    isClient && !isNewGame && heartsRemaining < previousHeartsRemaining
  const [heldHeartsRemaining, setHeldHeartsRemaining] = useState<number | null>(
    null,
  )
  const [pointToAnimate, setPointToAnimate] = useState<number | null>(null)
  const pendingPointToAnimateRef = useRef<number | null>(null)
  const visibleHeartsRemaining = heldHeartsRemaining ?? heartsRemaining
  const isGameOver =
    heartsRemainingForTeamA === 0 || heartsRemainingForTeamB === 0
  const pointSlots = Array.from(
    { length: HEARTS_PER_TEAM },
    (_, index) => index + 1,
  )

  useEffect(() => {
    playSoundRef.current = sounds.playSound
  }, [sounds.playSound])

  useEffect(() => {
    if (!(didIncrease || didDecrease)) return

    const nextPointToAnimate = didDecrease
      ? previousHeartsRemaining
      : heartsRemaining

    if (!playChangeAnimation) {
      setHeldHeartsRemaining(previousHeartsRemaining)
      pendingPointToAnimateRef.current = nextPointToAnimate
      setPointToAnimate(null)
      return
    }

    setHeldHeartsRemaining(null)
    pendingPointToAnimateRef.current = null
    setPointToAnimate(nextPointToAnimate)
  }, [
    didDecrease,
    didIncrease,
    heartsRemaining,
    playChangeAnimation,
    previousHeartsRemaining,
  ])

  useEffect(() => {
    if (!playChangeAnimation || pendingPointToAnimateRef.current === null) return

    const pendingPointToAnimate = pendingPointToAnimateRef.current
    pendingPointToAnimateRef.current = null
    setHeldHeartsRemaining(null)
    setPointToAnimate(pendingPointToAnimate)
  }, [playChangeAnimation])

  useEffect(() => {
    if (!pointToAnimate) return

    let cheeringId: ReturnType<typeof setTimeout> | null = null
    const animationDoneId = setTimeout(() => {
      setPointToAnimate(null)
      playSoundRef.current('pop')

      if (isGameOver) {
        cheeringId = setTimeout(() => playSoundRef.current('cheering'), 500)
      }
    }, 1000)

    return () => {
      clearTimeout(animationDoneId)

      if (cheeringId) {
        clearTimeout(cheeringId)
      }
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
        {pointSlots.map(slotNumber => {
          const isAnimating = slotNumber === pointToAnimate
          const isHeart = isAnimating || slotNumber <= visibleHeartsRemaining

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
