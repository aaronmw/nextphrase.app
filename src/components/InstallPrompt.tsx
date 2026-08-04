'use client'

import { Icon } from '@/components/Icon'
import { PreventOrphans } from '@/components/PreventOrphans'
import { StyledText } from '@/components/StyledText'
import {
  getAppDisplayModeServerSnapshot,
  isAppRunningStandalone,
  subscribeToAppDisplayMode,
} from '@/lib/appDisplayMode'
import { useSyncExternalStore } from 'react'
import { useIsClient, useSessionStorage } from 'usehooks-ts'

export function InstallPrompt() {
  const isClient = useIsClient()
  const [hasSeenPrompt, setHasSeenPrompt] = useSessionStorage(
    'has-seen-prompt',
    'false',
  )
  const isStandalone = useSyncExternalStore(
    subscribeToAppDisplayMode,
    isAppRunningStandalone,
    getAppDisplayModeServerSnapshot,
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
          bg-bgColor
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
          <p>
            <PreventOrphans>For the best time:</PreventOrphans>
          </p>
          <p className="whitespace-nowrap">
            <PreventOrphans>
              Tap{' '}
              <span className="text-primaryColor-400">
                <Icon name="regular:arrow-up-from-square" /> Share
              </span>{' '}
              then
            </PreventOrphans>
          </p>
          <p className="text-primaryColor-400 whitespace-nowrap">
            <PreventOrphans>
              <Icon name="regular:square-plus" /> Add to Home Screen
            </PreventOrphans>
          </p>
        </div>

        <StyledText
          as="button"
          variant="button.tertiary"
          type="button"
          onClick={handleClickDismiss}
        >
          Play Anyway
        </StyledText>
      </div>
    </div>
  )
}
