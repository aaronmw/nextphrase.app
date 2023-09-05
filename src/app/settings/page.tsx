"use client"

import { AppContainer } from "@/app/client-components/AppContainer"
import { AppHeader } from "@/app/client-components/AppHeader"
import { Icon } from "@/app/client-components/Icon"
import { useAppContext } from "@/app/context"
import { phrasesByListName } from "@/app/phrasesByListName"
import { ListName } from "@/app/types"
import { useRouter } from "next/navigation"
import { ChangeEventHandler, MouseEventHandler } from "react"
import { twMerge } from "tailwind-merge"
import { Option } from "./Option"
import { OptionGroup } from "./OptionGroup"

export default () => {
  const router = useRouter()

  const { dispatch, state } = useAppContext()

  const { activeListNames, shouldRotateScreen } = state

  const listNames = Object.keys(phrasesByListName) as ListName[]

  const handleClickBackButton: MouseEventHandler = () => {
    router.back()
  }

  const handleToggleRotateScreen = () => {
    dispatch({
      type: "setState",
      payload: {
        shouldRotateScreen: !shouldRotateScreen,
      },
    })
  }

  const handleToggleList = (listName: ListName) => {
    dispatch({
      type: "toggleActiveList",
      payload: {
        listName,
      },
    })
  }

  return (
    <AppContainer
      className="
        grid-cols-settings
        grid-rows-settings
        grid-areas-settings
      "
    >
      <AppHeader
        className="grid-in-header"
        contentInCenter="Settings"
        contentOnLeft={
          <Icon
            name="chevron-left"
            onClick={handleClickBackButton}
          />
        }
        contentOnRight={
          <Icon
            className="invisible"
            name="chevron-left"
          />
        }
      />

      <div
        className="
          px-3
          grid-in-content
        "
      >
        <OptionGroup label="Include Phrases From...">
          {listNames.map((listName) => (
            <Option
              checked={activeListNames.includes(listName)}
              key={listName}
              label={listName}
              onClick={handleToggleList.bind(null, listName)}
            />
          ))}
        </OptionGroup>

        <OptionGroup label="Boost Volume">
          <Option
            checked={shouldRotateScreen}
            label="Rotate Screen"
            onClick={handleToggleRotateScreen}
          />
        </OptionGroup>
      </div>
    </AppContainer>
  )
}
