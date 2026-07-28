'use client'

import { AppScreen } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { useRoundTransition } from '@/components/RoundTransitionContext'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ComponentProps, ReactNode, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { useIsClient } from 'usehooks-ts'

interface ScreenContainerProps extends Omit<
  ComponentProps<'section'>,
  'children'
> {
  extendIntoBottomSafeArea?: boolean
  screenName: string
  slotForHeader?: ReactNode
  slotForMain?: ReactNode
}

const roundTransitionScreens = [
  AppScreen.Scoring,
  AppScreen.Guessing,
] as string[]
const scoringVisiblePhases = ['scoringExit', 'scoringEnter']
const scoringAftermathPhases = [
  'scoringImpact',
  'scoringHeartLoss',
  'scoringGameOverExit',
  'scoringGameOverReveal',
  'scoringGameOver',
  'scoringGameOverReset',
  'scoringGameOverResetEnter',
]
const guessingVisiblePhases = [
  'guessingEnter',
  'countdown',
  'phraseEnter',
  'guessingExit',
]

function getScopedAnimationElements(outerElement: HTMLDivElement) {
  const innerContainer = outerElement.querySelector('.js-inner-container')
  const headerContainer = outerElement.querySelector('.js-header-container')
  const headerTitle = outerElement.querySelector('.js-header-title')
  const headerElements = [headerContainer, headerTitle].filter(
    Boolean,
  ) as Element[]
  const allElements = [
    outerElement,
    innerContainer,
    headerContainer,
    headerTitle,
  ].filter(Boolean) as Element[]

  return { allElements, headerElements, innerContainer }
}

export function ScreenContainer({
  className,
  extendIntoBottomSafeArea = false,
  screenName,
  slotForHeader,
  slotForMain,
  ...otherProps
}: ScreenContainerProps) {
  const isClient = useIsClient()
  const { state } = useAppContext()
  const { phase: roundTransitionPhase } = useRoundTransition()
  const { activeScreen, rotateScreen } = state
  const outerElementRef = useRef<HTMLDivElement>(null)
  const didSetInitialRotationRef = useRef(false)
  const wasRoundTransitionControlledRef = useRef(false)
  const isActiveScreen = activeScreen === screenName
  const isRoundTransitionScreen = roundTransitionScreens.includes(screenName)
  const isRoundTransitionActive = roundTransitionPhase !== 'idle'
  const isRoundTransitionControlled =
    isRoundTransitionScreen && isRoundTransitionActive

  useGSAP(
    () => {
      const outerElement = outerElementRef.current

      if (!(outerElement && isClient)) return

      const wasRoundTransitionControlled =
        wasRoundTransitionControlledRef.current
      wasRoundTransitionControlledRef.current = isRoundTransitionControlled

      if (isRoundTransitionActive && !isRoundTransitionScreen) {
        const { allElements, headerElements, innerContainer } =
          getScopedAnimationElements(outerElement)

        gsap.killTweensOf(allElements)
        gsap.set(outerElement, {
          pointerEvents: 'none',
          visibility: 'hidden',
        })
        gsap.set(innerContainer, {
          opacity: 0,
          rotation: 0,
        })
        gsap.set(headerElements, {
          yPercent: 0,
        })
        return
      }

      if (isRoundTransitionControlled) return

      if (isRoundTransitionScreen && wasRoundTransitionControlled) {
        const { allElements, headerElements, innerContainer } =
          getScopedAnimationElements(outerElement)

        gsap.killTweensOf(allElements)
        gsap.set(outerElement, {
          pointerEvents: isActiveScreen ? 'auto' : 'none',
          visibility: isActiveScreen ? 'visible' : 'hidden',
        })
        gsap.set(innerContainer, {
          opacity: isActiveScreen ? 1 : 0,
          rotation: 0,
          transformOrigin: '50% -200%',
        })
        gsap.set(headerElements, {
          yPercent: 0,
        })
        return
      }

      const timeline = gsap.timeline({
        defaults: {
          duration: 0.5,
          ease: 'power1.inOut',
        },
      })

      timeline
        .to(outerElement, {
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
      dependencies: [
        screenName,
        isActiveScreen,
        isClient,
        isRoundTransitionActive,
        isRoundTransitionControlled,
        isRoundTransitionScreen,
      ],
      scope: outerElementRef,
    },
  )

  useGSAP(
    () => {
      const outerElement = outerElementRef.current

      if (!(outerElement && isClient && isRoundTransitionControlled)) return

      const isScoringScreen = screenName === AppScreen.Scoring
      const shouldShow = isScoringScreen
        ? [...scoringVisiblePhases, ...scoringAftermathPhases].includes(
            roundTransitionPhase,
          )
        : guessingVisiblePhases.includes(roundTransitionPhase)
      const shouldReceivePointer = isScoringScreen
        ? roundTransitionPhase === 'scoringGameOver'
        : screenName === AppScreen.Guessing &&
          (roundTransitionPhase === 'countdown' ||
            roundTransitionPhase === 'phraseEnter')
      const { allElements, headerElements, innerContainer } =
        getScopedAnimationElements(outerElement)

      gsap.killTweensOf(allElements)
      gsap.set(outerElement, {
        pointerEvents: shouldReceivePointer ? 'auto' : 'none',
        visibility: shouldShow ? 'visible' : 'hidden',
      })

      gsap.set(innerContainer, {
        opacity: shouldShow ? 1 : 0,
        rotation: 0,
      })

      gsap.set(headerElements, {
        yPercent: 0,
      })
    },
    {
      dependencies: [
        roundTransitionPhase,
        isClient,
        isRoundTransitionControlled,
        screenName,
      ],
      scope: outerElementRef,
    },
  )

  useGSAP(
    () => {
      const outerElement = outerElementRef.current

      if (!(outerElement && isClient)) return

      const upperMargin = 'env(safe-area-inset-top)'
      const lowerMargin = extendIntoBottomSafeArea
        ? 0
        : 'env(safe-area-inset-bottom)'
      const nextRotation = rotateScreen ? 180 : 0

      if (!didSetInitialRotationRef.current) {
        didSetInitialRotationRef.current = true
        gsap.set(outerElement, {
          bottom: lowerMargin,
          rotate: nextRotation,
          top: upperMargin,
          transformOrigin: 'center',
        })
        return
      }

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
        outerElement,
        { rotate: rotateScreen ? 0 : 180 },
        { rotate: nextRotation },
      )
    },
    {
      dependencies: [rotateScreen, isClient, extendIntoBottomSafeArea],
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
          top-0
          right-0
          bottom-0
          left-0
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
        className={twMerge(
          `
            js-inner-container
            absolute
            inset-0
            grid
            grid-cols-1
          `,
          slotForHeader ? 'grid-rows-[2rem_auto]' : 'grid-rows-[0_auto]',
        )}
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
            z-20
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
