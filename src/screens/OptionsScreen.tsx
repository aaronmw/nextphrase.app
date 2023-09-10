import { AppContainer } from "components/AppContainer"
import { AppHeader } from "components/AppHeader"
import { Icon } from "components/Icon"
import { Option } from "components/Option"
import { OptionGroup } from "components/OptionGroup"
import { ScreenContainer } from "components/ScreenContainer"
import { useAppContext } from "context"
import { phrasesByListName } from "phrasesByListName"
import { MouseEventHandler } from "react"
import { twMerge } from "tailwind-merge"
import { ListName } from "types"

export const OptionsScreen = ({ isActive = false }) => {
  const { dispatch, state } = useAppContext()

  const { activeListNames, shouldRotateScreen } = state

  const listNames = Object.keys(phrasesByListName) as ListName[]

  const handleClickBackButton: MouseEventHandler = () => {
    dispatch({
      type: "setState",
      payload: {
        activeScreenName: "intro",
      },
    })
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
    <ScreenContainer className={twMerge(!isActive && `left-full`)}>
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
    </ScreenContainer>
  )
}
