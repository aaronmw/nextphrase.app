'use client'

import { useAppContext } from '@/components/AppContext'
import { Icon } from '@/components/Icon'
import {
  ComponentProps,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react'
import { twMerge } from 'tailwind-merge'
import gsap from 'gsap'

const CARD_LAYOUTS: Record<number, (number | null)[][]> = {
  7: [
    [1, null, 2],
    [3, 4, 5],
    [6, null, 7],
  ],
  6: [
    [1, 2, 3],
    [null, null, null],
    [4, 5, 6],
  ],
  5: [
    [1, null, 2],
    [null, 3, null],
    [4, null, 5],
  ],
  4: [
    [1, null, 2],
    [null, null, null],
    [3, null, 4],
  ],
  3: [
    [null, 1, null],
    [null, 2, null],
    [null, 3, null],
  ],
  2: [
    [null, 1, null],
    [null, null, null],
    [null, 2, null],
  ],
  1: [
    [null, null, null],
    [null, 1, null],
    [null, null, null],
  ],
}

function HeartsGrid({
  layout,
  colorClass,
}: {
  layout: (number | null)[][]
  colorClass: string
}) {
  return (
    <div className="grid flex-1 grid-cols-3 grid-rows-3 place-items-center gap-0">
      {layout.flatMap((row, rowIndex) =>
        row.map((cell, colIndex) =>
          cell === null ? (
            <div key={`${rowIndex}-${colIndex}`} />
          ) : (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={twMerge(
                'flex scale-50 items-center justify-center text-xl',
                colorClass,
              )}
            >
              <Icon name="solid:heart" />
            </div>
          ),
        ),
      )}
    </div>
  )
}

const CardFace = forwardRef<
  HTMLDivElement,
  {
    hearts: number
    team: 'A' | 'B'
    className?: string
    style?: React.CSSProperties
  }
>(function CardFace({ hearts, team, className, style }, ref) {
  const borderBgClass =
    team === 'A'
      ? 'border-teamAColor-500 bg-teamAColor-500'
      : 'border-teamBColor-500 bg-teamBColor-500'
  const layout = CARD_LAYOUTS[hearts] ?? []

  return (
    <div
      ref={ref}
      className={twMerge(
        'relative flex flex-col rounded-xl border-2 p-2',
        borderBgClass,
        className,
      )}
      style={style}
    >
      <div className="absolute left-0 top-0 flex size-5 items-center justify-center">
        <span className="text-xl font-bold text-white scale-50">{team}</span>
      </div>
      <div className="absolute bottom-0 right-0 flex size-5 items-center justify-center">
        <span className="text-xl font-bold text-white scale-50">{team}</span>
      </div>
      <HeartsGrid layout={layout} colorClass="text-white" />
    </div>
  )
})

interface ScoreCardProps extends Omit<ComponentProps<'div'>, 'children'> {
  team: 'A' | 'B'
}

export function ScoreCard({ className, team, ...otherProps }: ScoreCardProps) {
  const { dispatch, state } = useAppContext()
  const { pointsToWin, pointsForTeamA, pointsForTeamB, lastRoundLostHearts } =
    state
  const pointsForTeam = team === 'A' ? pointsForTeamA : pointsForTeamB
  const heartsRemaining = pointsToWin - pointsForTeam
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const heartsRemainingRef = useRef(heartsRemaining)
  heartsRemainingRef.current = heartsRemaining
  const [fallingCardHearts, setFallingCardHearts] = useState<number | null>(null)
  const [risingCardHearts, setRisingCardHearts] = useState<number | null>(null)
  const baseHearts =
    risingCardHearts !== null ? risingCardHearts - 1 : heartsRemaining
  const overlayRef = useRef<HTMLDivElement>(null)
  const risingOverlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lostHearts = lastRoundLostHearts[team]
    if (lostHearts !== null && lostHearts === heartsRemaining + 1) {
      setFallingCardHearts(lostHearts)
    }
  }, [team, heartsRemaining, lastRoundLostHearts])

  useEffect(() => {
    if (!fallingCardHearts || !overlayRef.current) return
    const el = overlayRef.current
    const tween = gsap.to(el, {
      y: '100%',
      opacity: 0,
      duration: 0.5,
      delay: 0.6,
      ease: 'power2.in',
      onComplete: () => {
        setFallingCardHearts(null)
        dispatch({ type: 'CLEAR_LAST_ROUND_LOST_HEARTS', team })
      },
    })
    return () => {
      tween.kill()
    }
  }, [fallingCardHearts, team, dispatch])

  useEffect(() => {
    if (!risingCardHearts || !risingOverlayRef.current) return
    const el = risingOverlayRef.current
    const tween = gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => setRisingCardHearts(null),
    })
    return () => {
      tween.kill()
    }
  }, [risingCardHearts])

  function removePoint(animate: boolean) {
    if (pointsForTeam <= 0) return
    dispatch({ type: 'SUBTRACT_POINT', team })
    if (animate) {
      setRisingCardHearts(heartsRemainingRef.current + 1)
    }
  }

  function handlePointerDown() {
    if (pointsForTeam <= 0) return
    timerRef.current = setTimeout(() => {
      removePoint(true)
      timerRef.current = null
    }, 1000)
  }

  function handlePointerUp() {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
      removePoint(false)
    }
  }

  return (
    <div
      className={twMerge(
        'relative flex flex-col overflow-hidden rounded-xl touch-manipulation',
        className,
      )}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
      {...otherProps}
    >
      <div className="relative flex flex-1 min-h-0">
        <CardFace
          hearts={baseHearts}
          team={team}
          className="absolute inset-0 pointer-events-none"
        />
        {fallingCardHearts !== null && (
          <CardFace
            ref={overlayRef}
            hearts={fallingCardHearts}
            team={team}
            className="absolute inset-0 z-10 pointer-events-none"
          />
        )}
        {risingCardHearts !== null && (
          <CardFace
            ref={risingOverlayRef}
            hearts={risingCardHearts}
            team={team}
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              transform: 'translateY(100%)',
              opacity: 0,
            }}
          />
        )}
      </div>
    </div>
  )
}
