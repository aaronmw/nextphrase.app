'use client'

import { teamAColor, teamBColor } from '@/app/theme'
import { useAppContext } from '@/components/AppContext'
import { Icon } from '@/components/Icon'
import { useRoundTransition } from '@/components/RoundTransitionContext'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { forwardRef, useImperativeHandle, useRef } from 'react'
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
    top-1/2
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
    aspect-square
    inline-block
    text-white
    rounded-full
    size-4
    relative
    z-10
  `,
}

export interface SpinningAlertLightHandle {
  triggerQuickSpin: () => void
}

export const SpinningAlertLight = forwardRef<
  SpinningAlertLightHandle,
  { activeTeam: 'A' | 'B'; onClick: () => void }
>(function SpinningAlertLight({ activeTeam, onClick }, ref) {
  const containerRef = useRef<HTMLButtonElement>(null)
  const lightsContainerRef = useRef<HTMLSpanElement>(null)
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

      if (
        !(
          lightsContainer &&
          lightsWash &&
          currentRoundAccelerationStartTime &&
          currentRoundEndTime &&
          currentRoundStartTime
        )
      ) {
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
        `.js-rotating-light`,
        { rotate: 0 },
        {
          duration: tickRate * 2,
          rotate: 360,
          ease: 'none',
        },
      )

      spinningIconTimeline.fromTo(
        `.js-spinning-icon`,
        { rotate: 360 },
        {
          duration: tickRate * 2,
          rotate: 0,
          ease: 'none',
        },
      )

      flashingLightTimeline
        .to(`.js-flashing-light`, { opacity: 1, duration: 0.1 })
        .to(`.js-flashing-light`, { opacity: 0, duration: 0.1 })
        .to(`.js-flashing-light`, { opacity: 1, duration: 0.1 })
        .to(`.js-flashing-light`, { opacity: 0, duration: 0.1 })
        .to(`.js-flashing-light`, {
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
        sounds.playSound('glass-explosion')

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
        requestEndRound,
      ],
    },
  )

  return (
    <button
      ref={containerRef}
      aria-label="Abort round"
      type="button"
      className={classNames.button}
      onClick={handleClick}
      style={
        {
          '--alert-light-color': activeTeamColor,
          'transition': '--alert-light-color 0.25s ease',
        } as React.CSSProperties
      }
    >
      <span
        ref={lightsContainerRef}
        className={classNames.lightsContainer}
      >
        <span
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
          className={twMerge(`js-flashing-light`, classNames.flashingLight)}
        />
        <span className={classNames.lightEdgeDarkener} />
      </span>

      <span
        className={twMerge(`js-spinning-icon`, classNames.spinningIcon)}
        style={{ backgroundColor: 'var(--alert-light-color)' }}
      >
        <Icon name="circle-quarters" />
      </span>
    </button>
  )
})
