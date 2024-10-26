'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

export type TransitionDescriptor = {
  [PropertyName in keyof gsap.TweenVars]:
    | [from: string | number, to: string | number]
    | string
    | number
}

interface TransitionFunctionArgs extends gsap.TweenVars {
  transitionDescriptors: [
    selector: string,
    transitions: TransitionDescriptor,
    timelineString?: string,
  ][]
}

function animate({
  defaults,
  transitionDescriptors,
  onComplete,
  ...rest
}: TransitionFunctionArgs) {
  const timeline = gsap.timeline({
    defaults: { duration: 1, ease: 'expo.out' },
  })

  transitionDescriptors.forEach(
    ([selector, transitions, timelineString = '<']) => {
      Object.entries(transitions).forEach(
        ([property, fromToOrJustTo], index) => {
          if (Array.isArray(fromToOrJustTo)) {
            const [from, to] = fromToOrJustTo

            timeline.fromTo(
              selector,
              { [property]: from },
              {
                [property]: to,
                autoAlpha: 0,
                onComplete: index === 0 ? onComplete : undefined,
                ...rest,
              },
              timelineString,
            )
          } else {
            const to = fromToOrJustTo

            timeline.to(
              selector,
              {
                [property]: to,
                onComplete,
                ...rest,
              },
              timelineString,
            )
          }
        },
      )
    },
  )

  return timeline
}

export function useAnimation() {
  const { contextSafe } = useGSAP()

  return {
    animate: contextSafe(animate),
  }
}
