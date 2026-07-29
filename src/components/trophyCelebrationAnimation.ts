import { gsap } from 'gsap'

const TROPHY_REST_DURATION = 0.5
const TROPHY_LIFT_DURATION = 0.3
const TROPHY_SHAKE_STEP_DURATION = 0.065
const TROPHY_SHAKE_STEP_COUNT = 8
const TROPHY_SETTLE_DURATION = 0.32
const TROPHY_TILT_DEGREES = 20
const TROPHY_SHAKE_DEGREES = 4
const TROPHY_LIFT_DISTANCE_MULTIPLIER = 0.18

type TrophyDirection = -1 | 1

function addTrophyRaise({
  direction,
  timeline,
  trophy,
  trophyHeight,
}: {
  direction: TrophyDirection
  timeline: gsap.core.Timeline
  trophy: HTMLElement
  trophyHeight: number
}) {
  const liftedY = -trophyHeight * TROPHY_LIFT_DISTANCE_MULTIPLIER
  const shakeDistance = gsap.utils.clamp(1.5, 3, trophyHeight * 0.04)

  timeline
    .to(trophy, {
      duration: TROPHY_REST_DURATION,
    })
    .to(trophy, {
      duration: TROPHY_LIFT_DURATION,
      ease: 'power2.out',
      rotation: direction * TROPHY_TILT_DEGREES,
      x: direction * shakeDistance,
      y: liftedY,
    })

  for (let step = 0; step < TROPHY_SHAKE_STEP_COUNT; step += 1) {
    const shakeDirection = step % 2 === 0 ? 1 : -1

    timeline.to(trophy, {
      duration: TROPHY_SHAKE_STEP_DURATION,
      ease: 'sine.inOut',
      rotation:
        direction * TROPHY_TILT_DEGREES + shakeDirection * TROPHY_SHAKE_DEGREES,
      x: shakeDirection * shakeDistance,
      y: liftedY - shakeDirection * shakeDistance,
    })
  }

  timeline.to(trophy, {
    duration: TROPHY_SETTLE_DURATION,
    ease: 'power2.inOut',
    rotation: 0,
    x: 0,
    y: 0,
  })
}

export function createTrophyCelebrationTimeline(trophy: HTMLElement) {
  const trophyHeight = Math.max(trophy.offsetHeight, 1)
  const timeline = gsap.timeline({ repeat: -1 })

  timeline.set(trophy, {
    force3D: true,
    rotation: 0,
    rotationY: 0,
    scaleX: 1,
    scaleY: 1,
    transformOrigin: '50% 100%',
    willChange: 'transform',
    x: 0,
    y: 0,
  })

  addTrophyRaise({
    direction: -1,
    timeline,
    trophy,
    trophyHeight,
  })
  addTrophyRaise({
    direction: 1,
    timeline,
    trophy,
    trophyHeight,
  })

  return timeline
}
