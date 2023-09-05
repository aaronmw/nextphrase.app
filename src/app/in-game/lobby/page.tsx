"use client"

import { AppContainer } from "@/app/client-components/AppContainer"
import { AppHeader } from "@/app/client-components/AppHeader"
import { Wick } from "@/app/client-components/Bomb"
import { Icon } from "@/app/client-components/Icon"
import { Points } from "@/app/client-components/Points"
import { ScoreButton } from "@/app/client-components/ScoreButton"
import { useAppContext } from "@/app/context"

export default () => {
  const { state } = useAppContext()

  const { pointsForA, pointsForB } = state

  return (
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
          <a href="/settings">
            <Icon name="gear" />
          </a>
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
  )
}
