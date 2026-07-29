'use client'

import { resolveCssColor, THEME_COLORS_CHANGED_EVENT } from '@/app/theme'
import { createPortal } from 'react-dom'
import { type ReactNode, useLayoutEffect, useState } from 'react'
import ReactConfetti from 'react-confetti'

interface ConfettiProps {
  trigger: boolean
  recycle?: boolean
  onComplete?: (confetti?: { reset: () => void }) => void
  colors: string[]
  overlay?: ReactNode
}

export function Confetti({
  trigger,
  recycle = true,
  onComplete,
  colors,
  overlay,
}: ConfettiProps) {
  const [, setThemeRevision] = useState(0)

  useLayoutEffect(() => {
    const refreshColors = () => setThemeRevision(revision => revision + 1)
    window.addEventListener(THEME_COLORS_CHANGED_EVENT, refreshColors)

    return () => {
      window.removeEventListener(THEME_COLORS_CHANGED_EVENT, refreshColors)
    }
  }, [])

  if (typeof document === 'undefined') return null

  const resolvedColors = colors.map(resolveCssColor)

  return createPortal(
    <>
      <ReactConfetti
        className={`
          pointer-events-none
          fixed
          inset-0
          z-[100]
        `}
        style={{
          inset: 0,
          pointerEvents: 'none',
          position: 'fixed',
          zIndex: 100,
        }}
        colors={resolvedColors}
        initialVelocityY={{
          min: -10,
          max: 10,
        }}
        initialVelocityX={10}
        gravity={0.05}
        recycle={trigger && recycle}
        run={true}
        numberOfPieces={trigger ? 500 : 0}
        onConfettiComplete={confetti => {
          confetti?.reset()
          onComplete?.(confetti)
        }}
      />
      {overlay}
    </>,
    document.body,
  )
}
