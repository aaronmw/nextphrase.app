import random from "lodash/random"
import { ComponentPropsWithoutRef, useLayoutEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

export { Flicker }
export type { FlickerProps }

interface FlickerProps extends ComponentPropsWithoutRef<"div"> {
  maxOpacity?: number
  minOpacity?: number
}

const Flicker = ({
  children,
  className,
  maxOpacity = 1,
  minOpacity = 0,
  ...otherProps
}: FlickerProps) => {
  const [counter, setCounter] = useState(0)

  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      setCounter(counter + 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [counter])

  const opacity = random(minOpacity, maxOpacity, true)

  return (
    <div
      className={twMerge(
        `
          absolute
          left-1/2
          top-0
          z-10
          aspect-square
          rounded-full
          bg-amber-400
          transition-all
          duration-1000
        `,
        className,
      )}
      style={{
        filter: `blur(4px)`,
        opacity,
        transform: `
          translateX(-50%)
          translateY(-50%)
          scale(${random(0.9, 1.1)})
        `,
      }}
      {...otherProps}
    >
      {children}
    </div>
  )
}
