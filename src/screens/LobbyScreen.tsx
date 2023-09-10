import { AppContainer } from "components/AppContainer"
import { AppHeader } from "components/AppHeader"
import { Wick } from "components/Bomb"
import { Icon } from "components/Icon"
import { IconButton } from "components/IconButton"
import { Points } from "components/Points"
import { ScoreButton } from "components/ScoreButton"
import { ScreenContainer } from "components/ScreenContainer"
import { useAppContext } from "context"
import { MouseEventHandler } from "react"
import { twMerge } from "tailwind-merge"

export const LobbyScreen = ({ isActive = false }) => {
  const { dispatch, soundEffects, state } = useAppContext()

  const { pointsForA, pointsForB } = state

  const handleClickOptions: MouseEventHandler = (event) => {
    event.preventDefault()
    event.stopPropagation()

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
          grid
          grid-cols-lobby
          grid-rows-lobby
          gap-3
          p-3
          grid-areas-lobby
        "
      >
        <AppHeader
          className="grid-in-header"
          contentInCenter={
            <IconButton
              icon="gear"
              onClick={handleClickOptions}
            />
          }
          contentOnLeft={<Points team="A" />}
          contentOnRight={<Points team="B" />}
        />

        <ScoreButton
          className="
            w-full
            grid-in-left
          "
          team="A"
        />

        <ScoreButton
          className="
            w-full
            grid-in-right
          "
          team="B"
        />

        <a
          className="
            flex
            items-end
            justify-center
            grid-in-start
          "
          href="#"
        >
          <Wick
            className="
              origin-bottom
              scale-[2]
            "
          />
        </a>
      </AppContainer>
    </ScreenContainer>
  )
}
