'use client'

import { useAppContext } from '@/components/AppContext'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ComponentProps, ReactNode, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { useIsClient } from 'usehooks-ts'

interface ScreenContainerProps
  extends Omit<ComponentProps<'section'>, 'children'> {
  screenName: string
  slotForHeader?: ReactNode
  slotForMain?: ReactNode
}

export function ScreenContainer({
  className,
  screenName,
  slotForHeader,
  slotForMain,
  ...otherProps
}: ScreenContainerProps) {
  const isClient = useIsClient()
  const { state } = useAppContext()
  const { activeScreen } = state
  const elementRef = useRef<HTMLElement>(null)
  const isActiveScreen = activeScreen === screenName

  useGSAP(
    () => {
      if (!(elementRef.current && isClient)) return

      const timeline = gsap.timeline({
        defaults: {
          duration: 0.5,
          ease: 'power1.inOut',
          transformOrigin: '50% -200%',
        },
      })

      timeline
        .fromTo(
          elementRef.current,
          {
            visibility: isActiveScreen ? 'visible' : undefined,
            opacity: isActiveScreen ? 0 : 1,
            pointerEvents: isActiveScreen ? 'none' : 'auto',
            rotation: isActiveScreen ? -90 : 0,
          },
          {
            opacity: isActiveScreen ? 1 : 0,
            pointerEvents: isActiveScreen ? 'auto' : 'none',
            rotation: isActiveScreen ? 0 : 90,
          },
        )
        .fromTo(
          '.js-header-container',
          { yPercent: isActiveScreen ? -100 : 0 },
          { yPercent: isActiveScreen ? 0 : -100 },
        )
        .fromTo(
          '.js-header-title',
          { yPercent: isActiveScreen ? -100 : 0 },
          { yPercent: isActiveScreen ? 0 : -100 },
          '<',
        )
    },
    {
      dependencies: [screenName, isActiveScreen, isClient],
      scope: elementRef,
    },
  )

  return (
    <section
      className={twMerge(
        `
          invisible
          fixed
          inset-0
          grid
          touch-none
          select-none
          grid-cols-1
          grid-rows-[1.5rem,auto]
          translate-z-0
        `,
        className,
      )}
      ref={elementRef}
      {...otherProps}
    >
      <div
        className="
          js-header-container
          relative
          z-10
          col-start-1
          col-end-2
          row-start-1
          row-end-2
        "
      >
        {slotForHeader}
      </div>

      <div
        className="
          js-content-container
          relative
          col-start-1
          col-end-2
          row-start-2
          row-end-3
        "
      >
        {slotForMain}
      </div>
    </section>
  )
}
