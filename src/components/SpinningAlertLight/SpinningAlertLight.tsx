'use client'

import {
  teamAColor,
  teamAFillColor,
  teamBColor,
  teamBFillColor,
} from '@/app/theme'
import { useAppContext } from '@/components/AppContext'
import { Icon } from '@/components/Icon'
import { useRoundTransition } from '@/components/RoundTransitionContext'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { createPortal } from 'react-dom'
import { twMerge } from 'tailwind-merge'

const QUICK_SPIN_ROTATIONS = 0.25
const QUICK_SPIN_SPEED_MULTIPLIER = 4
const QUICK_SPIN_HIGH_SPEED_MULTIPLIER = 3
const SPEED_TRANSITION_DURATION = 0.5
const SPEED_TRANSITION_OUT_DURATION = 1.5
const ROUND_ACCELERATION_DURATION = 0.2

const classNames = {
  button: `
    relative
    text-center
    text-xs
  `,
  lightsContainer: `
    pointer-events-none
    absolute
    left-1/2
    top-4
    size-[240vmax]
    -translate-x-1/2
    -translate-y-1/2
    rounded-full
    overflow-hidden
  `,
  rotatingLight: `
    absolute
    inset-0
  `,
  flashingLight: `
    absolute
    inset-0
    mix-blend-overlay
    bg-gradient-radial
    from-amber-50
    to-transparent
  `,
  lightEdgeDarkener: `
    absolute
    inset-0
    bg-gradient-radial
    from-transparent
    to-bgColor
  `,
  spinningIcon: `
    inline-flex
    items-center
    justify-center
    leading-none
    origin-center
    rounded-full
    size-4
    relative
    z-10
    transition-colors
    duration-300
  `,
}

export interface SpinningAlertLightHandle {
  triggerQuickSpin: () => void
}

interface SpinningAlertLightProps {
  activeTeam: 'A' | 'B'
  lightLayerTarget: Element | null
  onClick: () => void
}

export const SpinningAlertLight = forwardRef<
  SpinningAlertLightHandle,
  SpinningAlertLightProps
