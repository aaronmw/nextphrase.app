'use client'

import {
  AppScreen,
  ROUND_DURATION_MULTIPLIERS,
  RoundDurationMultiplier,
} from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { AppHeader } from '@/components/AppHeader'
import { Icon } from '@/components/Icon'
import { ScreenContainer } from '@/components/ScreenContainer'
import { StyledText } from '@/components/StyledText'
import { ChangeEvent, ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type CheckboxProps = Omit<ComponentProps<'input'>, 'type'>

const Checkbox = ({ className, onChange, ...otherProps }: CheckboxProps) => {
  const { sounds } = useAppContext()

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    sounds.playSound('spacebar-click')
    onChange?.(event)
  }

  return (
    <input
      className={twMerge(
        `
          bg-primaryColor-700
          text-primaryColor-500
          !outline-primaryColor-400
          checked:bg-primaryColor-500
          rounded-sm
          border-none
          transition-colors
        `,
        className,
      )}
      type="checkbox"
      onChange={handleChange}
      {...otherProps}
    />
  )
}

function getRoundDurationLabel(multiplier: RoundDurationMultiplier) {
  return multiplier === 0.5 ? '½×' : `${multiplier}×`
}

export function ScreenForOptions() {
  const { state, dispatch, sounds } = useAppContext()
  const {
    categoriesById,
    countdownEnabled,
    disabledCategoryIds,
    rotateScreen,
    roundDurationMultiplier,
  } = state
  const disabledCategoryIdsSet = new Set(disabledCategoryIds)

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

  function handleClickCountdown(event: ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: 'SET_COUNTDOWN_ENABLED',
      countdownEnabled: event.target.checked,
    })
  }

  function handleChangeRoundDuration(
    roundDurationMultiplier: RoundDurationMultiplier,
  ) {
    sounds.playSound('spacebar-click')
    dispatch({
      type: 'SET_ROUND_DURATION_MULTIPLIER',
      roundDurationMultiplier,
    })
  }

  return (
    <ScreenContainer
      className="touch-auto"
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
            scrollbar-styled
            absolute
            inset-0
            flex
            flex-col
            gap-y-2
            overflow-y-auto
            px-3
            pb-3
          `}
        >
          <div>
            <StyledText variant="label">Phrase Categories</StyledText>

            {Object.entries(categoriesById).map(([categoryId, category]) => (
              <label
                className={`
                  flex
                  cursor-pointer
                  items-center
                  justify-between
                `}
                htmlFor={`category-${categoryId}`}
                key={categoryId}
              >
                <span>{category.label}</span>

                <Checkbox
                  checked={!disabledCategoryIdsSet.has(categoryId)}
                  id={`category-${categoryId}`}
                  onChange={handleClickCheckbox.bind(null, categoryId)}
                />
              </label>
            ))}
          </div>

          <fieldset>
            <StyledText
              as="legend"
              variant="label"
            >
              Round Duration
            </StyledText>

            <div
              className="
                mt-0.5
                grid
                grid-cols-3
                overflow-hidden
                rounded-sm
                border-4
                border-white
              "
            >
              {ROUND_DURATION_MULTIPLIERS.map((multiplier, index) => (
                <label
                  className="relative cursor-pointer"
                  key={multiplier}
                >
                  <input
                    checked={roundDurationMultiplier === multiplier}
                    className="peer sr-only"
                    name="round-duration"
                    type="radio"
                    value={multiplier}
                    onChange={() => handleChangeRoundDuration(multiplier)}
                  />
                  <span
                    className={twMerge(
                      `
                        peer-checked:bg-primaryColor-500
                        peer-focus-visible:ring-primaryColor-100
                        flex
                        items-center
                        justify-center
                        py-1
                        text-xs
                        text-white
                        transition-colors
                        peer-checked:text-white
                        peer-focus-visible:ring-2
                        peer-focus-visible:ring-inset
                      `,
                      index > 0 && 'border-l-4 border-white',
                    )}
                  >
                    {getRoundDurationLabel(multiplier)}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label
            className="
              flex
              cursor-pointer
              items-center
              justify-between
            "
            htmlFor="countdown-enabled"
          >
            <span>Countdown</span>
            <Checkbox
              checked={countdownEnabled}
              id="countdown-enabled"
              onChange={handleClickCountdown}
            />
          </label>

          <div>
            <StyledText
              className="block"
              variant="label"
            >
              Sound Boost
            </StyledText>

            <div
              className={`
                grid
                grid-cols-[minmax(0,1fr)_auto]
                items-center
                gap-x-2
              `}
            >
              <label
                className="
                  col-start-1
                  row-start-1
                  cursor-pointer
                "
                htmlFor="rotate-screen"
              >
                Rotate Screen
              </label>
              <Checkbox
                aria-describedby="rotate-screen-description"
                checked={rotateScreen}
                className="
                  col-start-2
                  row-start-1
                  self-center
                "
                id="rotate-screen"
                onChange={handleClickRotateScreen}
              />
              <span
                className="
                  col-start-1
                  row-start-2
                  text-xs
                  leading-tight
                  font-normal
                  text-white
                "
                id="rotate-screen-description"
              >
                For loud environments, this points the device&rsquo;s speakers
                towards other players
              </span>
            </div>
          </div>
        </div>
      }
    />
  )
}
