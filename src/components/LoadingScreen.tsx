'use client'

import { Logo } from '@/components/Logo'
import { LogoArrowSprite } from '@/components/LogoArrowSprite'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ComponentProps, useLayoutEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

type LogoArrowTeam = 'A' | 'B'

const VOLLEY_ARROW_POOL_SIZE = 8
const VOLLEY_INTERVAL = 0.12
const VOLLEY_MINIMUM_COUNT = 4
const VOLLEY_FADE_DURATION = 0.04
const COLLISION_ARROW_ENTER_DURATION = 0.45
const COLLISION_DURATION = 0.08
const LOGO_ARROW_CROSSFADE_DURATION = 0.08
const LOGO_RING_REVEAL_DURATION = 0.18
const LOGO_TEXT_REVEAL_DURATION = 0.22
const OVERLAY_EXIT_DURATION = 0.16
const BUTTON_REVEAL_DURATION = 0.24
const BUTTON_REVEAL_STAGGER = 0.08
const VOLLEY_TRAJECTORY_ANGLE_DEGREES = -15
const VOLLEY_TRAJECTORY_SLOPE = Math.tan(
  (VOLLEY_TRAJECTORY_ANGLE_DEGREES * Math.PI) / 180,
)
const VOLLEY_STRIP_BASE_Y_OFFSETS: Record<LogoArrowTeam, number> = {
  A: -0.16,
  B: 0.16,
}
// Both sprite paths are already drawn at their final logo angles.
const LOGO_REST_ROTATIONS: Record<LogoArrowTeam, number> = {
  A: 0,
  B: 0,
}

const VOLLEY_PATTERNS = [
  { duration: 0.41, lane: -0.03, scale: 0.92 },
  { duration: 0.45, lane: 0.06, scale: 1.02 },
  { duration: 0.43, lane: 0.01, scale: 0.98 },
  { duration: 0.475, lane: -0.07, scale: 0.88 },
] as const

