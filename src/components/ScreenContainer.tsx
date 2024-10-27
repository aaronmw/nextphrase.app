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
  const { activeScreen, rotateScreen } = state
  const outerElementRef = useRef<HTMLDivElement>(null)
  const isActiveScreen = activeScreen === screenName

  useGSAP(
    () => {
      if (!(outerElementRef.current && isClient)) return

      const timeline = gsap.timeline({
        defaults: {
          duration: 0.5,
          ease: 'power1.inOut',
        },
      })

      timeline
        .to(outerElementRef.current, {
          visibility: isActiveScreen ? 'visible' : undefined,
          pointerEvents: isActiveScreen ? 'auto' : 'none',
        })
        .fromTo(
          '.js-inner-container',
          {
            transformOrigin: '50% -200%',
            rotation: isActiveScreen ? -90 : 0,
            opacity: isActiveScreen ? 0 : 1,
          },
          {
            rotation: isActiveScreen ? 0 : 90,
            opacity: isActiveScreen ? 1 : 0,
          },
          '<',
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
      scope: outerElementRef,
    },
  )

  useGSAP(
    () => {
      if (!(outerElementRef.current && isClient)) return

      const upperMargin = rotateScreen ? 'env(safe-area-inset-top)' : 0
      const lowerMargin = rotateScreen ? 'env(safe-area-inset-bottom)' : 0

      const timeline = gsap.timeline({
        defaults: {
          duration: 0.5,
          ease: 'power1.inOut',
          transformOrigin: 'center',
          top: upperMargin,
          bottom: lowerMargin,
        },
      })

      timeline.fromTo(
        outerElementRef.current,
        { rotate: rotateScreen ? 0 : 180 },
        { rotate: rotateScreen ? 180 : 0 },
      )
    },
    {
      dependencies: [rotateScreen, isClient],
      scope: outerElementRef,
    },
  )

  return (
    <section
      ref={outerElementRef}
      className={twMerge(
        `
          invisible
          absolute
          w-full
          origin-center
          touch-pan-x
          select-none
        `,
        className,
      )}
      {...otherProps}
    >
      <div
        className="
          js-inner-container
          absolute
          inset-0
          grid
          grid-cols-1
          grid-rows-[1.5rem,auto]
        "
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
      </div>
    </section>
  )
}
