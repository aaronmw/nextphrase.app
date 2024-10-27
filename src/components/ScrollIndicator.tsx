'use client'

import { Icon } from '@/components/Icon'
import { useIsScrolled } from '@/lib/useIsScrolled'
import { RefObject } from 'react'
import { twMerge } from 'tailwind-merge'

interface ScrollIndicatorProps {
  scrollingElementRef?: RefObject<unknown>
}

export function ScrollIndicator({
  scrollingElementRef,
}: ScrollIndicatorProps = {}) {
  const { isScrolled, canScroll } = useIsScrolled({
    scrollingElementRef: scrollingElementRef as
      | RefObject<HTMLElement>
      | undefined,
  })

  return (
    <div
      className={twMerge(
        `
          pointer-events-none
          fixed
          bottom-0
          left-1/2
          z-10
          transition-opacity
          duration-1000
          -translate-x-1/2
          -translate-y-1/2
        `,
        canScroll && !isScrolled ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div
        className="
          flex
          size-8
          items-center
          justify-center
          rounded-full
          border-4
          border-white
          bg-primaryColor-500
        "
      >
        <Icon name="solid:chevron-down" />
      </div>
    </div>
  )
}
