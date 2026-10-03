'use client'

import { forwardRef } from 'react'

export const InstructionTrophy = forwardRef<HTMLDivElement>(
  function InstructionTrophy(_, ref) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className="
        pointer-events-none
        absolute
        top-0
        left-0
        z-20
        size-[1em]
        text-[2rem]
        leading-none
        opacity-0
        backface-visible
      "
        data-instruction-trophy
      >
        <span
          className="flex size-full items-center justify-center"
          data-instruction-trophy-glyph
        >
          🏆
        </span>
      </div>
    )
  },
)