interface LoadingScreenProps extends Omit<ComponentProps<'div'>, 'children'> {
  animateToIntro: boolean
  isLoading: boolean
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getVolleyTeam(volleyIndex: number): LogoArrowTeam {
  return volleyIndex % 2 === 0 ? 'B' : 'A'
}

function getTrajectoryY(x: number, laneY: number) {
  return VOLLEY_TRAJECTORY_SLOPE * x + laneY
}

function getVolleyFlight(team: LogoArrowTeam, volleyIndex: number) {
  const pattern = VOLLEY_PATTERNS[volleyIndex % VOLLEY_PATTERNS.length]
  const viewportWidth = window.innerWidth
  const viewportMin = Math.min(window.innerWidth, window.innerHeight)
  const arrowHalfWidth = Math.min(viewportMin * 0.35, 176)
  const direction = team === 'B' ? 1 : -1
  const offscreenX = viewportWidth / 2 + arrowHalfWidth + 96
  const laneY = (VOLLEY_STRIP_BASE_Y_OFFSETS[team] + pattern.lane) * viewportMin
  const startX = -direction * offscreenX
  const endX = direction * offscreenX

  return {
    duration: pattern.duration,
    endRotation: LOGO_REST_ROTATIONS[team],
    endX,
    endY: getTrajectoryY(endX, laneY),
    scale: pattern.scale,
    startRotation: LOGO_REST_ROTATIONS[team],
    startX,
    startY: getTrajectoryY(startX, laneY),
  }
}

function getBuildArrowStart(team: LogoArrowTeam, targetBounds: DOMRect) {
  if (team === 'B') {
    const x = -targetBounds.left - targetBounds.width * 1.25

    return {
      rotation: LOGO_REST_ROTATIONS.B,
      x,
      y: getTrajectoryY(x, 0),
    }
  }

  const x = window.innerWidth - targetBounds.left + targetBounds.width * 1.25

  return {
    rotation: LOGO_REST_ROTATIONS.A,
    x,
    y: getTrajectoryY(x, 0),
  }
}

function getElementChildren(element: HTMLElement | null) {
  return element ? gsap.utils.toArray<HTMLElement>(element.children) : []
}

function getPresentElements(
  elements: Array<Element | HTMLElement | SVGElement | null | undefined>,
) {
  return elements.filter(Boolean) as Array<Element | HTMLElement | SVGElement>
}

export function LoadingScreen({
  animateToIntro,
  className,
  isLoading,
  ...otherProps
}: LoadingScreenProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const logoFrameRef = useRef<HTMLDivElement>(null)
  const buildBlueArrowRef = useRef<HTMLDivElement>(null)
  const buildPinkArrowRef = useRef<HTMLDivElement>(null)
  const finalLogoRef = useRef<HTMLDivElement>(null)
  const volleyArrowRefs = useRef<HTMLDivElement[]>([])
  const activeVolleyTimelinesRef = useRef<Set<gsap.core.Timeline> | null>(null)
  const animateToIntroRef = useRef(animateToIntro)
  const buildTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const didFinishRef = useRef(false)
  const didRequestResolveRef = useRef(false)
  const didStartBuildRef = useRef(false)
  const requestResolveRef = useRef<(() => void) | null>(null)
  const volleyCountRef = useRef(0)
  const volleyPoolIndexRef = useRef(0)
  const volleyTimerRef = useRef<gsap.core.Tween | null>(null)

  useLayoutEffect(() => {
    animateToIntroRef.current = animateToIntro
  }, [animateToIntro])

  function completeLoadingIntro({
    actions,
    actionChildren = [],
    target,
  }: {
    actions?: HTMLElement | null
    actionChildren?: HTMLElement[]
    target?: HTMLElement | null
  } = {}) {
    const overlay = overlayRef.current
    const logoFrame = logoFrameRef.current
    const buildBlueArrow = buildBlueArrowRef.current
    const buildPinkArrow = buildPinkArrowRef.current
    const finalLogo = finalLogoRef.current
    const cleanedElements = getPresentElements([
      target,
      actions,
      logoFrame,
      buildBlueArrow,
      buildPinkArrow,
      finalLogo,
      ...actionChildren,
    ])

    didFinishRef.current = true
    buildTimelineRef.current = null
    requestResolveRef.current = null
    volleyTimerRef.current?.kill()
    volleyTimerRef.current = null
    activeVolleyTimelinesRef.current?.forEach(timeline => timeline.kill())
    activeVolleyTimelinesRef.current?.clear()

    if (target) {
      gsap.set(target, { autoAlpha: 1, clearProps: 'opacity,visibility' })
    }

    if (actions) {
      gsap.set(actions, {
        autoAlpha: 1,
        clearProps: 'opacity,transform,visibility',
        y: 0,
      })
    }

    if (actionChildren.length) {
      gsap.set(actionChildren, {
        autoAlpha: 1,
        clearProps: 'opacity,transform,visibility',
        y: 0,
      })
    }

    if (logoFrame) {
      gsap.set(logoFrame, {
        autoAlpha: 0,
        clearProps: 'height,left,top,transform,width,willChange',
      })
    }

    if (cleanedElements.length) {
      gsap.set(cleanedElements, {
        clearProps: 'willChange',
      })
    }

    if (overlay) {
      gsap.set(overlay, {
        autoAlpha: 0,
        pointerEvents: 'none',
      })
    }
  }

  function startLogoBuild() {
    if (didFinishRef.current || didStartBuildRef.current) return

    didStartBuildRef.current = true

    const overlay = overlayRef.current
    const logoFrame = logoFrameRef.current
    const buildBlueArrow = buildBlueArrowRef.current
    const buildPinkArrow = buildPinkArrowRef.current
    const finalLogo = finalLogoRef.current
    const target = document.querySelector<HTMLElement>('.js-intro-logo')
    const actions = document.querySelector<HTMLElement>('.js-main-menu-actions')
    const actionChildren = getElementChildren(actions)
    const reducedMotion = prefersReducedMotion()

    if (
      !(overlay && logoFrame && buildBlueArrow && buildPinkArrow && finalLogo)
    ) {
      completeLoadingIntro({ actions, actionChildren, target })
      return
    }

    if (reducedMotion || !(animateToIntroRef.current && target)) {
      gsap.to(overlay, {
        autoAlpha: 0,
        duration: reducedMotion ? 0 : OVERLAY_EXIT_DURATION,
        onComplete: () =>
          completeLoadingIntro({
            actions,
            actionChildren,
            target,
          }),
      })
      return
    }

    const targetBounds = target.getBoundingClientRect()
    const finalArrows = finalLogo.querySelector<SVGGElement>('.js-logo-arrows')
    const finalRing = finalLogo.querySelector<SVGGElement>('.js-logo-ring')
    const finalText = finalLogo.querySelector<SVGGElement>('.js-logo-text')

    if (
      !(
        targetBounds.width &&
        targetBounds.height &&
        finalArrows &&
        finalRing &&
        finalText
      )
    ) {
      completeLoadingIntro({ actions, actionChildren, target })
      return
    }

    const blueStart = getBuildArrowStart('B', targetBounds)
    const pinkStart = getBuildArrowStart('A', targetBounds)
    const actionRevealTargets = actionChildren.length
      ? actionChildren
      : actions
        ? [actions]
        : []

    gsap.killTweensOf(
      getPresentElements([
        overlay,
        target,
        actions,
        logoFrame,
        buildBlueArrow,
        buildPinkArrow,
        finalLogo,
        finalArrows,
        finalRing,
        finalText,
        ...actionChildren,
      ]),
    )

    gsap.set(target, { autoAlpha: 0 })
    if (actions) {
      gsap.set(actions, { autoAlpha: 0, y: 22 })
    }
    if (actionChildren.length) {
      gsap.set(actionChildren, { autoAlpha: 0, y: 18 })
    }
    gsap.set(logoFrame, {
      autoAlpha: 1,
      height: targetBounds.height,
      left: targetBounds.left,
      rotation: 0,
      scale: 1,
      top: targetBounds.top,
      transformOrigin: '50% 50%',
      width: targetBounds.width,
      willChange: 'transform,opacity',
      x: 0,
      y: 0,
    })
    gsap.set([buildBlueArrow, buildPinkArrow], {
      autoAlpha: 1,
      scale: 1,
      transformOrigin: '50% 50%',
      willChange: 'transform,opacity',
    })
    gsap.set(buildBlueArrow, {
      rotation: blueStart.rotation,
      x: blueStart.x,
      y: blueStart.y,
    })
    gsap.set(buildPinkArrow, {
      rotation: pinkStart.rotation,
      x: pinkStart.x,
      y: pinkStart.y,
    })
    gsap.set(finalLogo, { autoAlpha: 1 })
    gsap.set(finalArrows, { autoAlpha: 0 })
    gsap.set(finalRing, {
      autoAlpha: 0,
      rotation: -8,
      scale: 0.92,
      transformOrigin: '50% 50%',
    })
    gsap.set(finalText, {
      autoAlpha: 0,
      scale: 0.84,
      transformOrigin: '50% 50%',
      y: 12,
    })

    const buildTimeline = gsap.timeline({
      onComplete: () =>
        completeLoadingIntro({
          actions,
          actionChildren,
          target,
        }),
    })

    buildTimeline
      .to(
        [buildBlueArrow, buildPinkArrow],
        {
          duration: COLLISION_ARROW_ENTER_DURATION,
          ease: 'power3.in',
          rotation: 0,
          x: 0,
          y: 0,
        },
        0,
      )
      .to(logoFrame, {
        duration: COLLISION_DURATION / 2,
        ease: 'power2.out',
        scale: 1.045,
        x: 2,
      })
      .to(logoFrame, {
        duration: COLLISION_DURATION / 2,
        ease: 'power2.in',
        scale: 1,
        x: 0,
      })
      .to(
        finalArrows,
        {
          autoAlpha: 1,
          duration: LOGO_ARROW_CROSSFADE_DURATION,
          ease: 'none',
        },
        '<',
      )
      .to(
        [buildBlueArrow, buildPinkArrow],
        {
          autoAlpha: 0,
          duration: LOGO_ARROW_CROSSFADE_DURATION,
          ease: 'none',
        },
        '<',
      )
      .to(finalRing, {
        autoAlpha: 1,
        duration: LOGO_RING_REVEAL_DURATION,
        ease: 'power2.out',
        rotation: 0,
        scale: 1,
      })
      .to(
        finalText,
        {
          autoAlpha: 1,
          duration: LOGO_TEXT_REVEAL_DURATION,
          ease: 'back.out(1.7)',
          scale: 1,
          y: 0,
        },
        '-=0.04',
      )
      .set(target, { autoAlpha: 1 })
      .to(overlay, {
        autoAlpha: 0,
        duration: OVERLAY_EXIT_DURATION,
        ease: 'power1.out',
      })

    if (actions) {
      buildTimeline.set(actions, { autoAlpha: 1 }, '<').to(
        actions,
        {
          duration: BUTTON_REVEAL_DURATION,
          ease: 'power2.out',
          y: 0,
        },
        '<',
      )
    }

    if (actionRevealTargets.length) {
      buildTimeline.to(
        actionRevealTargets,
        {
          autoAlpha: 1,
          duration: BUTTON_REVEAL_DURATION,
          ease: 'power2.out',
          stagger: BUTTON_REVEAL_STAGGER,
          y: 0,
        },
        '<',
      )
    }

    buildTimelineRef.current = buildTimeline
  }

  useGSAP(
    () => {
      const volleyArrows = volleyArrowRefs.current.filter(Boolean)

      if (!volleyArrows.length || prefersReducedMotion()) return

      let isCancelled = false
      const activeVolleyTimelines = new Set<gsap.core.Timeline>()

      activeVolleyTimelinesRef.current = activeVolleyTimelines
      didRequestResolveRef.current = false
      didStartBuildRef.current = false
      volleyCountRef.current = 0
      volleyPoolIndexRef.current = 0
      activeVolleyTimelines.clear()

      function maybeStartBuild() {
        if (
          !didRequestResolveRef.current ||
          didStartBuildRef.current ||
          activeVolleyTimelines.size > 0 ||
          volleyCountRef.current < VOLLEY_MINIMUM_COUNT
        ) {
          return
        }

        startLogoBuild()
      }

      function scheduleNextVolley(delay = VOLLEY_INTERVAL) {
        if (isCancelled || didFinishRef.current) return

        volleyTimerRef.current?.kill()
        volleyTimerRef.current = gsap.delayedCall(delay, () => {
          volleyTimerRef.current = null
          launchVolley()
        })
      }

      function launchVolley() {
        if (isCancelled || didFinishRef.current) return

        const volleyIndex = volleyCountRef.current
        const poolIndex = volleyPoolIndexRef.current % volleyArrows.length
        const arrow = volleyArrows[poolIndex]
        const blueSprite = arrow.querySelector<SVGElement>(
          '[data-volley-sprite="B"]',
        )
        const pinkSprite = arrow.querySelector<SVGElement>(
          '[data-volley-sprite="A"]',
        )
        const team = getVolleyTeam(volleyIndex)
        const flight = getVolleyFlight(team, volleyIndex)

        volleyCountRef.current += 1
        volleyPoolIndexRef.current += 1
        gsap.killTweensOf(getPresentElements([arrow, blueSprite, pinkSprite]))
        gsap.set(blueSprite, { autoAlpha: team === 'B' ? 1 : 0 })
        gsap.set(pinkSprite, { autoAlpha: team === 'A' ? 1 : 0 })

        const timeline = gsap.timeline({
          onComplete: () => {
            activeVolleyTimelines.delete(timeline)
            gsap.set(arrow, { autoAlpha: 0 })
            maybeStartBuild()
          },
        })

        activeVolleyTimelines.add(timeline)
        timeline
          .set(arrow, {
            autoAlpha: 0,
            rotation: flight.startRotation,
            scale: flight.scale,
            transformOrigin: '50% 50%',
            x: flight.startX,
            xPercent: -50,
            y: flight.startY,
            yPercent: -50,
          })
          .to(
            arrow,
            {
              autoAlpha: 1,
              duration: 0.06,
              ease: 'none',
            },
            0,
          )
          .to(
            arrow,
            {
              duration: flight.duration,
              ease: 'none',
              rotation: flight.endRotation,
              x: flight.endX,
              y: flight.endY,
            },
            0,
          )
          .to(
            arrow,
            {
              autoAlpha: 0,
              duration: VOLLEY_FADE_DURATION,
              ease: 'none',
            },
            Math.max(0, flight.duration - VOLLEY_FADE_DURATION),
          )

        if (
          !didRequestResolveRef.current ||
          volleyCountRef.current < VOLLEY_MINIMUM_COUNT
        ) {
          scheduleNextVolley()
        } else {
          maybeStartBuild()
        }
      }

      requestResolveRef.current = () => {
        didRequestResolveRef.current = true

        if (volleyCountRef.current >= VOLLEY_MINIMUM_COUNT) {
          volleyTimerRef.current?.kill()
          volleyTimerRef.current = null
        } else if (!volleyTimerRef.current) {
          scheduleNextVolley()
        }

        maybeStartBuild()
      }

      gsap.set(volleyArrows, {
        autoAlpha: 0,
        transformOrigin: '50% 50%',
        willChange: 'transform,opacity',
        xPercent: -50,
        yPercent: -50,
      })
      launchVolley()

      if (!isLoading) {
        requestResolveRef.current?.()
      }

      return () => {
        isCancelled = true
        requestResolveRef.current = null
        buildTimelineRef.current?.kill()
        buildTimelineRef.current = null
        volleyTimerRef.current?.kill()
        volleyTimerRef.current = null
        activeVolleyTimelines.forEach(timeline => timeline.kill())
        activeVolleyTimelines.clear()
        if (activeVolleyTimelinesRef.current === activeVolleyTimelines) {
          activeVolleyTimelinesRef.current = null
        }
        gsap.set(volleyArrows, {
          autoAlpha: 0,
          clearProps: 'transform,willChange',
        })
      }
    },
    {
      scope: overlayRef,
    },
  )

  useGSAP(
    () => {
      if (isLoading || didFinishRef.current) return

      if (prefersReducedMotion()) {
        startLogoBuild()
        return
      }

      const resolveLoading = requestResolveRef.current

      if (resolveLoading) {
        resolveLoading()
        return
      }

      const delayedResolve = gsap.delayedCall(0, () => {
        requestResolveRef.current?.()
      })

      return () => {
        delayedResolve.kill()
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
          overflow-hidden
        `,
        className,
      )}
      {...otherProps}
    >
      <div className="pointer-events-none fixed inset-0">
        {Array.from({ length: VOLLEY_ARROW_POOL_SIZE }, (_, index) => (
          <div
            key={index}
            ref={element => {
              if (element) volleyArrowRefs.current[index] = element
            }}
            aria-hidden="true"
            className="
              pointer-events-none
              invisible
              absolute
              top-1/2
              left-1/2
              aspect-[475/419]
              w-[70vmin]
              max-w-[22rem]
            "
          >
            <LogoArrowSprite
              data-volley-sprite="B"
              team="B"
              className="absolute inset-0 h-full w-full"
            />
            <LogoArrowSprite
              data-volley-sprite="A"
              team="A"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        ))}
      </div>

      <div
        ref={logoFrameRef}
        aria-hidden="true"
        className="
          pointer-events-none
          invisible
          fixed
          top-0
          left-0
        "
      >
        <div
          ref={buildBlueArrowRef}
          className="absolute inset-0"
        >
          <LogoArrowSprite
            team="B"
            className="h-full w-full"
          />
        </div>
        <div
          ref={buildPinkArrowRef}
          className="absolute inset-0"
        >
          <LogoArrowSprite
            team="A"
            className="h-full w-full"
          />
        </div>
        <div
          ref={finalLogoRef}
          className="absolute inset-0"
        >
          <Logo className="h-full w-full" />
        </div>
      </div>
    </div>
  )
}
