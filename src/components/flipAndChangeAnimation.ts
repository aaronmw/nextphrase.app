import { gsap } from 'gsap'

const PREP_DURATION = 0.05
const RISE_DURATION = 0.16
const FALL_DURATION = 0.14
const IMPACT_DURATION = 0.03
const RECOVERY_DURATION = 0.06

export const FLIP_AND_CHANGE_CHANGE_AT = PREP_DURATION + RISE_DURATION
export const FLIP_AND_CHANGE_DURATION =
  FLIP_AND_CHANGE_CHANGE_AT +
  FALL_DURATION +
  IMPACT_DURATION +
  RECOVERY_DURATION

interface FlipAndChangeOptions {
  changeVars?: gsap.TweenVars
  // Compact controls keep the flip inside their clipped rail; players supply lift.
  lift?: number
  perspective?: number
}

export function createFlipAndChangeTimeline(
  target: HTMLElement,
  { changeVars, lift = 0, perspective }: FlipAndChangeOptions = {},
) {
  return gsap
    .timeline()
    .set(target, {
      rotationY: 0,
      transformOrigin: '50% 100%',
      ...(perspective === undefined
        ? {}
        : { transformPerspective: perspective }),
      willChange: 'transform',
    })
    .to(target, {
      duration: PREP_DURATION,
      ease: 'power2.in',
      scaleX: 1.08,
      scaleY: 0.85,
    })
    .to(target, {
      duration: RISE_DURATION,
      ease: 'power2.out',
      rotationY: 90,
      scaleX: 0.9,
      scaleY: 1.1,
      y: -lift,
    })
    .set(target, {
      ...changeVars,
      rotationY: -90,
    })
    .to(target, {
      duration: FALL_DURATION,
      ease: 'power2.in',
      rotationY: 0,
      scaleX: 1,
      scaleY: 1,
      y: 0,
    })
    .to(target, {
      duration: IMPACT_DURATION,
      ease: 'power3.out',
      scaleX: 1.08,
      scaleY: 0.85,
    })
    .to(target, {
      duration: RECOVERY_DURATION,
      ease: 'back.out(2)',
      scaleX: 1,
      scaleY: 1,
    })
}
