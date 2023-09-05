"use client"

import random from "lodash/random"
import { ComponentPropsWithoutRef } from "react"
import Confetti from "react-confetti"
import { twMerge } from "tailwind-merge"
import colors from "tailwindcss/colors"
import { Flicker } from "./Flicker"

export { Wick }
export type { WickProps }

interface WickProps extends ComponentPropsWithoutRef<"div"> {
  isIgnited?: boolean
}

const SPARK_CANVAS_SIZE = 300

const Wick = ({ children, className, isIgnited, ...otherProps }: WickProps) => {
  return (
    // The wick itself
    <div
      className={twMerge(
        `
          relative
          h-16
          w-2
          rounded-t-full
        `,
        className,
      )}
      style={{
        backgroundImage: `url(https://public.agriconomie.com/imgbin_rope-euclidean-drawing-png.png)`,
        backgroundSize: `cover`,
        backgroundRepeat: `repeat-y`,
        backgroundPosition: `center`,
      }}
      {...otherProps}
    >
      <div
        className="
          relative
          h-full
          w-full
          overflow-hidden
          rounded-t-full
        "
      >
        {isIgnited && (
          <>
            {/* Red glow */}
            <div
              className="
                absolute
                h-4
                w-full
                bg-gradient-to-b
                from-red-500
                to-red-500/0
              "
            />

            {/* upper white glow */}
            <div
              className="
                absolute
                h-2
                w-full
                bg-gradient-to-b
                from-white
                to-white/0
              "
            />
          </>
        )}

        {/* lower dark shadow */}
        <div
          className="
            absolute
            bottom-0
            h-4
            w-full
            bg-gradient-to-t
            from-appBackgroundColor
            to-appBackgroundColor/0
          "
        />
      </div>

      {isIgnited && (
        <>
          <Flicker
            className="w-10"
            maxOpacity={0.2}
            minOpacity={0.1}
          />

          <Flicker
            className="
              w-2
              bg-amber-50
            "
            maxOpacity={1}
            minOpacity={0.8}
          />

          <div
            className="
              absolute
              left-1/2
              top-0
              -translate-x-1/2
              -translate-y-1/2
            "
            style={{
              width: `${SPARK_CANVAS_SIZE}px`,
              height: `${SPARK_CANVAS_SIZE}px`,
            }}
          >
            <Confetti
              colors={[
                colors.amber[100],
                colors.amber[200],
                colors.amber[300],
                colors.amber[400],
                colors.orange[100],
                colors.orange[200],
                colors.orange[300],
                colors.orange[400],
              ]}
              confettiSource={{
                h: 0,
                w: 0,
                x: SPARK_CANVAS_SIZE / 2,
                y: SPARK_CANVAS_SIZE / 2 + 5,
              }}
              drawShape={(ctx) => {
                ctx.beginPath()
                ctx.arc(0, 0, random(1, 2), 0, 2 * Math.PI)
                ctx.fill()
              }}
              friction={1.4}
              gravity={0.5}
              height={SPARK_CANVAS_SIZE}
              initialVelocityX={4}
              numberOfPieces={20}
              recycle={true}
              run={true}
              tweenDuration={20000}
              width={SPARK_CANVAS_SIZE}
            />
          </div>
        </>
      )}
    </div>
  )
}
