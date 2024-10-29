'use client'

import { AppScreen } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { AppHeader } from '@/components/AppHeader'
import { Icon } from '@/components/Icon'
import { ScreenContainer } from '@/components/ScreenContainer'
import { StyledText } from '@/components/StyledText'
import { ChangeEvent, useEffect } from 'react'

interface CheckboxProps {
  checked: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const Checkbox = ({ checked, onChange }: CheckboxProps) => {
  const { sounds } = useAppContext()

  useEffect(() => {
    sounds.playSound('spacebar-click')
  }, [checked])

  return (
    <input
      checked={checked}
      className="
        rounded-sm
        border-none
        bg-primaryColor-700
        text-primaryColor-500
        !outline-primaryColor-400
        transition-all
        checked:bg-primaryColor-500
      "
      type="checkbox"
      onChange={onChange}
    />
  )
}

export function ScreenForOptions() {
  const { state, dispatch } = useAppContext()
  const { categoriesById, disabledCategoryIds, rotateScreen } = state

  function handleClickCheckbox(
    categoryId: string,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const { checked } = event.target

    dispatch({
      type: checked ? 'ENABLE_CATEGORY_ID' : 'DISABLE_CATEGORY_ID',
      categoryId,
    })
  }

  function handleClickRotateScreen(event: ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target
    dispatch({ type: 'SET_ROTATE_SCREEN', rotateScreen: checked })
  }

  return (
    <ScreenContainer
      screenName={AppScreen.Options}
      slotForHeader={
        <AppHeader
          centerSlot="Options"
          leftSlot={
            <StyledText
              as="button"
              variant="button.tool"
              onClick={() =>
                dispatch({
                  type: 'SET_ACTIVE_SCREEN',
                  screen: AppScreen.MainMenu,
                })
              }
            >
              <Icon name="arrow-left-long" />
            </StyledText>
          }
        />
      }
      slotForMain={
        <div
          className={`
            flex
            flex-col
            gap-y-2
            px-3
          `}
        >
          <div>
            <StyledText variant="label">Categories</StyledText>

            {Object.entries(categoriesById).map(([categoryId, category]) => (
              <div
                className={`
                  flex
                  items-center
                  justify-between
                `}
                key={categoryId}
              >
                <h2>{category.label}</h2>

                <Checkbox
                  checked={disabledCategoryIds.includes(categoryId) === false}
                  onChange={handleClickCheckbox.bind(null, categoryId)}
                />
              </div>
            ))}
          </div>

          <div>
            <StyledText variant="label">Sound Boost</StyledText>

            <div
              className={`
                flex
                items-center
                justify-between
              `}
            >
              <div>Rotate Screen</div>
              <div>
                <Checkbox
                  checked={rotateScreen}
                  onChange={handleClickRotateScreen}
                />
              </div>
            </div>
          </div>
        </div>
      }
    />
  )
}
