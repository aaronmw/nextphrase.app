'use client'

import { AppScreen } from '@/app/reducer'
import { teamBColor } from '@/app/theme'
import { useAppContext } from '@/components/AppContext'
import { Confetti } from '@/components/Confetti'
import {
  HEART_LOSS_ANIMATION_COLOR,
  HEART_LOSS_ANIMATION_DURATION_SECONDS,
  HEART_LOSS_ANIMATION_ROTATION_DEGREES,
  HEART_LOSS_ANIMATION_SCALE,
  HEART_LOSS_ANIMATION_Y_PERCENT,
  HEART_LOSS_EXIT_DURATION_SECONDS,
  HEART_LOSS_EXIT_OPACITY,
  HEART_LOSS_EXIT_ROTATION_DEGREES,
  HEART_LOSS_EXIT_SCALE,
  HEART_LOSS_EXIT_Y_PERCENT,
} from '@/components/heartLossAnimation'
import { Icon } from '@/components/Icon'
import type { RegularIconName } from '@/components/Icon/types'
import {
  addPlayerHopToTimeline,
  PLAYER_HOP_DURATION,
  PLAYER_HOP_HEIGHT_MULTIPLIERS,
  type Point,
} from '@/components/playerHopAnimation'
import { InstructionPhone } from '@/components/ScreenForInstructions/InstructionPhone'
import {
  InstructionTeamSelector,
  type InstructionTeamSelectorHandle,
} from '@/components/ScreenForInstructions/InstructionTeamSelector'
import { createTrophyCelebrationTimeline } from '@/components/trophyCelebrationAnimation'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import {
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useMediaQuery } from 'usehooks-ts'

type Team = 'A' | 'B'

interface InstructionSlide {
  accessibleCaption: string
  caption: ReactNode
  id: string
  label: string
}

interface DragState {
  deltaX: number
  pointerId: number
  startedAt: number
  startX: number
  startY: number
}

const PLAYER_TEAMS: Team[] = ['A', 'B', 'A', 'B']
const PLAYER_ORBIT_ORDER = [2, 3, 0, 1]
const PLAYER_ORBIT_SCALE = 1.15
const COMMENT_BURST_ANGLES = [-40, 0, 40]
const COMMENT_BURST_ENTRANCE_ORDER = [0, 2, 1]
const STAGGERED_ENTRANCE_ORDER = [0, 2, 1, 3]
const COMMENT_BURST_ICON_NAMES = [
  'question',
  'exclamation',
  'lightbulb',
  'music',
  'heart',
  'star',
  'bolt',
  'hashtag',
  'quote-left',
  'ellipsis',
  'face-smile',
  'thumbs-up',
] as const satisfies readonly RegularIconName[]
const CIRCLE_BEZIER_FACTOR = 0.5522847498
const PHONE_PLAYER_OVERLAP = 12
const PHONE_NOTCH_DURATION = 1.83
const PHONE_HANDOFF_DURATION = 0.4
const PHONE_PAUSE_DURATION = PHONE_NOTCH_DURATION - PHONE_HANDOFF_DURATION
const PHONE_TEAM_CHANGE_DURATION = 0.15
const PHONE_PHRASE_OUT_DURATION = 0.12
const PHONE_PHRASE_IN_DURATION = 0.18
const PHONE_SCREEN_EXIT_DURATION = 0.45
const PHONE_SCREEN_BLANK_BEAT_DURATION = 0.08
const PHONE_SCREEN_ENTER_DURATION = 0.3
const TEAM_SELECTOR_ENTER_DURATION = 0.55
const PHONE_REVEAL_SLIDE_DURATION = 0.28
const PHONE_REVEAL_DEPTH_DURATION = 0.14
const PHONE_REVEAL_SETTLE_DURATION = 0.35
const PLAYER_ENTRANCE_STAGGER = 0.14
const PLAYER_START_DISTANCE_MULTIPLIER = 1.25
const PLAYER_ASSIGNMENT_PREP_DURATION = 0.05
const PLAYER_ASSIGNMENT_RISE_DURATION = 0.16
const PLAYER_ASSIGNMENT_FALL_DURATION = 0.14
const PLAYER_ASSIGNMENT_IMPACT_DURATION = 0.03
const PLAYER_ASSIGNMENT_RECOVERY_DURATION = 0.06
const PLAYER_ASSIGNMENT_DURATION =
  PLAYER_ASSIGNMENT_PREP_DURATION +
  PLAYER_ASSIGNMENT_RISE_DURATION +
  PLAYER_ASSIGNMENT_FALL_DURATION +
  PLAYER_ASSIGNMENT_IMPACT_DURATION +
  PLAYER_ASSIGNMENT_RECOVERY_DURATION
const TEAM_ASSIGNMENT_SEQUENCE_DURATION = PLAYER_ASSIGNMENT_DURATION * 2
const VICTORY_REVEAL_DELAY = 0.6
const PHONE_REVEAL_DELAY_AFTER_ASSIGNMENTS = 0.5
const TEAM_B_CONFETTI_COLORS = Object.values(teamBColor)
const COMMENT_EXIT_DURATION = 0.16
const COMMENT_EXIT_STAGGER = 0.12
const COMMENT_BURST_TRIGGER_AT = 0.27
const COMMENT_BUBBLE_FLIGHT_DURATION = 0.22
const COMMENT_BUBBLE_STAGGER = COMMENT_BUBBLE_FLIGHT_DURATION * 0.75
const COMMENT_BUBBLE_HOLD_DURATION = 0.12
const COMMENT_BUBBLE_FADE_DURATION = 0.6
const COMMENT_BURST_END_AT =
  COMMENT_BURST_TRIGGER_AT +
  COMMENT_BUBBLE_STAGGER * (COMMENT_BURST_ENTRANCE_ORDER.length - 1) +
  COMMENT_BUBBLE_FLIGHT_DURATION +
  COMMENT_BUBBLE_HOLD_DURATION +
  COMMENT_BUBBLE_FADE_DURATION
const HOLDER_COMMENT_EXIT_AT =
  PHONE_PAUSE_DURATION - COMMENT_EXIT_DURATION - COMMENT_EXIT_STAGGER

const playerPositionClassNames = [
  `
    top-[calc(50%-var(--instruction-orbit-radius))]
    left-1/2
    -translate-x-1/2
    -translate-y-1/2
  `,
  `
    top-1/2
    left-[calc(50%+var(--instruction-orbit-radius))]
    -translate-x-1/2
    -translate-y-1/2
  `,
  `
    top-[calc(50%+var(--instruction-orbit-radius))]
    left-1/2
    -translate-x-1/2
    -translate-y-1/2
  `,
  `
    top-1/2
    left-[calc(50%-var(--instruction-orbit-radius))]
    -translate-x-1/2
    -translate-y-1/2
  `,
]

const instructionSlides: InstructionSlide[] = [
  {
    id: 'form-teams',
    label: 'Form the teams',
    accessibleCaption: 'Sit in a circle, alternating Team A and Team B.',
    caption: (
      <>
        Sit in a circle, alternating{' '}
        <span className="whitespace-nowrap">
          <strong className="text-teamATextColor font-bold">Team A</strong> and{' '}
          <strong className="text-teamBTextColor font-bold">Team B</strong>.
        </span>
      </>
    ),
  },
  {
    id: 'pass-phone',
    label: 'Pass the phone',
    accessibleCaption:
      'Get your team to say the exact phrase shown (swipe the phrase to get a new one) and then pass the phone left to the opposing team.',
    caption: (
      <>
        Get your team to say the{' '}
        <u className="underline-offset-2">exact phrase</u> shown (swipe the
        phrase to get a new one) and then{' '}
        <strong className="font-bold">pass the phone left</strong>&nbsp;to the
        opposing&nbsp;team.
      </>
    ),
  },
  {
    id: 'lose-heart',
    label: 'Lose a heart',
    accessibleCaption:
      'When time runs out, the team holding the phone loses a heart.',
    caption: (
      <>
        When <u className="underline-offset-2">time runs out</u>, the team
        holding the phone{' '}
        <strong className="font-bold">loses a&nbsp;heart.</strong>
      </>
    ),
  },
]

function getTeamFillColor(team: Team) {
  return team === 'A'
    ? 'var(--color-teamAFillColor)'
    : 'var(--color-teamBFillColor)'
}

function setInstructionPhoneAlertTeam(phone: HTMLDivElement, team: Team) {
  phone.style.setProperty('--alert-light-color', getTeamFillColor(team))
}

function setInstructionPhoneActiveTeam(
  phone: HTMLDivElement,
  selectorThumb: HTMLElement,
  team: Team,
) {
  phone.dataset.instructionPhoneTeam = team
  phone.style.setProperty('--selector-color', getTeamFillColor(team))
  selectorThumb.style.transform =
    team === 'A' ? 'translateX(0%)' : 'translateX(100%)'
}

