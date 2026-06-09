'use client'

import { Icon } from '@/components/Icon'
import { useIsClient, useSessionStorage } from 'usehooks-ts'

export function InstallPrompt() {
  const isClient = useIsClient()
  const [hasSeenPrompt, setHasSeenPrompt] = useSessionStorage(
    'has-seen-prompt',
    'false',
  )
  const isStandalone =
    isClient && window.matchMedia('(display-mode: standalone)').matches

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
        z-50
        flex
        flex-col
        items-center
        justify-center
        p-2
        backdrop-blur-md
      "
    >
      <div
        className="
          bg-secondaryColor-950
          relative
          flex
          flex-col
          gap-1
          rounded-md
          border-4
          border-white
          p-2
          text-xs
          font-normal
          text-balance
        "
      >
        <p>For the best time,</p>

        <ol
          className="
            flex
            list-decimal
            flex-col
            gap-1
            pl-3
          "
        >
          <li>
            Tap the{' '}
            <span className="text-primaryColor-400">
              Share Button <Icon name="regular:arrow-up-from-square" />
            </span>
          </li>
          <li>
            <span className="text-primaryColor-400">
              Add to Home Screen <Icon name="regular:square-plus" />
            </span>
          </li>
        </ol>

        <button
          className="
            bg-primaryColor-400
            absolute
            top-0
            right-0
            z-10
            flex
            size-6
            translate-x-1/3
            -translate-y-1/3
            items-center
            justify-center
            rounded-full
            border-4
            border-white
          "
          onClick={handleClickDismiss}
        >
          <Icon name="solid:xmark" />
        </button>
      </div>
    </div>
  )
}
