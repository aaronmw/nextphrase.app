"use client"

import { AppContainer } from "@/app/client-components/AppContainer"
import { AppHeader } from "@/app/client-components/AppHeader"
import { Flicker, Wick } from "@/app/client-components/Bomb"
import { Icon } from "@/app/client-components/Icon"
import { Logo } from "@/app/client-components/Logo"
import { useRouter } from "next/navigation"
import { useAppContext } from "./context"

export default () => {
  const { dispatch, sounds, state } = useAppContext()

  const router = useRouter()

  const { pointsForA, pointsForB } = state

  const handleClickNewGame = () => {
    dispatch({
      type: "resetScores",
    })

    router.push("/in-game/lobby")
  }

  return (
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
          <a href="/in-game/lobby">Continue Game</a>
        )}

        <button
          className="text-accentColor-500"
          onClick={handleClickNewGame}
        >
          New Game
        </button>

        <a href="/how-to-play">How to Play</a>

        <a href="/settings">Options</a>
      </div>
    </AppContainer>
  )
}
