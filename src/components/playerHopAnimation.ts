import { gsap } from 'gsap'

export interface Point {
  x: number
  y: number
}

export const PLAYER_HOP_HEIGHT_MULTIPLIERS = [0.55, 0.42, 0.3] as const
export const PLAYER_HOP_PREP_DURATION = 0.06
export const PLAYER_HOP_RISE_DURATION = 0.14
export const PLAYER_HOP_FALL_DURATION = 0.12
export const PLAYER_HOP_IMPACT_DURATION = 0.04
export const PLAYER_HOP_RECOVERY_DURATION = 0.06
export const PLAYER_HOP_DURATION =
  PLAYER_HOP_PREP_DURATION +
  PLAYER_HOP_RISE_DURATION +
  PLAYER_HOP_FALL_DURATION +
  PLAYER_HOP_IMPACT_DURATION +
  PLAYER_HOP_RECOVERY_DURATION
export const PLAYER_HOP_SEQUENCE_DURATION =
  PLAYER_HOP_HEIGHT_MULTIPLIERS.length * PLAYER_HOP_DURATION

interface PlayerHopOptions {
  durationScale?: number
  end: Point
  fallDurationScale?: number
  fallEase?: string
  includePrep?: boolean
  includeRecovery?: boolean
  impactDurationScale?: number
  impactEase?: string
  impactScaleX?: number
  impactScaleY?: number
  lift: number
  positionTarget: HTMLElement
  scaleTarget?: HTMLElement
  squishAfterLanding?: boolean
  start: Point
}

interface PlayerDropOptions {
  durationScale?: number
  end: Point
  fallEase?: string
  impactDurationScale?: number
  impactEase?: string
  impactScaleX?: number
  impactScaleY?: number
  includeRecovery?: boolean
  landingClearance: number
  positionTarget: HTMLElement
  scaleTarget?: HTMLElement
  start: Point
}

function addHopTween(
  timeline: gsap.core.Timeline,
  {
    duration,
    ease,
    positionTarget,
    positionVars,
    scaleTarget,
    scaleVars,
  }: {
    duration: number
    ease: string
    positionTarget: HTMLElement
    positionVars?: gsap.TweenVars
    scaleTarget: HTMLElement
    scaleVars: gsap.TweenVars
  },
) {
  if (positionTarget === scaleTarget) {
    timeline.to(positionTarget, {
      duration,
      ease,
      ...positionVars,
      ...scaleVars,
    })
    return
  }

  timeline
    .to(positionTarget, {
      duration,
      ease,
      ...positionVars,
    })
    .to(
      scaleTarget,
      {
        duration,
        ease,
        ...scaleVars,
      },
      '<',
    )
}

export function getHopPoint(
  start: Point,
  end: Point,
  progress: number,
  lift: number,
): Point {
  return {
    x: start.x + (end.x - start.x) * progress,
    y: start.y + (end.y - start.y) * progress - lift,
  }
}

