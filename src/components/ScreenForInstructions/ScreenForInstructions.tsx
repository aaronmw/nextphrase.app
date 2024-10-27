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
    Gather an <span className="border-b-4 border-primaryColor-500">even</span>{' '}
    number of people. Sit or stand in a circle.
  </>,
  <>
    You, the phone-holder, are on{' '}
    <span className="text-teamAColor-500">Team A</span>. The person next to you
    is on <span className="text-teamBColor-500">Team B</span>, then{' '}
    <span className="text-teamAColor-500">Team A</span>, and so on.
  </>,
  <div
    className="
      relative
      my-3
      rounded-md
      border-2
      border-white/20
      p-3
      pt-4
      text-center
      text-white
    "
  >
    <div
      className="
        absolute
        left-1/2
        top-0
        rounded-full
        border-4
        border-white
        bg-bgColor
        px-1
        text-white
        -translate-x-1/2
        -translate-y-1/2
      "
    >
      Pro Tip
    </div>
    <span className="opacity-70">Just tell everyone:</span>{' '}
    <span className="block -indent-2">
      &ldquo;every other person is your teammate.&rdquo;
    </span>
  </div>,
  <>
    <span className="text-teamAColor-500">Team A</span> goes first. Hit{' '}
    <span className="text-primaryColor-500">“Start.”</span>
  </>,
  <>
    A timer starts, and a phrase pops up.{' '}
    <span className="text-teamAColor-500">Team A</span> needs to guess it while
    the phone-holder gives clues without using any words in the phrase, rhyming,
    or other shameless tricks.
  </>,
  <>
    Once they guess it, pass the phone left to someone who will be on{' '}
    <span className="text-teamBColor-500">Team B</span>. Now it&rsquo;s their
    turn to guess.
  </>,
  <>
    When the timer&rsquo;s up, whichever team is guessing loses a heart: press
    the team&rsquo;s button to mark a loss.
  </>,
  <>The first team to lose all 7 hearts loses. The other team wins.</>,
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
                  text-balance
                  text-xs
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
