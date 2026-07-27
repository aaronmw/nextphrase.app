'use client'

import { AppScreen } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { AppHeader } from '@/components/AppHeader'
import { Icon } from '@/components/Icon'
import { ScreenContainer } from '@/components/ScreenContainer'
import { ScrollIndicator } from '@/components/ScrollIndicator'
import { StyledText } from '@/components/StyledText'
import { useRef } from 'react'

const instructions = [
  {
    id: 'make-teams',
    text: (
      <>
        Make <strong className="font-bold">two teams</strong> by alternating
        around a circle:{' '}
        <strong className="font-bold">every other person</strong> is
        your&nbsp;teammate.
      </>
    ),
  },
  {
    id: 'give-clues',
    text: (
      <>
        <strong className="text-teamAColor-500 font-bold">
          Team A starts.
        </strong>{' '}
        <strong className="font-bold">Give clues</strong> without saying{' '}
        <strong className="font-bold">any words in the phrase</strong> or&nbsp;
        <strong className="font-bold">rhyming</strong>.
      </>
    ),
  },
  {
    id: 'pass-the-phone',
    text: (
      <>
        When they guess it,{' '}
        <strong className="font-bold">slide the team selector</strong> and{' '}
        <strong className="font-bold">pass the phone left</strong>. Keep going
        until <strong className="font-bold">time runs&nbsp;out.</strong>
      </>
    ),
  },
  {
    id: 'lose-hearts',
    text: (
      <>
        <strong className="font-bold">
          The guessing team automatically loses a heart
        </strong>{' '}
        when time&rsquo;s up.{' '}
        <strong className="font-bold">
          The first team to lose all 7 hearts&nbsp;loses.
        </strong>
      </>
    ),
  },
]

export function ScreenForInstructions() {
  const { dispatch } = useAppContext()
  const scrollingElementRef = useRef<HTMLDivElement>(null)

  return (
    <ScreenContainer
      className="touch-auto"
      screenName={AppScreen.Instructions}
      slotForHeader={
        <AppHeader
          centerSlot="How to Play"
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
          className="
            scrollbar-styled
            absolute
            inset-0
            overflow-y-auto
            px-3
            text-white
          "
          ref={scrollingElementRef}
        >
          <ScrollIndicator scrollingElementRef={scrollingElementRef} />

          <div
            className="
              flex
              min-h-full
              flex-col
              justify-center
              py-4
            "
          >
            <ul className="w-full shrink-0">
              {instructions.map((instruction, index) => (
                <li key={instruction.id}>
                  <p
                    className="
                      text-center
                      text-xs
                      font-normal
                    "
                  >
                    {instruction.text}
                  </p>

                  {index < instructions.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="p-2"
                    >
                      <hr className="border-borderColor" />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      }
    />
  )
}