export function addPlayerHopToTimeline(
  timeline: gsap.core.Timeline,
  {
    durationScale = 1,
    end,
    fallDurationScale = 1,
    fallEase = 'power2.in',
    includePrep = true,
    includeRecovery = true,
    impactDurationScale = 1,
    impactEase = 'power4.in',
    impactScaleX = 1,
    impactScaleY = 0.8,
    lift,
    positionTarget,
    scaleTarget = positionTarget,
    squishAfterLanding = false,
    start,
  }: PlayerHopOptions,
) {
  const apex = getHopPoint(start, end, 0.5, lift)
  const preImpact = getHopPoint(start, end, 0.9, lift * 0.1)

  if (includePrep) {
    timeline.to(scaleTarget, {
      duration: PLAYER_HOP_PREP_DURATION * durationScale,
      ease: 'power2.in',
      scaleX: 1,
      scaleY: 0.8,
    })
  }

  addHopTween(timeline, {
    duration: PLAYER_HOP_RISE_DURATION * durationScale,
    ease: 'power2.out',
    positionTarget,
    positionVars: {
      x: apex.x,
      y: apex.y,
    },
    scaleTarget,
    scaleVars: {
      scaleX: 0.8,
      scaleY: 1.2,
    },
  })
  addHopTween(timeline, {
    duration: PLAYER_HOP_FALL_DURATION * durationScale * fallDurationScale,
    ease: fallEase,
    positionTarget,
    positionVars: {
      x: preImpact.x,
      y: preImpact.y,
    },
    scaleTarget,
    scaleVars: {
      scaleX: 1,
      scaleY: 1,
    },
  })
  if (squishAfterLanding) {
    addHopTween(timeline, {
      duration: PLAYER_HOP_IMPACT_DURATION * durationScale,
      ease: 'power4.in',
      positionTarget,
      positionVars: {
        x: end.x,
        y: end.y,
      },
      scaleTarget,
      scaleVars: {
        scaleX: 1,
        scaleY: 1,
      },
    })
    timeline.to(scaleTarget, {
      duration:
        PLAYER_HOP_IMPACT_DURATION * durationScale * impactDurationScale,
      ease: impactEase,
      scaleX: impactScaleX,
      scaleY: impactScaleY,
    })
  } else {
    addHopTween(timeline, {
      duration:
        PLAYER_HOP_IMPACT_DURATION * durationScale * impactDurationScale,
      ease: impactEase,
      positionTarget,
      positionVars: {
        x: end.x,
        y: end.y,
      },
      scaleTarget,
      scaleVars: {
        scaleX: impactScaleX,
        scaleY: impactScaleY,
      },
    })
  }

  if (includeRecovery) {
    timeline.to(scaleTarget, {
      duration: PLAYER_HOP_RECOVERY_DURATION * durationScale,
      ease: 'back.out(2)',
      scaleX: 1,
      scaleY: 1,
    })
  }
}

export function addPlayerDropToTimeline(
  timeline: gsap.core.Timeline,
  {
    durationScale = 1,
    end,
    fallEase = 'power2.in',
    impactDurationScale = 1,
    impactEase = 'power4.in',
    impactScaleX = 1,
    impactScaleY = 0.8,
    includeRecovery = true,
    landingClearance,
    positionTarget,
    scaleTarget = positionTarget,
    start,
  }: PlayerDropOptions,
) {
  timeline
    .set(positionTarget, {
      x: start.x,
      y: start.y,
    })
    .set(
      scaleTarget,
      {
        scaleX: 1,
        scaleY: 1,
      },
      '<',
    )

  addHopTween(timeline, {
    duration:
      (PLAYER_HOP_RISE_DURATION + PLAYER_HOP_FALL_DURATION) * durationScale,
    ease: fallEase,
    positionTarget,
    positionVars: {
      x: end.x,
      y: end.y - landingClearance,
    },
    scaleTarget,
    scaleVars: {
      scaleX: 1,
      scaleY: 1,
    },
  })
  addHopTween(timeline, {
    duration: PLAYER_HOP_IMPACT_DURATION * durationScale * impactDurationScale,
    ease: impactEase,
    positionTarget,
    positionVars: {
      x: end.x,
      y: end.y,
    },
    scaleTarget,
    scaleVars: {
      scaleX: impactScaleX,
      scaleY: impactScaleY,
    },
  })

  if (includeRecovery) {
    timeline.to(scaleTarget, {
      duration: PLAYER_HOP_RECOVERY_DURATION * durationScale,
      ease: 'back.out(2)',
      scaleX: 1,
      scaleY: 1,
    })
  }
}

export function getDelayUntilNextPlayerHopRest(
  timeline: gsap.core.Timeline,
  restStartsAt = PLAYER_HOP_DURATION,
  minDelay = 0,
) {
  const cycleDuration = timeline.duration()

  if (!cycleDuration) return minDelay

  const cycleTime = (timeline.time() + minDelay) % cycleDuration

  if (cycleTime >= restStartsAt) return minDelay

  return minDelay + restStartsAt - cycleTime
}