function setInstructionPhoneTeam(
  phone: HTMLDivElement,
  selectorThumb: HTMLElement,
  team: Team,
) {
  setInstructionPhoneAlertTeam(phone, team)
  setInstructionPhoneActiveTeam(phone, selectorThumb, team)
}

function selectCommentBurstIcons() {
  const iconNames = [...COMMENT_BURST_ICON_NAMES]

  for (
    let selectionIndex = 0;
    selectionIndex < COMMENT_BURST_ANGLES.length;
    selectionIndex += 1
  ) {
    const randomIndex =
      selectionIndex +
      Math.floor(Math.random() * (iconNames.length - selectionIndex))
    const selectedIconName = iconNames[selectionIndex]
    iconNames[selectionIndex] = iconNames[randomIndex]
    iconNames[randomIndex] = selectedIconName
  }

  return iconNames.slice(0, COMMENT_BURST_ANGLES.length)
}

function assignCommentBurstIcons(bubbles: HTMLElement[]) {
  selectCommentBurstIcons().forEach((iconName, index) => {
    const glyph = bubbles[index].querySelector<HTMLElement>(
      '[data-comment-burst-glyph]',
    )
    const icon = glyph?.querySelector<HTMLElement>('i')

    if (!(glyph && icon)) return

    const previousIconName = glyph.dataset.commentBurstIcon ?? 'question'
    icon.classList.remove(`fa-${previousIconName}`)
    icon.classList.add(`fa-${iconName}`)
    glyph.dataset.commentBurstIcon = iconName
  })
}

function getPlayerEntranceStartOffset(index: number, diameter: number): Point {
  const distance = diameter * PLAYER_START_DISTANCE_MULTIPLIER

  return [
    { x: 0, y: -distance },
    { x: distance, y: 0 },
    { x: 0, y: distance },
    { x: -distance, y: 0 },
  ][index]
}

function getLocalPlayerSlotBounds(playerSlot: HTMLDivElement) {
  const width = playerSlot.offsetWidth
  const height = playerSlot.offsetHeight
  const centerX = playerSlot.offsetLeft
  const centerY = playerSlot.offsetTop

  return {
    bottom: centerY + height / 2,
    height,
    left: centerX - width / 2,
    right: centerX + width / 2,
    top: centerY - height / 2,
    width,
  }
}

function getInnerOrbitSlotPoints(
  stage: HTMLDivElement,
  playerSlots: (HTMLDivElement | null)[],
  orbitElement: HTMLElement,
  playerOverlap: number,
) {
  const elementWidth = Math.max(orbitElement.offsetWidth, 1)
  const elementHeight = Math.max(orbitElement.offsetHeight, 1)

  if (
    playerSlots.length !== PLAYER_TEAMS.length ||
    playerSlots.some(playerSlot => !playerSlot)
  ) {
    return null
  }

  const playerBounds = playerSlots.map(playerSlot =>
    getLocalPlayerSlotBounds(playerSlot!),
  )
  const stageCenter = {
    x: stage.offsetWidth / 2,
    y: stage.offsetHeight / 2,
  }
  const innerCircleRadius = Math.min(
    stageCenter.y - playerBounds[0].bottom,
    playerBounds[1].left - stageCenter.x,
    playerBounds[2].top - stageCenter.y,
    stageCenter.x - playerBounds[3].right,
  )
  const elementRadius = Math.max(elementWidth, elementHeight) / 2
  const orbitRadius = Math.max(
    0,
    innerCircleRadius - elementRadius + playerOverlap,
  )
  const elementHalfWidth = elementWidth / 2
  const elementHalfHeight = elementHeight / 2
  const orbitDirections: Point[] = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ]

  return orbitDirections.map(direction => ({
    x: stageCenter.x + direction.x * orbitRadius - elementHalfWidth,
    y: stageCenter.y + direction.y * orbitRadius - elementHalfHeight,
  }))
}

function createClockwiseQuarterPath(start: Point, end: Point, center: Point) {
  const startVector = {
    x: start.x - center.x,
    y: start.y - center.y,
  }
  const endVector = {
    x: end.x - center.x,
    y: end.y - center.y,
  }
  const firstControl = {
    x: start.x - startVector.y * CIRCLE_BEZIER_FACTOR,
    y: start.y + startVector.x * CIRCLE_BEZIER_FACTOR,
  }
  const secondControl = {
    x: end.x + endVector.y * CIRCLE_BEZIER_FACTOR,
    y: end.y - endVector.x * CIRCLE_BEZIER_FACTOR,
  }

  return [
    `M ${start.x} ${start.y}`,
    `C ${firstControl.x} ${firstControl.y}`,
    `${secondControl.x} ${secondControl.y}`,
    `${end.x} ${end.y}`,
  ].join(' ')
}