>(function SpinningAlertLight({ activeTeam, lightLayerTarget, onClick }, ref) {
  const containerRef = useRef<HTMLButtonElement>(null)
  const lightsContainerRef = useRef<HTMLSpanElement>(null)
  const rotatingLightRef = useRef<HTMLSpanElement>(null)
  const flashingLightRef = useRef<HTMLSpanElement>(null)
  const spinningIconRef = useRef<HTMLSpanElement>(null)
  const timelinesRef = useRef<{
    rotating: gsap.core.Timeline
    spinning: gsap.core.Timeline
  } | null>(null)
  const quickSpinReturnTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null)
  const baseTimeScaleRef = useRef(1)
  const isAcceleratedRef = useRef(false)
  const { requestEndRound } = useRoundTransition()
  const { state, sounds } = useAppContext()
  const {
    currentRoundAccelerationStartTime,
    currentRoundEndTime,
    currentRoundStartTime,
    tickRate,
    acceleratedTickRate,
  } = state
  const activeTeamColor = activeTeam === 'A' ? teamAColor[500] : teamBColor[500]
  const activeTeamSurfaceColor =
    activeTeam === 'A' ? teamAFillColor : teamBFillColor
  const activeTeamTextColor =
    activeTeam === 'A' ? 'text-textOnTeamAColor' : 'text-textOnTeamBColor'

  function handleClick() {
    sounds.stopSound('bonk')
    onClick()
  }

  useImperativeHandle(
    ref,
    () => ({
      triggerQuickSpin() {
        const timelines = timelinesRef.current
        if (!timelines) return
        const t = quickSpinReturnTimeoutRef.current
        if (t !== null) clearTimeout(t)
        const base = baseTimeScaleRef.current
        const multiplier = isAcceleratedRef.current
          ? QUICK_SPIN_HIGH_SPEED_MULTIPLIER
          : QUICK_SPIN_SPEED_MULTIPLIER
        const targetTimeScale = base * multiplier
        gsap.to(timelines.rotating, {
          timeScale: targetTimeScale,
          duration: SPEED_TRANSITION_DURATION,
          ease: 'power2.out',
        })
        gsap.to(timelines.spinning, {
          timeScale: targetTimeScale,
          duration: SPEED_TRANSITION_DURATION,
          ease: 'power2.out',
        })
        const holdDuration =
          (QUICK_SPIN_ROTATIONS * tickRate * 2) / targetTimeScale
        quickSpinReturnTimeoutRef.current = setTimeout(() => {
          quickSpinReturnTimeoutRef.current = null
          gsap.to(timelines.rotating, {
            timeScale: base,
            duration: SPEED_TRANSITION_OUT_DURATION,
            ease: 'power2.in',
          })
          gsap.to(timelines.spinning, {
            timeScale: base,
            duration: SPEED_TRANSITION_OUT_DURATION,
            ease: 'power2.in',
          })
        }, holdDuration * 1000)
      },
    }),
    [tickRate],
  )

  useGSAP(
    () => {
      const lightsContainer = containerRef.current
      const lightsWash = lightsContainerRef.current
      const rotatingLight = rotatingLightRef.current
      const flashingLight = flashingLightRef.current
      const spinningIcon = spinningIconRef.current

      if (!(
        lightsContainer &&
        lightsWash &&
        rotatingLight &&
        flashingLight &&
        spinningIcon &&
        currentRoundAccelerationStartTime &&
        currentRoundEndTime &&
        currentRoundStartTime
      )) {
        if (lightsWash) {
          gsap.killTweensOf(lightsWash)
          gsap.set(lightsWash, { autoAlpha: 0 })
        }
        return
      }

      baseTimeScaleRef.current = 1
      isAcceleratedRef.current = false
      const rotatingLightTimeline = gsap.timeline({ repeat: -1 })
      const spinningIconTimeline = gsap.timeline({ repeat: -1 })
      const flashingLightTimeline = gsap.timeline({ repeat: -1 })
      timelinesRef.current = {
        rotating: rotatingLightTimeline,
        spinning: spinningIconTimeline,
      }
      const timeToAcceleration = currentRoundAccelerationStartTime - Date.now()
      const acceleratedTimeScale = tickRate / acceleratedTickRate
      const timeToEnd = currentRoundEndTime - Date.now()

      gsap.fromTo(
        lightsWash,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.3, ease: 'power2.out' },
      )
      sounds.playSound('bonk', tickRate)

      rotatingLightTimeline.fromTo(
        rotatingLight,
        { rotate: 0 },
        {
          duration: tickRate * 2,
          rotate: 360,
          ease: 'none',
        },
      )

      spinningIconTimeline.fromTo(
        spinningIcon,
        { rotate: 360 },
        {
          duration: tickRate * 2,
          rotate: 0,
          ease: 'none',
        },
      )

      flashingLightTimeline
        .to(flashingLight, { opacity: 1, duration: 0.1 })
        .to(flashingLight, { opacity: 0, duration: 0.1 })
        .to(flashingLight, { opacity: 1, duration: 0.1 })
        .to(flashingLight, { opacity: 0, duration: 0.1 })
        .to(flashingLight, {
          opacity: 0,
          duration: tickRate * 2 - 0.4,
        })

      const accelerationTimeout = setTimeout(
        accelerateAnimation,
        timeToAcceleration,
      )

      const endTimeout = setTimeout(endAnimation, timeToEnd)

      function accelerateAnimation() {
        sounds.playSound('bonk', acceleratedTickRate)
        baseTimeScaleRef.current = acceleratedTimeScale
        isAcceleratedRef.current = true
        gsap.to(rotatingLightTimeline, {
          timeScale: acceleratedTimeScale,
          duration: ROUND_ACCELERATION_DURATION,
          ease: 'power2.out',
        })
        gsap.to(spinningIconTimeline, {
          timeScale: acceleratedTimeScale,
          duration: ROUND_ACCELERATION_DURATION,
          ease: 'power2.out',
        })
        gsap.to(flashingLightTimeline, {
          timeScale: acceleratedTimeScale,
          duration: ROUND_ACCELERATION_DURATION,
          ease: 'power2.out',
        })
      }

      function endAnimation() {
        sounds.stopSound('bonk')

        rotatingLightTimeline.kill()
        spinningIconTimeline.kill()
        flashingLightTimeline.kill()

        requestEndRound()
      }

      return () => {
        timelinesRef.current = null
        const t = quickSpinReturnTimeoutRef.current
        if (t !== null) clearTimeout(t)
        quickSpinReturnTimeoutRef.current = null
        gsap.killTweensOf(lightsWash)
        sounds.stopSound('bonk')
        clearTimeout(accelerationTimeout)
        clearTimeout(endTimeout)
      }
    },
    {
      scope: containerRef,
      dependencies: [
        currentRoundAccelerationStartTime,
        currentRoundEndTime,
        currentRoundStartTime,
        lightLayerTarget,
        requestEndRound,
      ],
    },
  )

  const alertLightStyle = {
    '--alert-light-color': activeTeamColor,
    'transition': '--alert-light-color 0.25s ease',
  } as React.CSSProperties

  return (
    <>
      {lightLayerTarget &&
        createPortal(
          <span
            ref={lightsContainerRef}
            className={classNames.lightsContainer}
            style={alertLightStyle}
          >
            <span
              ref={rotatingLightRef}
              className={twMerge(`js-rotating-light`, classNames.rotatingLight)}
              style={{
                backgroundImage: `
                  conic-gradient(
                    from 0deg at 50% 50%,
                    transparent 15%,
                    var(--alert-light-color) 25%,
                    transparent 35%,
                    transparent 65%,
                    var(--alert-light-color) 75%,
                    transparent 85%
                  )
                `,
              }}
            />
            <span
              ref={flashingLightRef}
              className={twMerge(`js-flashing-light`, classNames.flashingLight)}
            />
            <span className={classNames.lightEdgeDarkener} />
          </span>,
          lightLayerTarget,
        )}

      <button
        ref={containerRef}
        aria-label="Abort round"
        type="button"
        className={classNames.button}
        onClick={handleClick}
        style={alertLightStyle}
      >
        <span
          ref={spinningIconRef}
          className={twMerge(
            `js-spinning-icon`,
            classNames.spinningIcon,
            activeTeamTextColor,
          )}
          style={{ backgroundColor: activeTeamSurfaceColor }}
        >
          <Icon
            className="flex size-full items-center justify-center leading-none"
            name="circle-quarters"
          />
        </span>
      </button>
    </>
  )
})
