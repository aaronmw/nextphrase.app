'use client'

import { AppScreen } from '@/app/reducer'
import { RoundTransitionPhase } from '@/components/RoundTransitionContext'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { RefObject } from 'react'

const ALERT_REST_Y_PX = 24
const COUNTDOWN_LABEL_IN_DURATION = 0.22
const COUNTDOWN_LABEL_NEXT_GAP = 0.08
const COUNTDOWN_LABEL_OUT_DURATION = 0.18
const COUNTDOWN_LABEL_STEP_DURATION = 0.8

interface UseGuessingRoundTransitionProps {
  activeScreen: AppScreen
  alertElementRef: RefObject<HTMLDivElement | null>
  countdownElementRef: RefObject<HTMLDivElement | null>
  countdownLabel: string | null
  countdownLabelElementRef: RefObject<HTMLSpanElement | null>
  finishGuessingEnter: () => void
  finishGuessingExit: () => void
  finishPhraseEnter: () => void
  handoffTrackElementRef: RefObject<HTMLDivElement | null>
  phraseElementRef: RefObject<HTMLDivElement | null>
  roundTransitionPhase: RoundTransitionPhase
  selectorElementRef: RefObject<HTMLDivElement | null>
}

export function useGuessingRoundTransition({
  activeScreen,
  alertElementRef,
  countdownElementRef,
  countdownLabel,
  countdownLabelElementRef,
  finishGuessingEnter,
  finishGuessingExit,
  finishPhraseEnter,
  handoffTrackElementRef,
  phraseElementRef,
  roundTransitionPhase,
  selectorElementRef,
}: UseGuessingRoundTransitionProps) {
  useGSAP(
    () => {
      const countdownLabelElement = countdownLabelElementRef.current

      if (!countdownLabelElement) return

      gsap.killTweensOf(countdownLabelElement)

      if (roundTransitionPhase !== 'countdown' || !countdownLabel) {
        gsap.set(countdownLabelElement, {
          autoAlpha: countdownLabel ? 1 : 0,
          yPercent: 0,
        })
        return
      }

      const timeline = gsap.timeline()

      timeline.fromTo(
        countdownLabelElement,
        { autoAlpha: 0, yPercent: -100 },
        {
          autoAlpha: 1,
          duration: COUNTDOWN_LABEL_IN_DURATION,
          ease: 'power2.out',
          yPercent: 0,
        },
      )

      if (countdownLabel !== 'GO!') {
        timeline.to(
          countdownLabelElement,
          {
            autoAlpha: 0,
            duration: COUNTDOWN_LABEL_OUT_DURATION,
            ease: 'power1.in',
          },
          COUNTDOWN_LABEL_STEP_DURATION -
            COUNTDOWN_LABEL_OUT_DURATION -
            COUNTDOWN_LABEL_NEXT_GAP,
        )
      }
    },
    {
      dependencies: [countdownLabel, roundTransitionPhase],
    },
  )

  useGSAP(
    () => {
      const alertElement = alertElementRef.current
      const countdownElement = countdownElementRef.current
      const handoffTrackElement = handoffTrackElementRef.current
      const phraseElement = phraseElementRef.current
      const selectorElement = selectorElementRef.current

      if (
        !(
          alertElement &&
          countdownElement &&
          handoffTrackElement &&
          phraseElement &&
          selectorElement
        )
      ) {
        return
      }

      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth
      const animatedElements = [
        alertElement,
        countdownElement,
        handoffTrackElement,
        phraseElement,
        selectorElement,
      ]

      gsap.killTweensOf(animatedElements)

      if (roundTransitionPhase === 'guessingEnter') {
        gsap.set(handoffTrackElement, { autoAlpha: 1, x: 0 })
        gsap.set(phraseElement, { autoAlpha: 0, xPercent: 0 })
        gsap.set(countdownElement, { autoAlpha: 0, xPercent: 0 })
        gsap.set(alertElement, {
          autoAlpha: 0,
          y: -viewportHeight,
        })
        gsap.set(selectorElement, {
          autoAlpha: 0,
          y: viewportHeight,
        })
        finishGuessingEnter()
        return
      }

      if (roundTransitionPhase === 'countdown') {
        gsap.set(alertElement, {
          autoAlpha: 0,
          x: 0,
          y: -viewportHeight,
        })
        gsap.set(selectorElement, {
          autoAlpha: 0,
          x: 0,
          y: viewportHeight,
        })
        gsap.set(countdownElement, { autoAlpha: 1, xPercent: 0 })
        gsap.set(handoffTrackElement, { autoAlpha: 1, x: 0 })
        gsap.set(phraseElement, { autoAlpha: 0, xPercent: 0 })
        return
      }

      if (roundTransitionPhase === 'phraseEnter') {
        gsap.set(handoffTrackElement, {
          autoAlpha: 1,
          x: 0,
          willChange: 'transform',
        })
        gsap.set(countdownElement, {
          autoAlpha: countdownLabel ? 1 : 0,
          xPercent: 0,
          zIndex: 20,
        })
        gsap.set(phraseElement, {
          autoAlpha: 1,
          xPercent: 0,
          willChange: 'opacity',
          zIndex: 10,
        })
        gsap.set(selectorElement, {
          autoAlpha: 1,
          y: viewportHeight,
          willChange: 'transform, opacity',
        })
        gsap.set(alertElement, {
          autoAlpha: 0,
          y: -viewportHeight,
          willChange: 'transform, opacity',
        })

        gsap
          .timeline({
            defaults: { duration: 0.3 },
            onComplete: () => {
              gsap.set(phraseElement, {
                clearProps: 'transform,opacity,visibility,willChange,zIndex',
              })
              gsap.set(countdownElement, {
                autoAlpha: 0,
                clearProps: 'transform,zIndex',
              })
              gsap.set(handoffTrackElement, {
                clearProps: 'opacity,visibility,willChange',
              })
              gsap.set(selectorElement, {
                clearProps: 'transform,opacity,visibility,willChange',
              })
              gsap.set(alertElement, {
                clearProps: 'willChange',
              })
              finishPhraseEnter()
            },
          })
          .to(
            handoffTrackElement,
            { ease: 'power2.out', x: -viewportWidth },
            0,
          )
          .to(
            selectorElement,
            { autoAlpha: 1, ease: 'power2.out', y: 0 },
            0,
          )
          .to(
            alertElement,
            {
              autoAlpha: 1,
              ease: 'power2.out',
              y: ALERT_REST_Y_PX,
            },
            0,
          )
        return
      }

      if (roundTransitionPhase === 'guessingExit') {
        const shouldExitPhrase = activeScreen === AppScreen.Guessing
        gsap.set(handoffTrackElement, {
          autoAlpha: 1,
          x: shouldExitPhrase ? -viewportWidth : 0,
        })
        gsap.set(countdownElement, { autoAlpha: 0, xPercent: 0 })
        gsap.set(phraseElement, {
          autoAlpha: shouldExitPhrase ? 1 : 0,
          xPercent: 0,
        })
        gsap.set(animatedElements, { willChange: 'transform, opacity' })
        const timeline = gsap
          .timeline({
            defaults: { duration: 0.45, ease: 'power2.in' },
            onComplete: () => {
              gsap.set(animatedElements, { clearProps: 'willChange' })
              finishGuessingExit()
            },
          })
          .to(alertElement, { autoAlpha: 0, y: -viewportHeight }, 0)
          .to(selectorElement, { autoAlpha: 0, y: viewportHeight }, 0)

        if (shouldExitPhrase) {
          timeline.to(phraseElement, { autoAlpha: 0, xPercent: 100 }, 0)
        }

        return
      }

      if (
        roundTransitionPhase === 'idle' &&
        activeScreen === AppScreen.Guessing
      ) {
        gsap.set(handoffTrackElement, {
          autoAlpha: 1,
          x: -viewportWidth,
          clearProps: 'opacity,visibility,willChange',
        })
        gsap.set([phraseElement, selectorElement], {
          autoAlpha: 1,
          clearProps: 'transform,opacity,visibility,willChange',
        })
        gsap.set(alertElement, {
          autoAlpha: 1,
          clearProps: 'willChange',
          y: ALERT_REST_Y_PX,
        })
        gsap.set(countdownElement, {
          autoAlpha: 0,
          clearProps: 'transform,opacity,visibility,willChange',
        })
      }
    },
    {
      dependencies: [
        activeScreen,
        countdownLabel,
        finishGuessingEnter,
        finishGuessingExit,
        finishPhraseEnter,
        roundTransitionPhase,
      ],
    },
  )
}
