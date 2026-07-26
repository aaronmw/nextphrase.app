'use client'

import { createPortal } from 'react-dom'
import ReactConfetti from 'react-confetti'

interface ConfettiProps {
  trigger: boolean
  recycle?: boolean
  onComplete?: (confetti?: { reset: () => void }) => void
  colors: string[]
}

export function Confetti({
  trigger,
  recycle = true,
  onComplete,
  colors,
}: ConfettiProps) {
  if (typeof document === 'undefined') return null

  return createPortal(
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
      colors={colors}
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
    />,
    document.body,
  )
}
