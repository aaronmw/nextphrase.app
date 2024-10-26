'use client'

import { Icon } from '@/components/Icon'
import { useEffect, useState } from 'react'
import { useIsClient, useSessionStorage } from 'usehooks-ts'

export function InstallPrompt() {
  const isClient = useIsClient()
  const [hasSeenPrompt, setHasSeenPrompt] = useSessionStorage(
    'has-seen-prompt',
    'false',
  )
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
  }, [])

  const handleClickDismiss = () => {
    setHasSeenPrompt('true')
  }

  if (!isClient || isStandalone || hasSeenPrompt === 'true') {
    return null
  }

  return (
    <div
      className="
        fixed
        inset-0
        flex
        flex-col
        items-center
        justify-center
        bg-bgColor/80
        p-2
        backdrop-blur-md
      "
    >
      <div
        className="
          relative
          flex
          flex-col
          gap-1
          text-balance
          rounded-md
          border-4
          border-white
          bg-secondaryColor-950
          p-2
          text-xs
          font-normal
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
            absolute
            right-0
            top-0
            z-10
            flex
            size-6
            items-center
            justify-center
            rounded-full
            border-4
            border-white
            bg-primaryColor-400
            -translate-y-1/3
            translate-x-1/3
          "
          onClick={handleClickDismiss}
        >
          <Icon name="solid:xmark" />
        </button>
      </div>
    </div>
  )
}
