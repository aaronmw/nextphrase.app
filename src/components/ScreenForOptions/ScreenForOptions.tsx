'use client'

import {
  AppScreen,
  ROUND_DURATION_MULTIPLIERS,
  RoundDurationMultiplier,
} from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { AppHeader } from '@/components/AppHeader'
import { Icon } from '@/components/Icon'
import { InsetDivider } from '@/components/InsetDivider'
import { ScreenContainer } from '@/components/ScreenContainer'
import { StyledText } from '@/components/StyledText'
import { ChangeEvent, ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { classNames } from './classNames'

type CheckboxProps = Omit<ComponentProps<'input'>, 'type'>

const Checkbox = ({ className, onChange, ...otherProps }: CheckboxProps) => {
  const { sounds } = useAppContext()

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    sounds.playSound('spacebar-click')
    onChange?.(event)
  }

  return (
    <span
      className={twMerge('relative inline-flex size-[1em] shrink-0', className)}
    >
      <input
        className="
          peer
          bg-primaryColor-900
          !outline-primaryColor-400
          checked:bg-accentFillColor
          m-0
          size-full
          appearance-none
          rounded-sm
          border-none
          bg-none
          transition-colors
        "
        type="checkbox"
        onChange={handleChange}
        {...otherProps}
      />
      <Icon
        aria-hidden="true"
        className="
          text-textOnAccentColor
          pointer-events-none
          absolute
          inset-0
          flex
          items-center
          justify-center
          text-[0.65em]
          opacity-0
          transition-opacity
          peer-checked:opacity-100
        "
        name="check"
      />
    </span>
  )
}

const checkboxRowClassName = `
  flex
  cursor-pointer
  items-center
  justify-between
`

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
      extendIntoBottomSafeArea
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
            overflow-y-auto
            px-3
            pb-[calc(0.75rem+env(safe-area-inset-bottom))]
          `}
        >
          <div className={classNames.fieldGroup}>
            <StyledText variant="label">Phrase Categories</StyledText>

            <div className="flex flex-col">
              {Object.entries(categoriesById).map(([categoryId, category]) => (
                <label
                  className={checkboxRowClassName}
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
          </div>

          <InsetDivider />

          <fieldset className={classNames.fieldGroup}>
            <StyledText
              as="legend"
              variant="label"
            >
              Round Duration
            </StyledText>

            <div className={classNames.hardEdgeControlGroup}>
              <div
                className="
                  border-neutralColor-100
                  grid
                  grid-cols-3
                  overflow-hidden
                  rounded-sm
                  border-4
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
                          peer-checked:bg-accentFillColor
                          peer-focus-visible:ring-primaryColor-100
                          text-neutralColor-100
                          peer-checked:text-textOnAccentColor
                          flex
                          items-center
                          justify-center
                          py-1
                          text-xs
                          transition-colors
                          peer-focus-visible:ring-2
                          peer-focus-visible:ring-inset
                        `,
                        index > 0 && 'border-neutralColor-100 border-l-4',
                      )}
                    >
                      {getRoundDurationLabel(multiplier)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </fieldset>

          <InsetDivider />

          <label
            className={checkboxRowClassName}
            htmlFor="countdown-enabled"
          >
            <span>Countdown</span>
            <Checkbox
              checked={countdownEnabled}
              id="countdown-enabled"
              onChange={handleClickCountdown}
            />
          </label>

          <InsetDivider />

          <div className={classNames.fieldGroup}>
            <StyledText variant="label">Sound Boost</StyledText>

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
                  text-neutralColor-100
                  col-start-1
                  row-start-2
                  text-xs
                  leading-tight
                  font-normal
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
