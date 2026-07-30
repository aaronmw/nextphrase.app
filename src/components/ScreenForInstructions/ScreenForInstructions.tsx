'use client'

import { AppScreen } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { AppHeader } from '@/components/AppHeader'
import { Icon } from '@/components/Icon'
import { ScreenContainer } from '@/components/ScreenContainer'
import { StyledText } from '@/components/StyledText'
import { InstructionCarousel } from './InstructionCarousel'

export function ScreenForInstructions() {
  const { dispatch } = useAppContext()

  return (
    <ScreenContainer
      aria-label="How to Play"
      className="touch-pan-y"
      extendIntoBottomSafeArea
      screenName={AppScreen.Instructions}
      slotForHeader={
        <AppHeader
          centerSlot="How to Play"
          leftSlot={
            <StyledText
              as="button"
              aria-label="Back to main menu"
              className="
                bg-bgColor
                relative
                z-[110]
              "
              variant="button.tool"
              onClick={() =>
                dispatch({
                  type: 'SET_ACTIVE_SCREEN',
                  screen: AppScreen.MainMenu,
                })
              }
            >
              <Icon
                className="translate-y-px"
                name="arrow-left-long"
              />
            </StyledText>
          }
        />
      }
      slotForMain={<InstructionCarousel />}
    />
  )
}
