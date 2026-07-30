'use client'

import { Icon } from '@/components/Icon'
import { StyledText } from '@/components/StyledText'
import { useSyncExternalStore } from 'react'
import { useIsClient, useSessionStorage } from 'usehooks-ts'

const standaloneMediaQuery = '(display-mode: standalone)'

function subscribeToStandaloneMode(onChange: () => void) {
  const mediaQuery = window.matchMedia(standaloneMediaQuery)
  mediaQuery.addEventListener('change', onChange)

  return () => mediaQuery.removeEventListener('change', onChange)
}

function getStandaloneModeSnapshot() {
  return window.matchMedia(standaloneMediaQuery).matches
}

function getStandaloneModeServerSnapshot() {
  return false
}

export function InstallPrompt() {
  const isClient = useIsClient()
  const [hasSeenPrompt, setHasSeenPrompt] = useSessionStorage(
    'has-seen-prompt',
    'false',
  )
  const isStandalone = useSyncExternalStore(
    subscribeToStandaloneMode,
    getStandaloneModeSnapshot,
    getStandaloneModeServerSnapshot,
  )

  const handleClickDismiss = () => {
    setHasSeenPrompt('true')
  }

  if (!isClient || isStandalone || hasSeenPrompt === 'true') {
    return null
  }

  return (
    <div
      className="
        bg-bgColor/80
        fixed
        inset-0
        flex
        flex-col
        items-center
        justify-center
        p-4
        backdrop-blur-md
      "
    >
      <div
        className="
          bg-secondaryColor-950
          border-neutralColor-100
          relative
          flex
          w-full
          max-w-sm
          flex-col
          gap-2
          rounded-md
          border-4
          p-4
          text-xs
          text-pretty
        "
      >
        <div className="text-center leading-relaxed">
          <p>For the best time:</p>
          <p className="whitespace-nowrap">
            Tap{' '}
            <span className="text-primaryColor-400">
              <Icon name="regular:arrow-up-from-square" /> Share
            </span>{' '}
            then
          </p>
          <p className="text-primaryColor-400 whitespace-nowrap">
            <Icon name="regular:square-plus" /> Add to Home Screen
          </p>
        </div>

        <StyledText
          as="button"
          className="border-0"
          variant="button.secondary"
          type="button"
          onClick={handleClickDismiss}
        >
          Play Anyway
        </StyledText>
      </div>
    </div>
  )
}
