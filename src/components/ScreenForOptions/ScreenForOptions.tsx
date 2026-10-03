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
import { Description, Field, Label, Switch } from '@headlessui/react'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { classNames } from './classNames'

function OptionsGroup({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) {
  return (
    <section
      aria-label={label}
      className={classNames.fieldGroup}
    >
      <StyledText
        as="h2"
        variant="label"
      >
        {label}
      </StyledText>
      <div className="flex flex-col">{children}</div>
    </section>
  )
}

type ToggleRowProps = {
  checked: boolean
  id: string
  label: string
  description?: string
  onChange: (checked: boolean) => void
}

function ToggleRow({
  checked,
  description,
  id,
  label,
  onChange,
}: ToggleRowProps) {
  const { sounds } = useAppContext()

  function handleChange(checked: boolean) {
    sounds.playSound('spacebar-click')
    onChange(checked)
  }

  return (
    <Field className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2">
      <Label className="col-start-1 row-start-1 cursor-pointer">{label}</Label>
      <Switch
        checked={checked}
        className="
          group
          ring-neutralColor-100
          data-checked:bg-accentFillColor
          data-checked:ring-accentFillColor
          focus-visible:outline-primaryColor-400
          relative
          col-start-2
          row-start-1
          inline-flex
          h-[1em]
          w-[1.8em]
          shrink-0
          cursor-pointer
          items-center
          self-center
          rounded-full
          bg-transparent
          p-0
          ring-4
          transition-[background-color,box-shadow]
          duration-150
          ring-inset
          focus-visible:outline-2
          focus-visible:outline-offset-2
          motion-reduce:transition-none
        "
        id={id}
        onChange={handleChange}
      >
        <span
          aria-hidden="true"
          className="
            bg-neutralColor-100
            group-data-checked:bg-textOnAccentColor
            pointer-events-none
            absolute
            left-[0.1875em]
            size-[0.625em]
            rounded-full
            transition-[translate,background-color]
            duration-150
            group-data-checked:translate-x-[0.8em]
            motion-reduce:transition-none
          "
        />
      </Switch>
      {description && (
        <Description
          as="span"
          className="text-neutralColor-100 col-start-1 row-start-2 text-xs leading-tight font-normal"
        >
          {description}
        </Description>
      )}
    </Field>
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
    swipeDelayEnabled,
  } = state
  const disabledCategoryIdsSet = new Set(disabledCategoryIds)

  function handleChangeCategory(categoryId: string, checked: boolean) {
    dispatch({
      type: checked ? 'ENABLE_CATEGORY_ID' : 'DISABLE_CATEGORY_ID',
      categoryId,
    })
  }

  function handleChangeRotateScreen(rotateScreen: boolean) {
    dispatch({ type: 'SET_ROTATE_SCREEN', rotateScreen })
  }

  function handleChangeCountdown(countdownEnabled: boolean) {
    dispatch({
      type: 'SET_COUNTDOWN_ENABLED',
      countdownEnabled,
    })
  }

  function handleChangeSwipeDelay(swipeDelayEnabled: boolean) {
    dispatch({
      type: 'SET_SWIPE_DELAY_ENABLED',
      swipeDelayEnabled,
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
          <OptionsGroup label="Categories">
            {Object.entries(categoriesById).map(([categoryId, category]) => (
              <ToggleRow
                checked={!disabledCategoryIdsSet.has(categoryId)}
                id={`category-${categoryId}`}
                key={categoryId}
                label={category.label}
                onChange={handleChangeCategory.bind(null, categoryId)}
              />
            ))}
          </OptionsGroup>

          <InsetDivider />

          <OptionsGroup label="Round Options">
            <fieldset className={classNames.fieldGroup}>
              <legend>Round Duration</legend>

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

            <ToggleRow
              checked={countdownEnabled}
              id="countdown-enabled"
              label="Countdown"
              onChange={handleChangeCountdown}
            />

            <ToggleRow
              checked={swipeDelayEnabled}
              id="swipe-delay-enabled"
              label="Swipe Delay"
              onChange={handleChangeSwipeDelay}
            />
          </OptionsGroup>

          <InsetDivider />

          <OptionsGroup label="Sound Boost">
            <ToggleRow
              checked={rotateScreen}
              description="For loud environments, this points the device’s speakers towards other players"
              id="rotate-screen"
              label="Rotate Screen"
              onChange={handleChangeRotateScreen}
            />
          </OptionsGroup>
        </div>
      }
    />
  )
}
