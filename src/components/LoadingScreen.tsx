'use client'

import { Logo } from '@/components/Logo'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ComponentProps } from 'react'
import { useRef } from 'react'
import { twMerge } from 'tailwind-merge'

const SCREEN_ENTER_DURATION = 0.5
const LOGO_TRANSITION_DURATION = 0.8

interface LoadingScreenProps extends Omit<ComponentProps<'div'>, 'children'> {
  animateToIntro: boolean
  isLoading: boolean
}

export function LoadingScreen({
  animateToIntro,
  className,
  isLoading,
  ...otherProps
}: LoadingScreenProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const logoFrameRef = useRef<HTMLDivElement>(null)
  const logoMotionRef = useRef<HTMLDivElement>(null)
  const didFinishRef = useRef(false)

  useGSAP(
    () => {
      if (isLoading || didFinishRef.current) return

      const overlay = overlayRef.current
      const logoFrame = logoFrameRef.current
      const logoMotion = logoMotionRef.current

      if (!(overlay && logoFrame && logoMotion)) return

      let transition: gsap.core.Timeline | null = null
      const delayedStart = gsap.delayedCall(SCREEN_ENTER_DURATION, () => {
        const target = document.querySelector<HTMLElement>('.js-intro-logo')
        const prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches

        function finish() {
          didFinishRef.current = true
          gsap.set([logoFrame, logoMotion], {
            clearProps: 'willChange',
          })
          gsap.set(overlay, {
            autoAlpha: 0,
            pointerEvents: 'none',
          })
        }

        if (!(animateToIntro && target)) {
          gsap.to(overlay, {
            autoAlpha: 0,
            duration: prefersReducedMotion ? 0 : 0.25,
            onComplete: finish,
          })
          return
        }

        const sourceBounds = logoFrame.getBoundingClientRect()
        const targetBounds = target.getBoundingClientRect()

        logoMotion.classList.remove('animate-bounce', 'scale-50')
        gsap.set([logoFrame, logoMotion], {
          willChange: 'transform',
        })
        gsap.set(logoMotion, { scale: 0.5, y: 0 })

        transition = gsap.timeline({
          defaults: {
            duration: prefersReducedMotion ? 0 : LOGO_TRANSITION_DURATION,
            ease: 'power3.inOut',
          },
          onComplete: finish,
        })

        transition
          .to(logoFrame, {
            x: targetBounds.left - sourceBounds.left,
            y: targetBounds.top - sourceBounds.top,
          })
          .to(logoMotion, { scale: 1 }, '<')
      })

      return () => {
        delayedStart.kill()
        transition?.kill()
        gsap.set([logoFrame, logoMotion], {
          clearProps: 'willChange',
        })
      }
    },
    {
      dependencies: [animateToIntro, isLoading],
      scope: overlayRef,
    },
  )

  return (
    <div
      ref={overlayRef}
      aria-label="Loading NextPhrase"
      role="status"
      className={twMerge(
        `
          bg-bgColor
          fixed
          inset-0
          z-[1000]
          flex
          items-center
          justify-center
        `,
        className,
      )}
      {...otherProps}
    >
      <div
        ref={logoFrameRef}
        className="size-[70vmin]"
      >
        <div
          ref={logoMotionRef}
          aria-hidden="true"
          className="
            h-full
            w-full
            scale-50
            animate-bounce
            motion-reduce:animate-none
          "
        >
          <Logo className="h-full w-full" />
        </div>
      </div>
    </div>
  )
}