export function InstructionCarousel() {
  const { isLoading, state } = useAppContext()
  const isActive = state.activeScreen === AppScreen.Instructions
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [activeSlide, setActiveSlide] = useState(0)
  const [sceneSlide, setSceneSlide] = useState(0)
  const [sceneReplayKey, setSceneReplayKey] = useState(0)
  const [hasRevealedFinalRule, setHasRevealedFinalRule] = useState(false)
  const [isInstructionConfettiActive, setIsInstructionConfettiActive] =
    useState(false)
  const [stageGeometryVersion, setStageGeometryVersion] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const captionTrackRef = useRef<HTMLDivElement>(null)
  const captionViewportRef = useRef<HTMLDivElement>(null)
  const playerSlotRefs = useRef<(HTMLDivElement | null)[]>([])
  const playerVisualRefs = useRef<(HTMLDivElement | null)[]>([])
  const playerLabelRefs = useRef<(HTMLSpanElement | null)[]>([])
  const commentBubbleRefs = useRef<(HTMLSpanElement | null)[]>([])
  const commentBurstGroupRefs = useRef<(HTMLDivElement | null)[]>([])
  const youTagRef = useRef<HTMLSpanElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)
  const teamSelectorDemoRef = useRef<InstructionTeamSelectorHandle | null>(null)
  const timerRef = useRef<HTMLDivElement>(null)
  const timerRingRef = useRef<SVGCircleElement>(null)
  const heartLayerRef = useRef<HTMLDivElement>(null)
  const heartRef = useRef<HTMLDivElement>(null)
  const lostHeartRef = useRef<HTMLDivElement>(null)
  const trophyRef = useRef<HTMLDivElement>(null)
  const reducedPenaltyRef = useRef<HTMLSpanElement>(null)
  const roundResultRef = useRef<HTMLDivElement>(null)
  const heartLossResultRef = useRef<HTMLSpanElement>(null)
  const winnerResultRef = useRef<HTMLSpanElement>(null)
  const finalRuleRef = useRef<HTMLSpanElement>(null)
  const entranceTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const sceneTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const dragStateRef = useRef<DragState | null>(null)
  const pendingFinalActRef = useRef(false)
  const phoneSeatRef = useRef<number | null>(2)
  const openedOnInstructionsRef = useRef(isActive)
  const hasRunEntranceRef = useRef(false)
  const wasActiveRef = useRef(false)

  useEffect(() => {
    const wasActive = wasActiveRef.current
    wasActiveRef.current = isActive

    if (isActive && !wasActive) {
      pendingFinalActRef.current = false
      phoneSeatRef.current = 2
      setHasRevealedFinalRule(false)
      setIsInstructionConfettiActive(false)
      setActiveSlide(0)
      setSceneSlide(0)
    } else if (!isActive) {
      pendingFinalActRef.current = false
      phoneSeatRef.current = 2
      setHasRevealedFinalRule(false)
      setIsInstructionConfettiActive(false)
      setActiveSlide(0)
      setSceneSlide(0)
    }
  }, [isActive])

  useEffect(() => {
    const stage = stageRef.current

    if (!(stage && typeof ResizeObserver !== 'undefined')) return

    let animationFrame = 0
    let previousWidth = 0
    let previousHeight = 0
    const resizeObserver = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width)
      const height = Math.round(entry.contentRect.height)

      if (width === previousWidth && height === previousHeight) return

      previousWidth = width
      previousHeight = height
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(() => {
        setStageGeometryVersion(version => version + 1)
      })
    })

    resizeObserver.observe(stage)

    return () => {
      cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
    }
  }, [])

  useGSAP(
    () => {
      const stage = stageRef.current
      const phone = phoneRef.current
      const initialPlayerSlot = playerSlotRefs.current[2]
      const playerVisuals = playerVisualRefs.current.filter(
        (player): player is HTMLDivElement => Boolean(player),
      )
      const playerLabels = playerLabelRefs.current.filter(
        (label): label is HTMLSpanElement => Boolean(label),
      )
      const youTag = youTagRef.current

      entranceTimelineRef.current?.kill()
      entranceTimelineRef.current = null
      gsap.set(playerVisuals, { clearProps: 'willChange' })

      const hasCompletePlayerScene =
        initialPlayerSlot &&
        youTag &&
        playerVisuals.length === PLAYER_TEAMS.length &&
        playerLabels.length === PLAYER_TEAMS.length

      if (sceneSlide !== 0 && hasCompletePlayerScene) {
        gsap.killTweensOf([...playerVisuals, ...playerLabels, youTag, phone])
        gsap.set(playerVisuals, {
          clearProps:
            'transform,transformOrigin,willChange,backgroundColor,borderColor,opacity,visibility',
        })
        gsap.set([...playerLabels, youTag], {
          clearProps: 'opacity,visibility',
        })
        gsap.set(initialPlayerSlot, { clearProps: 'zIndex' })
        return
      }

      if (
        !(
          isActive &&
          !isLoading &&
          sceneSlide === 0 &&
          stage &&
          phone &&
          hasCompletePlayerScene
        )
      ) {
        return
      }

      gsap.killTweensOf([...playerVisuals, ...playerLabels, youTag, phone])

      if (prefersReducedMotion) {
        gsap.set(playerVisuals, {
          autoAlpha: 1,
          clearProps:
            'transform,transformOrigin,willChange,backgroundColor,borderColor',
        })
        gsap.set([...playerLabels, youTag], { autoAlpha: 1 })
        hasRunEntranceRef.current = true
        return
      }

      const entranceStartOffsets = playerVisuals.map((player, index) => {
        const diameter = Math.max(player.offsetWidth, player.offsetHeight)
        const start = getPlayerEntranceStartOffset(index, diameter)

        gsap.set(player, {
          autoAlpha: 0,
          backgroundColor: 'var(--color-neutralColor-800)',
          borderColor: 'var(--color-neutralColor-500)',
          scaleX: 1,
          scaleY: 1,
          transformOrigin: '50% 100%',
          willChange: 'transform',
          x: start.x,
          y: start.y,
        })

        return start
      })
      gsap.set([...playerLabels, youTag], { autoAlpha: 0 })
      gsap.set(phone, {
        autoAlpha: 0,
        scale: 0.8,
        z: 0,
        zIndex: 20,
      })

      const phonePoints = getInnerOrbitSlotPoints(
        stage,
        playerSlotRefs.current,
        phone,
        PHONE_PLAYER_OVERLAP,
      )

      if (!phonePoints) return

      const initialPlayerBounds = getLocalPlayerSlotBounds(initialPlayerSlot)
      const phoneStart = {
        x: initialPlayerBounds.right - Math.max(phone.offsetWidth * 0.75, 1),
        y:
          initialPlayerBounds.top +
          (initialPlayerBounds.height - phone.offsetHeight) / 2,
      }
      const phoneClear = {
        x: initialPlayerBounds.right + 2,
        y: phoneStart.y,
      }

      const shouldWaitForLoadingOverlay =
        openedOnInstructionsRef.current && !hasRunEntranceRef.current
      const entranceTimeline = gsap.timeline({
        delay: shouldWaitForLoadingOverlay ? 0.8 : 0.25,
        defaults: {
          ease: 'power3.out',
        },
        onComplete: () => {
          gsap.set(playerVisuals, {
            clearProps:
              'transform,transformOrigin,willChange,backgroundColor,borderColor',
          })
          gsap.set(initialPlayerSlot, { clearProps: 'zIndex' })
          gsap.set(phone, { z: 0, zIndex: 20 })
        },
      })

      STAGGERED_ENTRANCE_ORDER.forEach((playerIndex, entranceIndex) => {
        const player = playerVisuals[playerIndex]
        const entranceStart = entranceStartOffsets[playerIndex]
        const diameter = Math.max(player.offsetWidth, player.offsetHeight)
        const playerTimeline = gsap.timeline()
        const playerStartTime = entranceIndex * PLAYER_ENTRANCE_STAGGER

        entranceTimeline.to(
          player,
          {
            autoAlpha: 1,
            duration: 0.1,
            ease: 'power1.out',
          },
          playerStartTime,
        )

        PLAYER_HOP_HEIGHT_MULTIPLIERS.forEach((heightMultiplier, hopIndex) => {
          const hopStartProgress =
            hopIndex / PLAYER_HOP_HEIGHT_MULTIPLIERS.length
          const hopEndProgress =
            (hopIndex + 1) / PLAYER_HOP_HEIGHT_MULTIPLIERS.length
          const hopStart = {
            x: entranceStart.x * (1 - hopStartProgress),
            y: entranceStart.y * (1 - hopStartProgress),
          }
          const hopEnd = {
            x: entranceStart.x * (1 - hopEndProgress),
            y: entranceStart.y * (1 - hopEndProgress),
          }
          const lift = diameter * heightMultiplier
          addPlayerHopToTimeline(playerTimeline, {
            end: hopEnd,
            lift,
            positionTarget: player,
            start: hopStart,
          })
        })

        entranceTimeline.add(playerTimeline, playerStartTime)
      })

      const latestPlayerStart =
        (STAGGERED_ENTRANCE_ORDER.length - 1) * PLAYER_ENTRANCE_STAGGER
      const playerHopSequenceDuration =
        PLAYER_HOP_HEIGHT_MULTIPLIERS.length * PLAYER_HOP_DURATION
      entranceTimeline.addLabel(
        'assignTeams',
        latestPlayerStart + playerHopSequenceDuration,
      )

      playerVisuals.forEach((player, index) => {
        const diameter = Math.max(player.offsetWidth, player.offsetHeight)
        const identityElements =
          index === 2 ? [playerLabels[index], youTag] : [playerLabels[index]]
        const assignmentTimeline = gsap
          .timeline()
          .set(player, {
            rotationY: 0,
            transformOrigin: '50% 100%',
            transformPerspective: diameter * 8,
            willChange: 'transform',
          })
          .to(player, {
            duration: PLAYER_ASSIGNMENT_PREP_DURATION,
            ease: 'power2.in',
            scaleX: 1.08,
            scaleY: 0.85,
          })
          .to(player, {
            duration: PLAYER_ASSIGNMENT_RISE_DURATION,
            ease: 'power2.out',
            rotationY: 90,
            scaleX: 0.9,
            scaleY: 1.1,
            y: -diameter * 0.32,
          })
          .set(player, {
            backgroundColor: getTeamFillColor(PLAYER_TEAMS[index]),
            borderColor: 'var(--color-neutralColor-100)',
            rotationY: -90,
          })
          .set(identityElements, { autoAlpha: 1 })
          .to(player, {
            duration: PLAYER_ASSIGNMENT_FALL_DURATION,
            ease: 'power2.in',
            rotationY: 0,
            scaleX: 1,
            scaleY: 1,
            y: 0,
          })
          .to(player, {
            duration: PLAYER_ASSIGNMENT_IMPACT_DURATION,
            ease: 'power3.out',
            scaleX: 1.08,
            scaleY: 0.85,
          })
          .to(player, {
            duration: PLAYER_ASSIGNMENT_RECOVERY_DURATION,
            ease: 'back.out(2)',
            scaleX: 1,
            scaleY: 1,
          })

        entranceTimeline.add(
          assignmentTimeline,
          `assignTeams+=${
            PLAYER_TEAMS[index] === 'A' ? 0 : PLAYER_ASSIGNMENT_DURATION
          }`,
        )
      })

      entranceTimeline
        .addLabel(
          'teamAssignmentsComplete',
          `assignTeams+=${TEAM_ASSIGNMENT_SEQUENCE_DURATION}`,
        )
        .set(
          playerVisuals,
          {
            clearProps:
              'transform,transformOrigin,willChange,backgroundColor,borderColor',
          },
          'teamAssignmentsComplete',
        )
        .addLabel(
          'revealPhone',
          `teamAssignmentsComplete+=${PHONE_REVEAL_DELAY_AFTER_ASSIGNMENTS}`,
        )

      entranceTimeline
        .set(initialPlayerSlot, { zIndex: 30 }, 'revealPhone')
        .set(
          phone,
          {
            autoAlpha: 1,
            rotation: 20,
            scale: 1,
            transformPerspective: 240,
            x: phoneStart.x,
            y: phoneStart.y,
            z: 0,
            zIndex: 20,
          },
          'revealPhone',
        )
        .to(
          phone,
          {
            duration: PHONE_REVEAL_SLIDE_DURATION,
            ease: 'power2.out',
            x: phoneClear.x,
          },
          'revealPhone',
        )
        .set(initialPlayerSlot, { clearProps: 'zIndex' })
        .set(phone, { zIndex: 30 })
        .to(phone, {
          duration: PHONE_REVEAL_DEPTH_DURATION,
          ease: 'back.out(1.6)',
          scale: 1.1,
          z: 24,
        })
        .to(phone, {
          duration: PHONE_REVEAL_SETTLE_DURATION,
          ease: 'power2.inOut',
          rotation: 0,
          scale: 1,
          x: phonePoints[2].x,
          y: phonePoints[2].y,
          z: 0,
        })

      hasRunEntranceRef.current = true
      entranceTimelineRef.current = entranceTimeline
    },
    {
      dependencies: [
        isActive,
        isLoading,
        prefersReducedMotion,
        sceneReplayKey,
        sceneSlide,
      ],
      scope: rootRef,
    },
  )

  useGSAP(
    () => {
      const captionTrack = captionTrackRef.current

      if (!(captionTrack && isActive)) return

      gsap.killTweensOf(captionTrack)
      gsap.to(captionTrack, {
        duration: prefersReducedMotion ? 0.15 : 0.45,
        ease: 'power2.inOut',
        x: 0,
        xPercent: -100 * activeSlide,
      })
    },
    {
      dependencies: [activeSlide, isActive, prefersReducedMotion],
      scope: rootRef,
    },
  )

  useGSAP(
    () => {
      const stage = stageRef.current
      const phone = phoneRef.current
      const teamSelectorDemo = teamSelectorDemoRef.current
      const phoneSelectorThumb =
        phone?.querySelector<HTMLElement>(
          '[data-instruction-phone-selector-thumb]',
        ) ?? null
      const phoneAlertLight =
        phone?.querySelector<HTMLElement>(
          '[data-instruction-phone-alert-light]',
        ) ?? null
      const phoneWhiteout =
        phone?.querySelector<HTMLElement>(
          '[data-instruction-phone-whiteout]',
        ) ?? null
      const phoneScoreboard =
        phone?.querySelector<HTMLElement>(
          '[data-instruction-phone-scoreboard]',
        ) ?? null
      const phoneGame =
        phone?.querySelector<HTMLElement>('[data-instruction-phone-game]') ??
        null
      const phoneScreenDot =
        phone?.querySelector<HTMLElement>(
          '[data-instruction-phone-screen-dot]',
        ) ?? null
      const phonePhraseViewport =
        phone?.querySelector<HTMLElement>(
          '[data-instruction-phone-phrase-viewport]',
        ) ?? null
      const phoneSelector =
        phone?.querySelector<HTMLElement>(
          '[data-instruction-phone-selector]',
        ) ?? null
      const phoneScoreTeamA =
        phone?.querySelector<HTMLElement>(
          '[data-instruction-phone-score-team-a]',
        ) ?? null
      const phoneScoreTeamB =
        phone?.querySelector<HTMLElement>(
          '[data-instruction-phone-score-team-b]',
        ) ?? null
      const phoneScoreStart =
        phone?.querySelector<HTMLElement>(
          '[data-instruction-phone-score-start]',
        ) ?? null
      const phonePhrases = phone
        ? Array.from(
            phone.querySelectorAll<HTMLElement>(
              '[data-instruction-phone-phrase]',
            ),
          )
        : []
      const timer = timerRef.current
      const timerRing = timerRingRef.current
      const heartLayer = heartLayerRef.current
      const heart = heartRef.current
      const lostHeart = lostHeartRef.current
      const trophy = trophyRef.current
      const reducedPenalty = reducedPenaltyRef.current
      const roundResult = roundResultRef.current
      const heartLossResult = heartLossResultRef.current
      const winnerResult = winnerResultRef.current
      const finalRule = finalRuleRef.current
      const playerVisuals = playerVisualRefs.current.filter(
        (player): player is HTMLDivElement => Boolean(player),
      )
      const commentBubbles = commentBubbleRefs.current.filter(
        (comment): comment is HTMLSpanElement => Boolean(comment),
      )
      const commentBurstGroups = commentBurstGroupRefs.current.filter(
        (group): group is HTMLDivElement => Boolean(group),
      )
      const commentBurstParticles = commentBurstGroups.flatMap(group =>
        Array.from(
          group.querySelectorAll<HTMLElement>('[data-comment-burst-particle]'),
        ),
      )

      sceneTimelineRef.current?.kill()
      sceneTimelineRef.current = null
      setHasRevealedFinalRule(false)
      setIsInstructionConfettiActive(false)

      if (
        !(
          stage &&
          phone &&
          teamSelectorDemo &&
          phoneSelectorThumb &&
          phoneAlertLight &&
          phoneWhiteout &&
          phoneScoreboard &&
          phoneGame &&
          phoneScreenDot &&
          phonePhraseViewport &&
          phoneSelector &&
          phoneScoreTeamA &&
          phoneScoreTeamB &&
          phoneScoreStart &&
          phonePhrases.length === 2 &&
          timer &&
          timerRing &&
          heartLayer &&
          heart &&
          lostHeart &&
          trophy &&
          reducedPenalty &&
          roundResult &&
          heartLossResult &&
          winnerResult &&
          finalRule &&
          playerVisuals.length === PLAYER_TEAMS.length &&
          commentBubbles.length === PLAYER_TEAMS.length &&
          commentBurstGroups.length === PLAYER_TEAMS.length &&
          commentBurstParticles.length ===
            PLAYER_TEAMS.length * COMMENT_BURST_ANGLES.length
        )
      ) {
        return
      }

      const entranceControlsPhone =
        sceneSlide === 0 &&
        Boolean(
          entranceTimelineRef.current &&
          entranceTimelineRef.current.progress() < 1,
        )

      gsap.killTweensOf([
        ...(entranceControlsPhone ? [] : [phone]),
        phoneAlertLight,
        phoneWhiteout,
        phoneScoreboard,
        phoneGame,
        phoneScreenDot,
        phonePhraseViewport,
        phoneSelector,
        phoneScoreTeamA,
        phoneScoreTeamB,
        phoneScoreStart,
        ...phonePhrases,
        timer,
        timerRing,
        heartLayer,
        heart,
        lostHeart,
        trophy,
        reducedPenalty,
        roundResult,
        heartLossResult,
        winnerResult,
        finalRule,
        ...commentBubbles,
        ...commentBurstGroups,
        ...commentBurstParticles,
      ])

      phoneAlertLight.style.animationPlayState =
        isActive && sceneSlide === 1 ? 'running' : 'paused'

      if (!isActive) {
        teamSelectorDemo.reset()
        gsap.set(playerSlotRefs.current[2], { clearProps: 'zIndex' })
        gsap.set(phone, {
          autoAlpha: 0,
          clearProps:
            'transform,transformOrigin,transformPerspective,willChange,zIndex',
        })
        return
      }

      const phonePoints = getInnerOrbitSlotPoints(
        stage,
        playerSlotRefs.current,
        phone,
        PHONE_PLAYER_OVERLAP,
      )

      if (!phonePoints) return

      gsap.set(playerSlotRefs.current[2], { clearProps: 'zIndex' })

      gsap.set(timer, { autoAlpha: 0, scale: 0.8 })
      gsap.set(timerRing, { strokeDashoffset: 0 })
      gsap.set(heartLayer, { zIndex: 10 })
      gsap.set(heart, { clearProps: 'color' })
      gsap.set(heart, {
        autoAlpha: 0,
        rotation: 0,
        scale: 0.4,
        yPercent: 0,
      })
      gsap.set(lostHeart, {
        autoAlpha: 0,
        rotation: 0,
        scale: HEART_LOSS_EXIT_SCALE,
      })
      gsap.set(trophy, {
        clearProps: 'transformOrigin,transformPerspective,willChange',
      })
      gsap.set(trophy, {
        autoAlpha: 0,
        rotationY: 0,
        scaleX: 1,
        scaleY: 1,
        y: 0,
      })
      gsap.set(reducedPenalty, { autoAlpha: 0, scale: 0.6 })
      gsap.set(roundResult, {
        autoAlpha: 0,
        scale: 0.94,
        y: 8,
      })
      gsap.set(heartLossResult, { autoAlpha: 1, xPercent: 0 })
      gsap.set(winnerResult, { autoAlpha: 0, xPercent: 100 })
      gsap.set(finalRule, { autoAlpha: 0 })
      if (sceneSlide !== instructionSlides.length - 1) {
        setInstructionPhoneTeam(phone, phoneSelectorThumb, 'A')
      }
      gsap.set(phonePhrases[0], { autoAlpha: 1, yPercent: 0 })
      gsap.set(phonePhrases[1], { autoAlpha: 0, yPercent: 100 })
      gsap.set(phoneWhiteout, { autoAlpha: 0 })
      gsap.set([phoneScoreTeamA, phoneScoreTeamB, phoneScoreStart], {
        autoAlpha: 1,
        xPercent: 0,
        yPercent: 0,
      })
      gsap.set(phoneAlertLight, { clearProps: 'transform' })
      gsap.set([phoneScreenDot, phonePhraseViewport, phoneSelector], {
        clearProps: 'transform,opacity,visibility',
      })
      gsap.set(commentBubbles, {
        autoAlpha: 0,
        scale: 0.8,
        y: 3,
      })
      gsap.set(commentBurstGroups, { autoAlpha: 0 })
      gsap.set(commentBurstParticles, {
        autoAlpha: 0,
        scale: 0.72,
        x: 0,
        y: 0,
      })
      if (sceneSlide !== 0) {
        gsap.set(playerVisuals, { visibility: 'visible' })
      }

      if (sceneSlide === 0) {
        phoneSeatRef.current = 2
        teamSelectorDemo.hide(prefersReducedMotion)
        gsap.set(phoneGame, { autoAlpha: 0 })
        gsap.set(phoneScoreboard, { autoAlpha: 1 })

        if (!entranceControlsPhone) {
          gsap.set(phone, {
            autoAlpha: 1,
            rotation: 0,
            scale: 1,
            x: phonePoints[2].x,
            y: phonePoints[2].y,
            z: 0,
            zIndex: 20,
          })
        }

        if (
          !entranceTimelineRef.current ||
          entranceTimelineRef.current.progress() === 1
        ) {
          const resetPlayers = gsap.timeline()
          resetPlayers.to(playerVisuals, {
            autoAlpha: 1,
            duration: 0.25,
            ease: 'power1.out',
          })
          sceneTimelineRef.current = resetPlayers
        }
        return
      }

      if (sceneSlide === 1) {
        teamSelectorDemo.reset('A')

        if (prefersReducedMotion) {
          gsap.set(phoneScoreboard, { autoAlpha: 0 })
          gsap.set(phoneGame, { autoAlpha: 1 })
          phoneSeatRef.current = 2
          gsap.set(playerVisuals, { opacity: 0.5 })
          gsap.set([playerVisuals[0], playerVisuals[2]], { opacity: 1 })
          setInstructionPhoneTeam(phone, phoneSelectorThumb, 'A')
          teamSelectorDemo.reset('A')
          teamSelectorDemo.show(true)
          gsap.set(phone, {
            autoAlpha: 1,
            rotation: 0,
            scale: 1,
            x: phonePoints[2].x,
            y: phonePoints[2].y,
          })
          return
        }

        const orbitCenter = phonePoints.reduce(
          (center, point) => ({
            x: center.x + point.x / phonePoints.length,
            y: center.y + point.y / phonePoints.length,
          }),
          { x: 0, y: 0 },
        )
        const phoneScene = gsap.timeline()
        const phoneScreenTransition = gsap.timeline()
        const orbitLoop = gsap.timeline({ repeat: -1 })
        const phoneScreenHeight = Math.max(phoneGame.offsetHeight, 1)

        phoneSeatRef.current = 2

        phoneScreenTransition
          .set(phoneScoreboard, { autoAlpha: 1 })
          .set(phoneGame, { autoAlpha: 0 })
          .addLabel('scoreExit')
          .to(
            phoneScoreTeamA,
            {
              duration: PHONE_SCREEN_EXIT_DURATION,
              ease: 'power2.in',
              xPercent: -160,
            },
            'scoreExit',
          )
          .to(
            phoneScoreTeamB,
            {
              duration: PHONE_SCREEN_EXIT_DURATION,
              ease: 'power2.in',
              xPercent: 160,
            },
            'scoreExit',
          )
          .to(
            phoneScoreStart,
            {
              duration: PHONE_SCREEN_EXIT_DURATION,
              ease: 'power2.in',
              yPercent: 160,
            },
            'scoreExit',
          )
          .addLabel(
            'gameEnter',
            `scoreExit+=${
              PHONE_SCREEN_EXIT_DURATION + PHONE_SCREEN_BLANK_BEAT_DURATION
            }`,
          )
          .set(phoneScoreboard, { autoAlpha: 0 }, 'gameEnter')
          .set(phoneGame, { autoAlpha: 1 }, 'gameEnter')
          .set(
            [phoneAlertLight, phoneScreenDot],
            { y: -phoneScreenHeight },
            'gameEnter',
          )
          .set(phonePhraseViewport, { autoAlpha: 0 }, 'gameEnter')
          .set(phoneSelector, { y: phoneScreenHeight }, 'gameEnter')
          .to(
            [phoneAlertLight, phoneScreenDot],
            {
              duration: PHONE_SCREEN_ENTER_DURATION,
              ease: 'power2.out',
              y: 0,
            },
            'gameEnter',
          )
          .to(
            phonePhraseViewport,
            {
              autoAlpha: 1,
              duration: PHONE_SCREEN_ENTER_DURATION,
              ease: 'power2.out',
            },
            'gameEnter',
          )
          .to(
            phoneSelector,
            {
              duration: PHONE_SCREEN_ENTER_DURATION,
              ease: 'power2.out',
              y: 0,
            },
            'gameEnter',
          )

        phoneScene.to(playerVisuals, {
          duration: 0.25,
          ease: 'power1.out',
          opacity: 0.5,
        })

        phoneScene.set(
          phone,
          {
            autoAlpha: 1,
            rotation: 0,
            scale: 1,
            x: phonePoints[2].x,
            y: phonePoints[2].y,
            z: 0,
            zIndex: 20,
          },
          0,
        )
        phoneScene.add(phoneScreenTransition, 0)

        PLAYER_ORBIT_ORDER.forEach((index, orbitIndex) => {
          const start = phonePoints[index]
          const endIndex =
            PLAYER_ORBIT_ORDER[(orbitIndex + 1) % PLAYER_ORBIT_ORDER.length]
          const end = phonePoints[endIndex]
          const teammateIndex =
            (index + PLAYER_TEAMS.length / 2) % PLAYER_TEAMS.length
          const activePlayers = [
            playerVisuals[index],
            playerVisuals[teammateIndex],
          ]
          const holderComment = commentBubbles[index]
          const guesserBurst = commentBurstGroups[teammateIndex]
          const guesserBurstParticles = Array.from(
            guesserBurst.querySelectorAll<HTMLElement>(
              '[data-comment-burst-particle]',
            ),
          )
          const burstDistance = Math.max(
            playerVisuals[teammateIndex].offsetWidth * 0.6,
            32,
          )
          const pauseLabel = `pause-${index}`
          const handoffLabel = `handoff-${index}`
          const burstLabel = `${pauseLabel}+=${COMMENT_BURST_TRIGGER_AT}`
          const teamChangeLabel = `${pauseLabel}+=${
            PHONE_PAUSE_DURATION - PHONE_TEAM_CHANGE_DURATION
          }`
          const phraseChangeLabel = `${handoffLabel}`
          const receivingTeam = PLAYER_TEAMS[endIndex]
          const outgoingPhrase = phonePhrases[index % phonePhrases.length]
          const incomingPhrase = phonePhrases[(index + 1) % phonePhrases.length]

          orbitLoop
            .addLabel(pauseLabel)
            .call(
              () => {
                phoneSeatRef.current = index

                if (index === 2 && pendingFinalActRef.current) {
                  pendingFinalActRef.current = false
                  setSceneSlide(2)
                }
              },
              [],
              pauseLabel,
            )
            .to(
              activePlayers,
              {
                duration: 0.15,
                ease: 'power1.out',
                opacity: 1,
              },
              pauseLabel,
            )
            .to(
              holderComment,
              {
                autoAlpha: 1,
                duration: 0.18,
                ease: 'power2.out',
                scale: 1,
                y: 0,
              },
              `${pauseLabel}+=0.15`,
            )
            .call(
              () => assignCommentBurstIcons(guesserBurstParticles),
              [],
              burstLabel,
            )
            .set(guesserBurst, { autoAlpha: 1 }, burstLabel)
            .to(
              holderComment,
              {
                autoAlpha: 0,
                duration: COMMENT_EXIT_DURATION,
                ease: 'power2.in',
                scale: 0.9,
                y: -2,
              },
              `${pauseLabel}+=${HOLDER_COMMENT_EXIT_AT}`,
            )
            .call(
              () => {
                setInstructionPhoneAlertTeam(phone, receivingTeam)

                if (orbitIndex === 0) {
                  teamSelectorDemo.show({
                    duration: TEAM_SELECTOR_ENTER_DURATION,
                  })
                }

                teamSelectorDemo.animatePass(receivingTeam, () =>
                  setInstructionPhoneActiveTeam(
                    phone,
                    phoneSelectorThumb,
                    receivingTeam,
                  ),
                )
              },
              [],
              teamChangeLabel,
            )
            .addLabel(handoffLabel, `${pauseLabel}+=${PHONE_PAUSE_DURATION}`)
            .call(
              () => {
                phoneSeatRef.current = null
              },
              [],
              handoffLabel,
            )
            .set(
              incomingPhrase,
              { autoAlpha: 0, yPercent: 100 },
              phraseChangeLabel,
            )
            .to(
              outgoingPhrase,
              {
                autoAlpha: 0,
                duration: PHONE_PHRASE_OUT_DURATION,
                ease: 'power2.in',
                yPercent: -100,
              },
              phraseChangeLabel,
            )
            .to(
              incomingPhrase,
              {
                autoAlpha: 1,
                duration: PHONE_PHRASE_IN_DURATION,
                ease: 'power2.out',
                yPercent: 0,
              },
              `${phraseChangeLabel}+=${PHONE_PHRASE_OUT_DURATION}`,
            )
            .to(
              activePlayers,
              {
                duration: 0.15,
                ease: 'power1.out',
                opacity: 0.5,
              },
              handoffLabel,
            )
            .set(
              outgoingPhrase,
              { yPercent: 100 },
              `${phraseChangeLabel}+=${
                PHONE_PHRASE_OUT_DURATION + PHONE_PHRASE_IN_DURATION
              }`,
            )
            .to(
              phone,
              {
                duration: PHONE_HANDOFF_DURATION,
                ease: 'power1.inOut',
                motionPath: {
                  autoRotate: false,
                  path: createClockwiseQuarterPath(start, end, orbitCenter),
                },
                rotation: 90 * (orbitIndex + 1),
              },
              handoffLabel,
            )

          COMMENT_BURST_ENTRANCE_ORDER.forEach((bubbleIndex, entranceIndex) => {
            const bubble = guesserBurstParticles[bubbleIndex]
            const angle = (COMMENT_BURST_ANGLES[bubbleIndex] * Math.PI) / 180
            const bubbleStart =
              COMMENT_BURST_TRIGGER_AT + COMMENT_BUBBLE_STAGGER * entranceIndex

            orbitLoop
              .set(
                bubble,
                {
                  autoAlpha: 1,
                  scale: 0.72,
                  x: 0,
                  y: 0,
                },
                `${pauseLabel}+=${bubbleStart}`,
              )
              .to(
                bubble,
                {
                  duration: COMMENT_BUBBLE_FLIGHT_DURATION,
                  ease: 'power2.out',
                  scale: 1,
                  x: Math.sin(angle) * burstDistance,
                  y: -Math.cos(angle) * burstDistance,
                },
                `${pauseLabel}+=${bubbleStart}`,
              )
              .to(
                bubble,
                {
                  autoAlpha: 0,
                  duration: COMMENT_BUBBLE_FADE_DURATION,
                  ease: 'power1.in',
                },
                `${pauseLabel}+=${
                  bubbleStart +
                  COMMENT_BUBBLE_FLIGHT_DURATION +
                  COMMENT_BUBBLE_HOLD_DURATION
                }`,
              )
          })

          orbitLoop.set(
            guesserBurst,
            { autoAlpha: 0 },
            `${pauseLabel}+=${COMMENT_BURST_END_AT}`,
          )
        })

        phoneScene.add(orbitLoop)
        sceneTimelineRef.current = phoneScene
        return
      }

      teamSelectorDemo.hide(prefersReducedMotion)
      gsap.set(phoneGame, { autoAlpha: 1 })
      gsap.set(phoneScoreboard, { autoAlpha: 0 })
      phoneSeatRef.current = null

      if (prefersReducedMotion) {
        setInstructionPhoneTeam(phone, phoneSelectorThumb, 'A')
        gsap.set(playerVisuals, {
          opacity: playerIndex => (PLAYER_TEAMS[playerIndex] === 'B' ? 1 : 0),
        })
        gsap.set(phone, {
          autoAlpha: 0,
          rotation: 360,
          scale: 1,
          x: phonePoints[2].x,
          y: phonePoints[2].y,
        })
        gsap.set(timer, { autoAlpha: 0, scale: 1 })
        gsap.set(timerRing, { strokeDashoffset: 100 })
        gsap.set(heart, { autoAlpha: 0 })
        gsap.set(lostHeart, { autoAlpha: 0 })
        gsap.set(trophy, {
          autoAlpha: 1,
          rotation: 0,
          rotationY: 0,
          scaleX: 1,
          scaleY: 1,
          x: 0,
          y: 0,
        })
        gsap.set(phoneScoreboard, { autoAlpha: 1 })
        gsap.set(roundResult, { autoAlpha: 1, scale: 1, y: 0 })
        gsap.set(heartLossResult, { autoAlpha: 0, xPercent: -100 })
        gsap.set(winnerResult, { autoAlpha: 1, xPercent: 0 })
        gsap.set(finalRule, { autoAlpha: 1 })
        setHasRevealedFinalRule(true)
        phoneSeatRef.current = null
        return
      }

      const trophyCelebrationLoop = createTrophyCelebrationTimeline(trophy)

      const finalScene = gsap.timeline({
        defaults: {
          ease: 'power2.inOut',
        },
      })

      finalScene
        .set(phone, {
          autoAlpha: 1,
          rotation: 360,
          scale: 1,
          x: phonePoints[2].x,
          y: phonePoints[2].y,
          z: 0,
          zIndex: 20,
        })
        .addLabel('phoneSettled')
        .call(
          () => {
            setInstructionPhoneTeam(phone, phoneSelectorThumb, 'A')
            phoneSeatRef.current = 2
          },
          [],
          'phoneSettled',
        )
        .set(
          phone,
          {
            autoAlpha: 1,
            scale: 1,
            x: phonePoints[2].x,
            y: phonePoints[2].y,
          },
          'phoneSettled',
        )
        .to(
          playerVisuals,
          {
            duration: 0.25,
            opacity: playerIndex =>
              PLAYER_TEAMS[playerIndex] === 'B' ? 0.5 : 1,
          },
          'phoneSettled',
        )
        .to(
          heart,
          {
            autoAlpha: 1,
            duration: 0.25,
            ease: 'back.out(2)',
            scale: 1,
          },
          'phoneSettled+=0.05',
        )
        .to(
          timer,
          {
            autoAlpha: 1,
            duration: 0.25,
            scale: 1,
          },
          'phoneSettled+=0.12',
        )
        .to(
          timerRing,
          {
            duration: 1.4,
            ease: 'none',
            strokeDashoffset: 100,
          },
          'phoneSettled+=0.37',
        )
        .addLabel('timerExpired', 'phoneSettled+=1.77')
        .to(
          timer,
          {
            autoAlpha: 0,
            duration: 0.2,
          },
          'timerExpired',
        )
        .addLabel('heartBurst', 'timerExpired')
        .set(heartLayer, { zIndex: 40 }, 'heartBurst')
        .to(
          phoneWhiteout,
          {
            autoAlpha: 1,
            duration: 0.08,
            ease: 'power2.out',
          },
          'heartBurst',
        )
        .set(phoneScoreboard, { autoAlpha: 1 }, 'heartBurst+=0.08')
        .to(
          phoneWhiteout,
          {
            autoAlpha: 0,
            duration: 0.16,
            ease: 'power2.out',
          },
          'heartBurst+=0.11',
        )
        .to(
          heart,
          {
            color: HEART_LOSS_ANIMATION_COLOR,
            duration: HEART_LOSS_ANIMATION_DURATION_SECONDS,
            ease: 'power1.inOut',
            rotation: HEART_LOSS_ANIMATION_ROTATION_DEGREES,
            scale: HEART_LOSS_ANIMATION_SCALE,
            yPercent: HEART_LOSS_ANIMATION_Y_PERCENT,
          },
          'heartBurst',
        )
        .to(
          heart,
          {
            duration: HEART_LOSS_EXIT_DURATION_SECONDS,
            ease: 'power2.inOut',
            opacity: HEART_LOSS_EXIT_OPACITY,
            rotation: HEART_LOSS_EXIT_ROTATION_DEGREES,
            scale: HEART_LOSS_EXIT_SCALE,
            yPercent: HEART_LOSS_EXIT_Y_PERCENT,
          },
          `heartBurst+=${HEART_LOSS_ANIMATION_DURATION_SECONDS}`,
        )
        .set(heart, { autoAlpha: 0 })
        .set(lostHeart, {
          autoAlpha: HEART_LOSS_EXIT_OPACITY,
          rotation: HEART_LOSS_EXIT_ROTATION_DEGREES,
          scale: HEART_LOSS_EXIT_SCALE,
        })
        .to(
          roundResult,
          {
            autoAlpha: 1,
            duration: 0.3,
            ease: 'back.out(1.8)',
            scale: 1,
            y: 0,
          },
          '+=0.12',
        )
        .addLabel('victoryReveal', `+=${VICTORY_REVEAL_DELAY}`)
        .call(
          () => {
            setHasRevealedFinalRule(true)
            setIsInstructionConfettiActive(true)
          },
          [],
          'victoryReveal',
        )
        .to(
          heartLossResult,
          {
            autoAlpha: 0,
            duration: 0.35,
            ease: 'power2.inOut',
            xPercent: -100,
          },
          'victoryReveal',
        )
        .to(
          winnerResult,
          {
            autoAlpha: 1,
            duration: 0.35,
            ease: 'power2.inOut',
            xPercent: 0,
          },
          'victoryReveal',
        )
        .to(
          finalRule,
          {
            autoAlpha: 1,
            duration: 0.45,
            ease: 'power2.out',
          },
          'victoryReveal',
        )
        .to(
          [playerVisuals[0], playerVisuals[2], phone],
          {
            autoAlpha: 0,
            duration: 0.4,
            ease: 'power2.in',
          },
          'victoryReveal',
        )
        .to(
          [playerVisuals[1], playerVisuals[3]],
          {
            duration: 0.4,
            ease: 'power2.out',
            opacity: 1,
          },
          'victoryReveal',
        )
        .to(
          lostHeart,
          {
            autoAlpha: 0,
            duration: 0.15,
            ease: 'power1.in',
          },
          'victoryReveal',
        )
        .set(
          trophy,
          {
            autoAlpha: 1,
            rotation: 0,
            rotationY: 0,
            scaleX: 1,
            scaleY: 1,
            transformOrigin: '50% 100%',
            willChange: 'transform',
            x: 0,
            y: 0,
          },
          'victoryReveal',
        )
        .add(trophyCelebrationLoop, 'victoryReveal')

      sceneTimelineRef.current = finalScene
    },
    {
      dependencies: [
        sceneSlide,
        sceneReplayKey,
        isActive,
        prefersReducedMotion,
        stageGeometryVersion,
      ],
      scope: rootRef,
    },
  )

  function settleCaptionTrack() {
    const captionTrack = captionTrackRef.current

    if (!captionTrack) return

    gsap.killTweensOf(captionTrack)
    gsap.to(captionTrack, {
      duration: prefersReducedMotion ? 0.15 : 0.35,
      ease: 'power2.out',
      x: 0,
      xPercent: -100 * activeSlide,
    })
  }

  function goToSlide(nextSlide: number) {
    const clampedSlide = gsap.utils.clamp(
      0,
      instructionSlides.length - 1,
      nextSlide,
    )

    if (clampedSlide === activeSlide) {
      settleCaptionTrack()
      return
    }

    if (
      clampedSlide === instructionSlides.length - 1 &&
      !prefersReducedMotion
    ) {
      setActiveSlide(clampedSlide)

      if (sceneSlide === 1 && phoneSeatRef.current === 2) {
        pendingFinalActRef.current = false
        setSceneSlide(clampedSlide)
      } else {
        pendingFinalActRef.current = true

        if (sceneSlide !== 1) {
          setSceneSlide(1)
        }
      }

      return
    }

    pendingFinalActRef.current = false
    setActiveSlide(clampedSlide)
    setSceneSlide(clampedSlide)
  }

  function handleDotClick(slide: number) {
    if (slide !== activeSlide) {
      goToSlide(slide)
      return
    }

    pendingFinalActRef.current = false
    setSceneSlide(slide)
    setSceneReplayKey(key => key + 1)
    settleCaptionTrack()
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || (event.target as HTMLElement).closest('button')) {
      return
    }

    dragStateRef.current = {
      deltaX: 0,
      pointerId: event.pointerId,
      startedAt: performance.now(),
      startX: event.clientX,
      startY: event.clientY,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current
    const captionTrack = captionTrackRef.current

    if (
      !(dragState && captionTrack && dragState.pointerId === event.pointerId)
    ) {
      return
    }

    const deltaX = event.clientX - dragState.startX
    const deltaY = event.clientY - dragState.startY

    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) return

    event.preventDefault()
    dragState.deltaX = deltaX

    const isPastStart = activeSlide === 0 && deltaX > 0
    const isPastEnd = activeSlide === instructionSlides.length - 1 && deltaX < 0
    const resistedDelta = isPastStart || isPastEnd ? deltaX * 0.25 : deltaX

    gsap.set(captionTrack, { x: resistedDelta })
  }

  function finishPointerGesture(event: PointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current

    if (!dragState || dragState.pointerId !== event.pointerId) return

    dragStateRef.current = null

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    const elapsed = Math.max(performance.now() - dragState.startedAt, 1)
    const speed = Math.abs(dragState.deltaX) / elapsed
    const viewportWidth = captionViewportRef.current?.clientWidth ?? 0
    const distanceThreshold = Math.min(64, Math.max(40, viewportWidth * 0.14))
    const shouldAdvance =
      Math.abs(dragState.deltaX) >= distanceThreshold || speed >= 0.45

    if (!shouldAdvance) {
      settleCaptionTrack()
      return
    }

    goToSlide(activeSlide + (dragState.deltaX < 0 ? 1 : -1))
  }

  function handlePointerCancel(event: PointerEvent<HTMLDivElement>) {
    if (dragStateRef.current?.pointerId !== event.pointerId) return

    dragStateRef.current = null
    settleCaptionTrack()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goToSlide(activeSlide - 1)
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goToSlide(activeSlide + 1)
    }
  }

  return (
    <div
      ref={rootRef}
      aria-label="How to play instructions"
      aria-roledescription="carousel"
      className="
        focus-visible:ring-primaryColor-500
        absolute
        inset-0
        flex
        touch-pan-y
        flex-col
        overflow-hidden
        px-3
        pt-1
        outline-none
        focus-visible:ring-2
        focus-visible:ring-inset
      "
      data-active-slide={activeSlide + 1}
      role="region"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointerGesture}
    >
      <div
        aria-hidden="true"
        className="
          relative
          mt-auto
          grid
          h-[calc(min(68vw,34dvh,10rem)+5.25rem)]
          w-full
          shrink-0
          place-items-center
          transition-transform
          duration-300
          ease-in-out
          motion-reduce:transition-none
        "
        data-instruction-stage-slot
        style={{
          transform:
            sceneSlide === 1
              ? 'translateY(0)'
              : 'translateY(calc(0px - min(6.8vw, 3.4dvh, 1rem)))',
        }}
      >
        <div
          className={`
            flex
            w-full
            flex-col
            items-center
            gap-6
            overflow-visible
            transition-[height,padding-top]
            duration-300
            ease-in-out
            motion-reduce:transition-none
            ${
              sceneSlide === 1
                ? 'h-[calc(min(68vw,34dvh,10rem)+5.25rem)] pt-6'
                : 'h-[min(68vw,34dvh,10rem)] pt-0'
            }
          `}
          data-instruction-stage-stack
        >
          <div
            ref={stageRef}
            className="
              relative
              size-[min(68vw,34dvh,10rem)]
              shrink-0
            "
            style={
              {
                '--instruction-player-size': 'clamp(2rem, 19vw, 2.75rem)',
                '--instruction-orbit-radius': `calc((100% - var(--instruction-player-size)) * ${
                  PLAYER_ORBIT_SCALE / 2
                })`,
              } as CSSProperties
            }
          >
            <svg
              className="
                stroke-dividerColor
                pointer-events-none
                absolute
                top-1/2
                left-1/2
                z-0
                -translate-x-1/2
                -translate-y-1/2
                overflow-visible
              "
              style={{
                height: 'calc(var(--instruction-orbit-radius) * 2)',
                width: 'calc(var(--instruction-orbit-radius) * 2)',
              }}
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="48"
                strokeDasharray="4 7"
                strokeLinecap="round"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {PLAYER_TEAMS.map((team, index) => (
              <div
                ref={element => {
                  playerSlotRefs.current[index] = element
                }}
                className={`
                  absolute
                  z-10
                  size-[var(--instruction-player-size)]
                  ${playerPositionClassNames[index]}
                `}
                key={`${team}-${index}`}
              >
                <div
                  ref={element => {
                    playerVisualRefs.current[index] = element
                  }}
                  className={`
                    border-neutralColor-100
                    relative
                    flex
                    size-full
                    items-center
                    justify-center
                    rounded-full
                    border-4
                    shadow-lg
                    backface-visible
                    ${
                      team === 'A'
                        ? 'bg-teamAFillColor text-textOnTeamAColor'
                        : 'bg-teamBFillColor text-textOnTeamBColor'
                    }
                  `}
                  data-instruction-player={index}
                >
                  <span
                    ref={element => {
                      playerLabelRefs.current[index] = element
                    }}
                    className={`
                      text-lg
                      leading-none
                      ${team === 'B' ? 'translate-y-[3px]' : 'translate-y-px'}
                    `}
                  >
                    {team}
                  </span>

                  {index === 2 && (
                    <span
                      ref={youTagRef}
                      className="
                        bg-neutralColor-100
                        text-neutralColor-950
                        border-neutralColor-100
                        absolute
                        bottom-[-0.35rem]
                        left-1/2
                        flex
                        h-[0.8rem]
                        -translate-x-1/2
                        items-center
                        justify-center
                        rounded-full
                        border-2
                        px-1
                        text-[0.4rem]
                        leading-none
                        uppercase
                      "
                    >
                      <span className="translate-y-[2px]">You</span>
                    </span>
                  )}
                </div>
                <div
                  className="
                    pointer-events-none
                    absolute
                    top-1/4
                    left-3/4
                    z-10
                    flex
                    size-8
                    -translate-y-full
                    items-center
                    justify-center
                  "
                >
                  <span
                    ref={element => {
                      commentBubbleRefs.current[index] = element
                    }}
                    className={`
                      flex
                      size-full
                      items-center
                      justify-center
                      text-[1.4rem]
                      leading-none
                      opacity-0
                      drop-shadow-md
                      ${
                        team === 'A'
                          ? 'text-teamAFillColor'
                          : 'text-teamBFillColor'
                      }
                    `}
                  >
                    <Icon name="solid:comment" />
                  </span>
                </div>

                <div
                  ref={element => {
                    commentBurstGroupRefs.current[index] = element
                  }}
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    top-1/4
                    left-1/2
                    z-20
                    size-0
                    opacity-0
                  "
                >
                  {COMMENT_BURST_ANGLES.map(angle => (
                    <span
                      className={`
                        absolute
                        top-0
                        left-0
                        flex
                        size-7
                        -translate-x-1/2
                        -translate-y-1/2
                        items-center
                        justify-center
                        text-[1rem]
                        leading-none
                        opacity-0
                        drop-shadow-md
                        ${
                          team === 'A'
                            ? 'text-teamAFillColor'
                            : 'text-teamBFillColor'
                        }
                      `}
                      data-comment-burst-particle
                      key={angle}
                    >
                      <Icon
                        className="
                          absolute
                          inset-0
                          z-0
                          flex
                          items-center
                          justify-center
                        "
                        name="solid:comment-middle"
                        style={{ transform: `rotate(${angle}deg)` }}
                      />
                      <Icon
                        className="
                          text-neutralColor-100
                          absolute
                          inset-0
                          z-10
                          flex
                          items-center
                          justify-center
                          text-[0.42em]
                        "
                        data-comment-burst-glyph
                        data-comment-burst-icon="question"
                        name="solid:question"
                        style={{ transform: `rotate(${angle}deg)` }}
                      />
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <InstructionPhone ref={phoneRef} />

            <div
              ref={timerRef}
              className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              opacity-0
            "
            >
              <svg
                className="
                size-[3.4rem]
                -rotate-90
                overflow-visible
              "
                viewBox="0 0 100 100"
              >
                <circle
                  className="stroke-neutralColor-800"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="43"
                  strokeWidth="10"
                />
                <circle
                  ref={timerRingRef}
                  className="stroke-teamATextColor"
                  cx="50"
                  cy="50"
                  fill="none"
                  pathLength="100"
                  r="43"
                  strokeDasharray="100"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  strokeWidth="10"
                />
              </svg>
            </div>

            <div
              ref={heartLayerRef}
              className="
              absolute
              inset-0
              z-10
              flex
              items-center
              justify-center
            "
              data-instruction-heart-layer
            >
              <div
                ref={heartRef}
                className="
                text-teamATextColor
                relative
                flex
                size-[1em]
                items-center
                justify-center
                text-[1.8rem]
                leading-none
                opacity-0
              "
                data-instruction-heart
              >
                <Icon
                  className="translate-y-[0.15rem]"
                  name="solid:heart"
                />
                <span
                  ref={reducedPenaltyRef}
                  className="
                  text-textOnTeamAColor
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  text-xs
                  leading-none
                  opacity-0
                "
                >
                  −1
                </span>
              </div>

              <div
                ref={lostHeartRef}
                className="
                  text-neutralColor-100
                  absolute
                  flex
                  size-[1em]
                  items-center
                  justify-center
                  text-[1.8rem]
                  leading-none
                  opacity-0
                "
                data-instruction-lost-heart
              >
                <Icon name="solid:xmark" />
              </div>

              <div
                ref={trophyRef}
                aria-hidden="true"
                className="
                  absolute
                  flex
                  size-[1em]
                  items-center
                  justify-center
                  text-[2rem]
                  leading-none
                  opacity-0
                  backface-visible
                "
                data-instruction-trophy
              >
                🏆
              </div>
            </div>
          </div>

          <InstructionTeamSelector ref={teamSelectorDemoRef} />
        </div>

        <div
          ref={roundResultRef}
          className="
            pointer-events-none
            absolute
            -bottom-[1.125rem]
            left-1/2
            grid
            h-[2.25rem]
            w-[min(82vw,18rem)]
            -translate-x-1/2
            place-items-center
            overflow-hidden
            text-center
            text-lg
            leading-none
            opacity-0
          "
          data-instruction-round-result
        >
          <span
            ref={heartLossResultRef}
            className="
              whitespace-nowrap
              [grid-area:1/1]
            "
          >
            <strong className="text-teamATextColor">Team A</strong>
            <br />
            Loses a Heart
          </span>
          <span
            ref={winnerResultRef}
            className="
              whitespace-nowrap
              opacity-0
              [grid-area:1/1]
            "
          >
            Winner:
            <br />
            <strong className="text-teamBTextColor">Team B!</strong>
          </span>
        </div>
      </div>

      <div
        ref={captionViewportRef}
        className="
          my-auto
          h-[clamp(4.5rem,18dvh,5.5rem)]
          shrink-0
          translate-y-2
          overflow-hidden
        "
      >
        <div
          ref={captionTrackRef}
          className="
            grid
            h-full
            w-full
            grid-cols-[repeat(3,100%)]
            will-change-transform
          "
        >
          {instructionSlides.map((slide, index) => (
            <p
              aria-hidden={activeSlide !== index}
              className="
                  flex
                  h-full
                  items-center
                  justify-center
                  px-1
                  text-center
                  text-xs
                  font-normal
                "
              id={`instruction-caption-${slide.id}`}
              key={slide.id}
            >
              {index === instructionSlides.length - 1 ? (
                <span>
                  {slide.caption}{' '}
                  <span
                    ref={finalRuleRef}
                    aria-hidden={!hasRevealedFinalRule}
                    className="opacity-0"
                  >
                    The team to lose its{' '}
                    <strong className="font-bold whitespace-nowrap">
                      last heart
                    </strong>{' '}
                    loses the game.
                  </span>
                </span>
              ) : (
                <span>{slide.caption}</span>
              )}
            </p>
          ))}
        </div>
      </div>

      <div
        aria-label="Instruction slides"
        className="
          flex
          h-6
          shrink-0
          items-center
          justify-center
        "
        role="group"
      >
        {instructionSlides.map((slide, index) => {
          const isCurrent = activeSlide === index

          return (
            <button
              aria-current={isCurrent ? 'step' : undefined}
              aria-label={`Go to instruction ${index + 1}: ${slide.label}`}
              className="
                  focus-visible:ring-primaryColor-500
                  flex
                  size-6
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-full
                  outline-none
                  focus-visible:ring-2
                "
              key={slide.id}
              type="button"
              onClick={() => handleDotClick(index)}
            >
              <span
                aria-hidden="true"
                className={`
                    border-neutralColor-100
                    size-2
                    rounded-full
                    border-2
                    transition-all
                    ${
                      isCurrent
                        ? 'bg-neutralColor-100 scale-110'
                        : 'bg-transparent opacity-55'
                    }
                  `}
              />
            </button>
          )
        })}
      </div>

      <p
        aria-live="polite"
        className="sr-only"
      >
        {activeSlide === instructionSlides.length - 1 && hasRevealedFinalRule
          ? `Instruction ${activeSlide + 1} of ${instructionSlides.length}. ${instructionSlides[activeSlide].accessibleCaption} The team to lose its last heart loses the game.`
          : `Instruction ${activeSlide + 1} of ${instructionSlides.length}. ${instructionSlides[activeSlide].accessibleCaption}`}
      </p>

      <Confetti
        key={`instruction-confetti-${sceneReplayKey}`}
        colors={TEAM_B_CONFETTI_COLORS}
        overlay={
          isActive && isInstructionConfettiActive ? (
            <span
              aria-hidden="true"
              className={`
                bg-bgColor
                pointer-events-none
                fixed
                z-[110]
                flex
                size-6
                items-center
                justify-center
                rounded-full
                text-xs
                ${
                  state.rotateScreen
                    ? 'right-3 bottom-[calc(env(safe-area-inset-bottom)+0.25rem)] rotate-180'
                    : 'top-[calc(env(safe-area-inset-top)+0.25rem)] left-3'
                }
              `}
            >
              <Icon
                className="translate-y-px"
                name="arrow-left-long"
              />
            </span>
          ) : null
        }
        recycle={isActive && isInstructionConfettiActive}
        trigger={isActive && isInstructionConfettiActive}
      />
    </div>
  )
}
