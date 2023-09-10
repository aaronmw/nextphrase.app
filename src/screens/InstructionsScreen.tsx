import { AppContainer } from "components/AppContainer"
import { AppHeader } from "components/AppHeader"
import { CircularLayout } from "components/CircularLayout"
import { Icon } from "components/Icon"
import { ScreenContainer } from "components/ScreenContainer"
import { useAppContext } from "context"
import { MouseEventHandler, useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

const CIRCULAR_PLAYER_SIZE = "3.5rem"
const NUM_DEMO_PLAYERS = 6

export const InstructionsScreen = ({ isActive = false }) => {
  const { dispatch, state } = useAppContext()

  const { activePhrases } = state

  const [counter, setCounter] = useState(0)

  const angleOfPhone = (360 / NUM_DEMO_PLAYERS) * counter

  const highlightedLetter = counter % 2 === 0 ? "A" : "B"

  const handleClickBackButton: MouseEventHandler = () => {
    dispatch({
      type: "setState",
      payload: { activeScreenName: "intro" },
    })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setCounter(counter + 1)
    }, 1500)

    return () => clearTimeout(timer)
  }, [counter])

  return (
    <ScreenContainer className={twMerge(!isActive && `left-full`)}>
      <AppContainer
        className="
        grid-cols-howToPlay
        grid-rows-howToPlay
        grid-areas-howToPlay
      "
      >
        <AppHeader
          className="grid-in-header"
          contentInCenter="How to Play"
          contentOnLeft={
            <Icon
              className="cursor-pointer"
              name="chevron-left"
              onClick={handleClickBackButton}
            />
          }
          contentOnRight={
            <Icon
              className="invisible"
              name="xmark"
            />
          }
        />

        <div className="overflow-auto grid-in-content">
          <div
            className="
            flex
            h-full
            w-full
            flex-col
            items-center
            justify-center
            gap-6
          "
          >
            <CircularLayout
              diameter="90vw"
              itemSize={CIRCULAR_PLAYER_SIZE}
              items={"AB"
                .repeat(NUM_DEMO_PLAYERS / 2)
                .split("")
                .map((letter, index) => (
                  <div
                    className={twMerge(
                      letter.startsWith("A")
                        ? "bg-teamAColor-500"
                        : "bg-teamBColor-500",
                      `
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    rounded-full
                    text-2xl
                    font-bold
                  `,
                    )}
                    key={`${letter}-${index}`}
                  >
                    {letter}
                  </div>
                ))}
            />

            <div className="flex flex-col gap-3 text-xl">
              <div>
                An even number of players (4 or more) stand in a circle. Team A
                starts with you, then — moving clockwise — Team B, and so on.
                Remember your teams!
              </div>
            </div>
          </div>

          <div
            className="
            flex
            h-full
            w-full
            flex-col
            items-center
            justify-center
            gap-6
          "
          >
            <div className="relative">
              <div
                className={twMerge(
                  `
                  absolute
                  left-1/2
                  top-1/2
                  z-10
                  flex
                  h-1/3
                  w-1/3
                  -translate-x-1/2
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-md
                  border-4
                  border-white
                  px-3
                  py-1
                  text-center
                  text-xs
                  font-bold
                  uppercase
                `,
                  highlightedLetter === "A"
                    ? `bg-teamAColor-600`
                    : `bg-teamBColor-600`,
                )}
              >
                <div
                  className={twMerge(
                    `
                    absolute
                    left-1/2
                    top-0
                    -translate-x-1/2
                    -translate-y-1/2
                    whitespace-nowrap
                    rounded-full
                    bg-white
                    px-2
                  `,
                    highlightedLetter === "A"
                      ? `text-teamAColor-600`
                      : `text-teamBColor-600`,
                  )}
                >
                  Team {highlightedLetter}
                </div>
                <div>{activePhrases[counter % NUM_DEMO_PLAYERS]}</div>
              </div>

              <div
                className="
                absolute
                left-1/2
                top-1/2
                z-10
                flex
                items-center
                justify-center
                transition-all
                duration-500
              "
                style={{
                  height: `calc(${CIRCULAR_PLAYER_SIZE})`,
                  margin: `calc(${CIRCULAR_PLAYER_SIZE} / -2)`,
                  transform: [
                    `rotate(${angleOfPhone}deg)`,
                    `translateX(calc((${`70vw`} - ${CIRCULAR_PLAYER_SIZE}) / 2))`,
                    `rotate(-${angleOfPhone}deg)`,
                  ].join(" "),
                  width: `calc(${CIRCULAR_PLAYER_SIZE})`,
                }}
              >
                <div
                  className="
                  h-10
                  w-6
                  rotate-12
                  rounded-md
                  border-4
                  bg-brandColor-700

                "
                />
              </div>

              <CircularLayout
                diameter="90vw"
                itemSize={CIRCULAR_PLAYER_SIZE}
                items={"AB"
                  .repeat(NUM_DEMO_PLAYERS / 2)
                  .split("")
                  .map((letter, index) => (
                    <div
                      className={twMerge(
                        letter.startsWith(highlightedLetter)
                          ? `
                          opacity-100
                        `
                          : `
                          opacity-30
                        `,
                        letter.startsWith("A")
                          ? "bg-teamAColor-500"
                          : "bg-teamBColor-500",
                        index === counter % NUM_DEMO_PLAYERS &&
                          (letter.startsWith("A")
                            ? "bg-teamAColor-500"
                            : "bg-teamBColor-500"),
                        `
                        flex
                        h-full
                        w-full
                        items-center
                        justify-center
                        rounded-full
                        text-2xl
                        font-bold
                        transition-all
                      `,
                      )}
                      key={`${letter}-${index}`}
                    />
                  ))}
              />
            </div>

            <div className="flex flex-col gap-3 text-xl">
              <div>
                The player holding the phone lights the fuse to begin a round,
                and is presented with a phrase.
              </div>

              <div>
                To pass the phone, the player must first get one or more of
                their team mates to say the phrase, without using "rhymes with",
                "sounds like", or any other dirty tricks.
              </div>
            </div>
          </div>
        </div>
      </AppContainer>
    </ScreenContainer>
  )
}
