'use client'

import { forwardRef, type CSSProperties } from 'react'

export const InstructionPhone = forwardRef<HTMLDivElement>(
  function InstructionPhone(_, ref) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className="
          absolute
          top-0
          left-0
          z-20
          h-[1.8125rem]
          w-[0.95rem]
          opacity-0
        "
        data-instruction-phone-team="A"
        style={
          {
            '--alert-light-color': 'var(--color-teamAFillColor)',
            '--selector-color': 'var(--color-teamAFillColor)',
            'transition': '--alert-light-color 150ms ease',
          } as CSSProperties
        }
      >
        <span
          className="
            border-neutralColor-100
            bg-neutralColor-950
            relative
            z-10
            block
            size-full
            overflow-hidden
            rounded-[0.16rem]
            border-2
            shadow-md
          "
        >
          <span
            className="
              absolute
              inset-[0.06rem]
              overflow-hidden
              rounded-[0.1rem]
              bg-black
            "
            data-instruction-phone-screen
          >
            <span
              className="absolute inset-0"
              data-instruction-phone-game
            >
              <span
                className="
                  absolute
                  top-[0.125rem]
                  left-1/2
                  z-0
                  size-[240vmax]
                  -translate-x-1/2
                  -translate-y-1/2
                  animate-spin
                  rounded-full
                  opacity-70
                  motion-reduce:animate-none
                "
                data-instruction-phone-alert-light
                style={{
                  animationPlayState: 'paused',
                  backgroundImage: `
                    conic-gradient(
                      from 0deg,
                      transparent 10%,
                      var(--alert-light-color) 25%,
                      transparent 40%,
                      transparent 60%,
                      var(--alert-light-color) 75%,
                      transparent 90%
                    )
                  `,
                }}
              />

              <span
                className="
                  absolute
                  top-[0.08rem]
                  left-1/2
                  z-10
                  size-[0.09rem]
                  -translate-x-1/2
                  rounded-full
                  bg-[var(--alert-light-color)]
                "
                data-instruction-phone-screen-dot
              />

              <span
                className="
                  absolute
                  top-1/2
                  left-1/2
                  z-10
                  h-[0.3rem]
                  w-full
                  -translate-x-1/2
                  -translate-y-1/2
                  overflow-hidden
                "
                data-instruction-phone-phrase-viewport
              >
                {['Phrase', 'Other Phrase'].map(phrase => (
                  <span
                    className="
                      text-neutralColor-100
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      text-center
                      text-[0.12rem]
                      leading-none
                      uppercase
                    "
                    data-instruction-phone-phrase
                    key={phrase}
                  >
                    {phrase}
                  </span>
                ))}
              </span>

              <span
                className="
                  bg-neutralColor-100/30
                  absolute
                  bottom-[0.08rem]
                  left-1/2
                  z-10
                  h-[0.09rem]
                  w-[0.39rem]
                  -translate-x-1/2
                  overflow-hidden
                  rounded-full
                "
                data-instruction-phone-selector
              >
                <span
                  className="
                    absolute
                    inset-y-0
                    left-0
                    w-1/2
                    rounded-full
                    bg-[var(--selector-color)]
                    transition-[background-color,transform]
                    duration-250
                    ease-in-out
                  "
                  data-instruction-phone-selector-thumb
                />
              </span>
            </span>

            <span
              className="
                bg-neutralColor-100
                pointer-events-none
                absolute
                inset-0
                z-20
                opacity-0
              "
              data-instruction-phone-whiteout
            />

            <span
              className="
                pointer-events-none
                absolute
                inset-0
                z-[15]
                flex
                flex-col
                gap-[0.04rem]
                bg-black
                p-[0.05rem]
                opacity-0
              "
              data-instruction-phone-scoreboard
            >
              <span className="flex min-h-0 flex-1 gap-[0.04rem]">
                <span
                  className="
                    bg-teamAFillColor
                    text-textOnTeamAColor
                    flex
                    min-w-0
                    flex-1
                    items-center
                    justify-center
                    rounded-[0.035rem]
                    text-[0.11rem]
                    leading-none
                  "
                  data-instruction-phone-score-team-a
                >
                  A
                </span>
                <span
                  className="
                    bg-teamBFillColor
                    text-textOnTeamBColor
                    flex
                    min-w-0
                    flex-1
                    items-center
                    justify-center
                    rounded-[0.035rem]
                    text-[0.11rem]
                    leading-none
                  "
                  data-instruction-phone-score-team-b
                >
                  B
                </span>
              </span>
              <span
                className="
                  bg-teamAFillColor
                  text-textOnTeamAColor
                  flex
                  min-h-0
                  flex-[2]
                  items-center
                  justify-center
                  rounded-[0.035rem]
                  text-[0.1rem]
                  leading-none
                  uppercase
                "
                data-instruction-phone-score-start
              >
                Start
              </span>
            </span>
          </span>
        </span>
      </div>
    )
  },
)
