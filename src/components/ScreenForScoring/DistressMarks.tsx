'use client'

import { usePrevious } from '@/lib/usePrevious'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  CARD_SPRITES,
  getSpriteOriginClass,
  getSpritePositionClass,
  SPRITE_SCALE_FACTOR,
} from './cardSprites'

const TRANSITION_MS = 2000

interface DistressMarksProps {
  heartsLeft: number
  flip?: boolean
  flipX?: boolean
}

function MarksLayer({
  heartsLeft,
  opacity,
  transitionMs,
}: {
  heartsLeft: number
  opacity: number
  transitionMs: number
}) {
  const spriteKeys = CARD_SPRITES[String(heartsLeft)] ?? []
  if (spriteKeys.length === 0) return null
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        opacity,
        transition: `opacity ${transitionMs}ms`,
      }}
    >
      {spriteKeys.map(key => (
        <img
          alt=""
          className={twMerge(
            'absolute h-auto w-auto max-w-none',
            getSpritePositionClass(key),
            getSpriteOriginClass(key),
          )}
          key={key}
          src={`/card-images/${key}.svg`}
          style={{ transform: `scale(${SPRITE_SCALE_FACTOR})` }}
        />
      ))}
    </div>
  )
}

export function DistressMarks({
  heartsLeft,
  flip = false,
  flipX = false,
}: DistressMarksProps) {
  const prevHearts = usePrevious(heartsLeft) ?? heartsLeft
  const [transitionFrom, setTransitionFrom] = useState<number | null>(null)
  const [fromVisible, setFromVisible] = useState(true)

  useEffect(() => {
    if (heartsLeft !== prevHearts) {
      setFromVisible(true)
      setTransitionFrom(prevHearts)
    }
  }, [heartsLeft, prevHearts])

  useEffect(() => {
    if (transitionFrom === null) return
    const startId = setTimeout(() => setFromVisible(false), 50)
    const doneId = setTimeout(() => setTransitionFrom(null), 50 + TRANSITION_MS)
    return () => {
      clearTimeout(startId)
      clearTimeout(doneId)
    }
  }, [transitionFrom])

  const containerTransform = [flipX && 'scaleX(-1)', flip && 'scale(-1, -1)']
    .filter(Boolean)
    .join(' ')

  const containerStyle =
    containerTransform ?
      { transform: containerTransform, transformOrigin: 'center' as const }
    : undefined

  const isTransitioning =
    transitionFrom !== null || heartsLeft !== prevHearts
  const fromValue = transitionFrom ?? prevHearts
  const showFrom =
    transitionFrom === null || fromVisible

  if (isTransitioning) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={containerStyle}
      >
        <MarksLayer
          heartsLeft={fromValue}
          opacity={showFrom ? 1 : 0}
          transitionMs={TRANSITION_MS}
        />
        <MarksLayer
          heartsLeft={heartsLeft}
          opacity={showFrom ? 0 : 1}
          transitionMs={TRANSITION_MS}
        />
      </div>
    )
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10"
      style={containerStyle}
    >
      <MarksLayer
        heartsLeft={heartsLeft}
        opacity={1}
        transitionMs={0}
      />
    </div>
  )
}
