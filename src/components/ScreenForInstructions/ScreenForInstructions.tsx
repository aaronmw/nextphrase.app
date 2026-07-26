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
  <>
    Make two teams by alternating around a circle: every other person is your
    teammate.
  </>,
  <>
    <span className="text-teamAColor-500">Team A</span> starts. Give clues
    without saying any words in the phrase or rhyming.
  </>,
  <>
    When they guess it, slide the team selector and pass the phone left. Keep
    going until time runs out.
  </>,
  <>
    The guessing team automatically loses a heart when time&rsquo;s up. The
    first team to lose all 7 hearts loses.
  </>,
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
            flex
            flex-col
            gap-y-2
            overflow-y-auto
            px-3
            text-white
          "
          ref={scrollingElementRef}
        >
          <ScrollIndicator scrollingElementRef={scrollingElementRef} />

          <ul className="flex flex-col gap-3 pb-12">
            {instructions.map((instruction, index) => (
              <li
                className="
                  text-left
                  text-xs
                  font-light
                "
                key={index}
              >
                {instruction}
              </li>
            ))}
          </ul>
        </div>
      }
    />
  )
}
