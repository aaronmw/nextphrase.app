import { ComponentProps, useEffect, useState } from 'react'
import ReactConfetti from 'react-confetti'
import { twMerge } from 'tailwind-merge'

interface ConfettiProps {
  trigger: boolean
  onComplete?: (confetti?: { reset: () => void }) => void
  colors: string[]
  className?: string
  style?: ComponentProps<'canvas'>['style']
}

export function Confetti({
  trigger,
  onComplete,
  colors,
  className,
  style,
}: ConfettiProps) {
  const [isCelebrating, setIsCelebrating] = useState(false)

  useEffect(() => {
    if (trigger) {
      setIsCelebrating(true)
    }
  }, [trigger])

  return (
    <ReactConfetti
      className={twMerge(
        `
          pointer-events-none
          fixed
          inset-3
          z-[100]
        `,
        className,
      )}
      style={style}
      colors={colors}
      initialVelocityY={{
        min: -10,
        max: 10,
      }}
      initialVelocityX={10}
      gravity={0.05}
      recycle={isCelebrating}
      run={isCelebrating}
      numberOfPieces={500}
      onConfettiComplete={confetti => {
        setIsCelebrating(false)
        confetti?.reset()
        onComplete?.(confetti)
      }}
    />
  )
}
