import { AppContainer } from "components/AppContainer"
import { Wick } from "components/Bomb"
import { Logo } from "components/Logo"
import { ScreenContainer } from "components/ScreenContainer"
import { useAppContext } from "context"
import { twMerge } from "tailwind-merge"

export const IntroScreen = ({ isActive = false }) => {
  const { dispatch, soundEffects, state } = useAppContext()

  const { pointsForA, pointsForB } = state

  const handleClickContinueGame = () => {
    dispatch({
      type: "setState",
      payload: {
        activeScreenName: "lobby",
      },
    })
  }

  const handleClickNewGame = () => {
    dispatch({
      type: "resetScores",
    })

    handleClickContinueGame()
  }

  const handleClickInstructions = () => {
    dispatch({
      type: "setState",
      payload: {
        activeScreenName: "instructions",
      },
    })
  }

  const handleClickOptions = () => {
    dispatch({
      type: "setState",
      payload: {
        activeScreenName: "options",
      },
    })
  }

  return (
    <ScreenContainer className={twMerge(!isActive && `left-full`)}>
      <AppContainer
        className="
          grid-cols-intro
          grid-rows-intro
          grid-areas-intro
        "
      >
        <div
          className="
            relative
            flex
            flex-grow
            flex-col
            items-center
            justify-center
            gap-12
            grid-in-logo
          "
        >
          <div
            className="
              relative
              flex
              aspect-square
              w-[70vw]
              items-center
              justify-center
            "
          >
            <Logo className="rotate-12" />

            <Wick
              className="
                absolute
                left-1/2
                top-0
                -z-10
                h-8
                -translate-y-1/3
                translate-x-full
                rotate-12
              "
              isIgnited={true}
            />
          </div>
        </div>

        <div
          className="
            flex
            flex-col
            items-center
            gap-3
            grid-in-buttons
          "
        >
          {!!(pointsForA || pointsForB) && (
            <button
              className="text-accentColor-500"
              onClick={handleClickContinueGame}
            >
              Continue Game
            </button>
          )}

          <button
            className="text-accentColor-500"
            onClick={handleClickNewGame}
          >
            New Game
          </button>

          <button onClick={handleClickInstructions}>How to Play</button>

          <button onClick={handleClickOptions}>Options</button>
        </div>
      </AppContainer>
    </ScreenContainer>
  )
}
