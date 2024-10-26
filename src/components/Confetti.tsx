import { useEffect, useState } from 'react'
import ReactConfetti from 'react-confetti'
import ConfettiType from 'react-confetti/dist/types/Confetti'

interface ConfettiProps {
  trigger: boolean
  onComplete?: (confetti?: ConfettiType) => void
  colors: string[]
}

export function Confetti({ trigger, onComplete, colors }: ConfettiProps) {
  const [isCelebrating, setIsCelebrating] = useState(false)

  useEffect(() => {
    if (trigger) {
      setIsCelebrating(true)
    }
  }, [trigger])

  return (
    <ReactConfetti
      className={`
        pointer-events-none
        fixed
        inset-3
        z-[100]
      `}
      colors={colors}
      initialVelocityY={{
        min: -10,
        max: 10,
      }}
      initialVelocityX={10}
      gravity={0.05}
      recycle={true}
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
