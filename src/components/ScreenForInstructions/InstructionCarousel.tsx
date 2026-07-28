'use client'

import { AppScreen } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import { Icon } from '@/components/Icon'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import {
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

interface Point {
  x: number
  y: number
}

interface DragState {
  deltaX: number
  pointerId: number
  startedAt: number
  startX: number
  startY: number
}

const PLAYER_TEAMS: Team[] = ['A', 'B', 'A', 'B']
const PARTICLE_ANGLES = [0, 38, 78, 118, 158, 198, 238, 278, 318]
const CIRCLE_BEZIER_FACTOR = 0.5522847498
const PHONE_PLAYER_OVERLAP = 12
const COMMENT_PLAYER_OVERLAP = -2
const PLAYER_ORIENTATIONS = [180, 270, 0, 90]
const PHONE_NOTCH_DURATION = 1.83
const PHONE_HANDOFF_DURATION = 0.4
const PHONE_PAUSE_DURATION = PHONE_NOTCH_DURATION - PHONE_HANDOFF_DURATION
const COMMENT_EXIT_DURATION = 0.16
const COMMENT_EXIT_STAGGER = 0.12
const HOLDER_COMMENT_EXIT_AT =
  PHONE_PAUSE_DURATION - COMMENT_EXIT_DURATION - COMMENT_EXIT_STAGGER
const TEAMMATE_COMMENT_EXIT_AT = PHONE_PAUSE_DURATION - COMMENT_EXIT_DURATION

const playerPositionClassNames = [
  `
    top-0
    left-1/2
    -translate-x-1/2
  `,
  `
    top-1/2
    right-0
    -translate-y-1/2
  `,
  `
    bottom-0
    left-1/2
    -translate-x-1/2
  `,
  `
    top-1/2
    left-0
    -translate-y-1/2
  `,
]

const instructionSlides: InstructionSlide[] = [
  {
    id: 'form-teams',
    label: 'Form the teams',
    accessibleCaption:
      'Sit in a circle, alternating Team A and Team B. You start on Team A.',
    caption: (
      <>
        Sit in a circle, alternating{' '}
        <strong className="text-teamATextColor font-bold">Team A</strong>
        &nbsp;and{' '}
        <strong className="text-teamBTextColor font-bold">Team B</strong>. You
        start on Team&nbsp;A.
      </>
    ),
  },
  {
    id: 'pass-phone',
    label: 'Pass the phone',
    accessibleCaption:
      'Get your team to say the exact phrase, then pass the phone to the next team.',
    caption: (
      <>
        Get your team to say the{' '}
        <u className="underline-offset-2">exact phrase</u>, then{' '}
        <strong className="font-bold">pass the phone</strong>&nbsp;to the
        next&nbsp;team.
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

function getPlayerSlotCenters(
  stage: HTMLDivElement,
  playerSlots: (HTMLDivElement | null)[],
) {
  if (
    playerSlots.length !== PLAYER_TEAMS.length ||
    playerSlots.some(playerSlot => !playerSlot)
  ) {
    return null
  }

  const stageWidth = stage.clientWidth
  const stageHeight = stage.clientHeight

  return [
    {
      x: stageWidth / 2,
      y: playerSlots[0]!.offsetHeight / 2,
    },
    {
      x: stageWidth - playerSlots[1]!.offsetWidth / 2,
      y: stageHeight / 2,
    },
    {
      x: stageWidth / 2,
      y: stageHeight - playerSlots[2]!.offsetHeight / 2,
    },
    {
      x: playerSlots[3]!.offsetWidth / 2,
      y: stageHeight / 2,
    },
  ]
}

function getInnerOrbitSlotPoints(
  stage: HTMLDivElement,
  playerSlots: (HTMLDivElement | null)[],
  orbitElement: HTMLElement,
  playerOverlap: number,
) {
  const stageBounds = stage.getBoundingClientRect()
  const elementWidth = Math.max(orbitElement.offsetWidth, 1)
  const elementHeight = Math.max(orbitElement.offsetHeight, 1)

  if (
    playerSlots.length !== PLAYER_TEAMS.length ||
    playerSlots.some(playerSlot => !playerSlot)
  ) {
    return null
  }

  const playerBounds = playerSlots.map(playerSlot =>
    playerSlot!.getBoundingClientRect(),
  )
  const stageCenter = {
    x: stageBounds.width / 2,
    y: stageBounds.height / 2,
  }
  const innerCircleRadius = Math.min(
    stageCenter.y - (playerBounds[0].bottom - stageBounds.top),
    playerBounds[1].left - stageBounds.left - stageCenter.x,
    playerBounds[2].top - stageBounds.top - stageCenter.y,
    stageCenter.x - (playerBounds[3].right - stageBounds.left),
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
  const [stageGeometryVersion, setStageGeometryVersion] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const captionTrackRef = useRef<HTMLDivElement>(null)
  const captionViewportRef = useRef<HTMLDivElement>(null)
  const playerSlotRefs = useRef<(HTMLDivElement | null)[]>([])
  const playerVisualRefs = useRef<(HTMLDivElement | null)[]>([])
  const playerLabelRefs = useRef<(HTMLSpanElement | null)[]>([])
  const commentBubbleSlotRefs = useRef<(HTMLDivElement | null)[]>([])
  const commentBubbleRefs = useRef<(HTMLSpanElement | null)[]>([])
  const commentIconRefs = useRef<(HTMLSpanElement | null)[]>([])
  const commentQuestionIconRefs = useRef<(HTMLSpanElement | null)[]>([])
  const youTagRef = useRef<HTMLSpanElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<HTMLDivElement>(null)
  const timerRingRef = useRef<SVGCircleElement>(null)
  const heartRef = useRef<HTMLDivElement>(null)
  const reducedPenaltyRef = useRef<HTMLSpanElement>(null)
  const particleRefs = useRef<(HTMLSpanElement | null)[]>([])
  const entranceTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const sceneTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const dragStateRef = useRef<DragState | null>(null)
  const openedOnInstructionsRef = useRef(isActive)
  const hasRunEntranceRef = useRef(false)
  const wasActiveRef = useRef(false)

  useEffect(() => {
    const wasActive = wasActiveRef.current
    wasActiveRef.current = isActive

    if (isActive && !wasActive) {
      setActiveSlide(0)
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
      const playerSlots = playerSlotRefs.current
      const playerVisuals = playerVisualRefs.current.filter(
        (player): player is HTMLDivElement => Boolean(player),
      )
      const playerLabels = playerLabelRefs.current.filter(
        (label): label is HTMLSpanElement => Boolean(label),
      )
      const youTag = youTagRef.current

      entranceTimelineRef.current?.kill()
      gsap.set(playerVisuals, { clearProps: 'willChange' })

      if (!(
        isActive &&
        !isLoading &&
        stage &&
        youTag &&
        playerVisuals.length === PLAYER_TEAMS.length &&
        playerLabels.length === PLAYER_TEAMS.length &&
        playerSlots.every(playerSlot => playerSlot)
      )) {
        return
      }

      gsap.killTweensOf([...playerVisuals, ...playerLabels, youTag])

      if (prefersReducedMotion) {
        gsap.set(playerVisuals, {
          autoAlpha: 1,
          clearProps: 'transform',
        })
        playerVisuals.forEach((player, index) => {
          gsap.set(player, {
            backgroundColor: getTeamFillColor(PLAYER_TEAMS[index]),
          })
        })
        gsap.set([...playerLabels, youTag], { autoAlpha: 1 })
        hasRunEntranceRef.current = true
        return
      }

      const playerSlotCenters = getPlayerSlotCenters(stage, playerSlots)

      if (!playerSlotCenters) return

      const stageCenter = {
        x: stage.clientWidth / 2,
        y: stage.clientHeight / 2,
      }
      const entrancePaths: { center: Point; start: Point }[] = []

      playerVisuals.forEach((player, index) => {
        const playerCenter = playerSlotCenters[index]
        const previousPlayerCenter =
          playerSlotCenters[
            (index + PLAYER_TEAMS.length - 1) % PLAYER_TEAMS.length
          ]
        const start = {
          x: previousPlayerCenter.x - playerCenter.x,
          y: previousPlayerCenter.y - playerCenter.y,
        }

        entrancePaths.push({
          center: {
            x: stageCenter.x - playerCenter.x,
            y: stageCenter.y - playerCenter.y,
          },
          start,
        })

        gsap.set(player, {
          autoAlpha: 0,
          backgroundColor: 'var(--color-neutralColor-800)',
          borderColor: 'var(--color-neutralColor-500)',
          willChange: 'transform',
          x: start.x,
          y: start.y,
        })
      })
      gsap.set([...playerLabels, youTag], { autoAlpha: 0 })

      const shouldWaitForLoadingOverlay =
        openedOnInstructionsRef.current && !hasRunEntranceRef.current
      const entranceTimeline = gsap.timeline({
        delay: shouldWaitForLoadingOverlay ? 0.8 : 0.25,
        defaults: {
          ease: 'power3.out',
        },
        onComplete: () => {
          gsap.set(playerVisuals, { clearProps: 'willChange' })
        },
      })

      playerVisuals.forEach((player, index) => {
        entranceTimeline.to(
          player,
          {
            autoAlpha: 1,
            borderColor: 'var(--color-neutralColor-100)',
            duration: 0.8,
            ease: 'power2.inOut',
            motionPath: {
              autoRotate: false,
              path: createClockwiseQuarterPath(
                entrancePaths[index].start,
                { x: 0, y: 0 },
                entrancePaths[index].center,
              ),
            },
          },
          index * 0.12,
        )
      })

      entranceTimeline.addLabel('assignTeams', '>-0.05')

      playerVisuals.forEach((player, index) => {
        entranceTimeline.to(
          player,
          {
            backgroundColor: getTeamFillColor(PLAYER_TEAMS[index]),
            duration: 0.35,
            ease: 'power2.inOut',
          },
          `assignTeams+=${index * 0.08}`,
        )
      })

      entranceTimeline.to(
        [...playerLabels, youTag],
        {
          autoAlpha: 1,
          duration: 0.25,
          stagger: 0.06,
        },
        'assignTeams+=0.12',
      )

      hasRunEntranceRef.current = true
      entranceTimelineRef.current = entranceTimeline
    },
    {
      dependencies: [isActive, isLoading, prefersReducedMotion],
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
      const timer = timerRef.current
      const timerRing = timerRingRef.current
      const heart = heartRef.current
      const reducedPenalty = reducedPenaltyRef.current
      const playerVisuals = playerVisualRefs.current.filter(
        (player): player is HTMLDivElement => Boolean(player),
      )
      const commentBubbleSlots = commentBubbleSlotRefs.current.filter(
        (slot): slot is HTMLDivElement => Boolean(slot),
      )
      const commentBubbles = commentBubbleRefs.current.filter(
        (comment): comment is HTMLSpanElement => Boolean(comment),
      )
      const commentIcons = commentIconRefs.current.filter(
        (comment): comment is HTMLSpanElement => Boolean(comment),
      )
      const commentQuestionIcons = commentQuestionIconRefs.current.filter(
        (comment): comment is HTMLSpanElement => Boolean(comment),
      )
      const particles = particleRefs.current.filter(
        (particle): particle is HTMLSpanElement => Boolean(particle),
      )

      sceneTimelineRef.current?.kill()
      sceneTimelineRef.current = null

      if (!(
        stage &&
        phone &&
        timer &&
        timerRing &&
        heart &&
        reducedPenalty &&
        playerVisuals.length === PLAYER_TEAMS.length &&
        commentBubbleSlots.length === PLAYER_TEAMS.length &&
        commentBubbles.length === PLAYER_TEAMS.length &&
        commentIcons.length === PLAYER_TEAMS.length &&
        commentQuestionIcons.length === PLAYER_TEAMS.length
      )) {
        return
      }

      gsap.killTweensOf([
        phone,
        timer,
        timerRing,
        heart,
        reducedPenalty,
        ...commentBubbles,
        ...commentIcons,
        ...commentQuestionIcons,
        ...particles,
      ])

      if (!isActive) return

      const phonePoints = getInnerOrbitSlotPoints(
        stage,
        playerSlotRefs.current,
        phone,
        PHONE_PLAYER_OVERLAP,
      )
      const commentPoints = getInnerOrbitSlotPoints(
        stage,
        playerSlotRefs.current,
        commentBubbleSlots[0],
        COMMENT_PLAYER_OVERLAP,
      )

      if (!(phonePoints && commentPoints)) return

      gsap.set(timer, { autoAlpha: 0, scale: 0.8 })
      gsap.set(timerRing, { strokeDashoffset: 0 })
      gsap.set(heart, { autoAlpha: 0, rotation: 0, scale: 0.4 })
      gsap.set(reducedPenalty, { autoAlpha: 0, scale: 0.6 })
      commentBubbleSlots.forEach((commentSlot, index) => {
        gsap.set(commentSlot, {
          rotation: PLAYER_ORIENTATIONS[index],
          x: commentPoints[index].x,
          y: commentPoints[index].y,
        })
      })
      gsap.set(commentBubbles, {
        autoAlpha: 0,
        scale: 0.8,
        y: 3,
      })
      gsap.set(commentIcons, { autoAlpha: 1 })
      gsap.set(commentQuestionIcons, { autoAlpha: 0 })
      gsap.set(particles, {
        autoAlpha: 0,
        backgroundColor: 'var(--color-teamBFillColor)',
        scale: 0,
        x: 0,
        y: 0,
      })

      if (activeSlide === 0) {
        gsap.set(phone, { autoAlpha: 0, scale: 0.8 })
        if (
          !entranceTimelineRef.current ||
          entranceTimelineRef.current.progress() === 1
        ) {
          const resetPlayers = gsap.timeline()
          resetPlayers.to(playerVisuals, {
            duration: 0.25,
            ease: 'power1.out',
            opacity: 1,
          })
          sceneTimelineRef.current = resetPlayers
        }
        return
      }

      if (activeSlide === 1) {
        if (prefersReducedMotion) {
          gsap.set(playerVisuals, { opacity: 0.5 })
          gsap.set([playerVisuals[1], playerVisuals[3]], { opacity: 1 })
          gsap.set(phone, {
            autoAlpha: 1,
            rotation: 270,
            scale: 1,
            x: phonePoints[1].x,
            y: phonePoints[1].y,
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
        const orbitLoop = gsap.timeline({ repeat: -1 })

        phoneScene.to(playerVisuals, {
          duration: 0.25,
          ease: 'power1.out',
          opacity: 0.5,
        })

        phoneScene
          .set(phone, {
            autoAlpha: 0,
            rotation: 180,
            scale: 0.75,
            x: phonePoints[0].x,
            y: phonePoints[0].y,
          })
          .to(phone, {
            autoAlpha: 1,
            duration: 0.25,
            ease: 'back.out(1.8)',
            scale: 1,
          })

        phonePoints.forEach((start, index) => {
          const endIndex = (index + 1) % phonePoints.length
          const end = phonePoints[endIndex]
          const teammateIndex =
            (index + PLAYER_TEAMS.length / 2) % PLAYER_TEAMS.length
          const activePlayers = [
            playerVisuals[index],
            playerVisuals[teammateIndex],
          ]
          const holderComment = commentBubbles[index]
          const teammateComment = commentBubbles[teammateIndex]
          const holderCommentIcon = commentIcons[index]
          const holderQuestionIcon = commentQuestionIcons[index]
          const teammateCommentIcon = commentIcons[teammateIndex]
          const teammateQuestionIcon = commentQuestionIcons[teammateIndex]
          const pauseLabel = `pause-${index}`
          const handoffLabel = `handoff-${index}`

          orbitLoop
            .addLabel(pauseLabel)
            .set(
              [holderCommentIcon, teammateQuestionIcon],
              { autoAlpha: 1 },
              pauseLabel,
            )
            .set(
              [holderQuestionIcon, teammateCommentIcon],
              { autoAlpha: 0 },
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
            .to(
              teammateComment,
              {
                autoAlpha: 1,
                duration: 0.18,
                ease: 'power2.out',
                scale: 1,
                y: 0,
              },
              `${pauseLabel}+=0.27`,
            )
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
            .to(
              teammateComment,
              {
                autoAlpha: 0,
                duration: COMMENT_EXIT_DURATION,
                ease: 'power2.in',
                scale: 0.9,
                y: -2,
              },
              `${pauseLabel}+=${TEAMMATE_COMMENT_EXIT_AT}`,
            )
            .addLabel(handoffLabel)
            .to(
              activePlayers,
              {
                duration: 0.15,
                ease: 'power1.out',
                opacity: 0.5,
              },
              handoffLabel,
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
                rotation: 270 + index * 90,
              },
              handoffLabel,
            )
        })

        phoneScene.add(orbitLoop)
        sceneTimelineRef.current = phoneScene
        return
      }

      if (prefersReducedMotion) {
        gsap.set(playerVisuals, { opacity: 1 })
        gsap.set(phone, {
          autoAlpha: 1,
          rotation: 270,
          scale: 1,
          x: phonePoints[1].x,
          y: phonePoints[1].y,
        })
        gsap.set(timer, { autoAlpha: 0.35, scale: 1 })
        gsap.set(timerRing, { strokeDashoffset: 100 })
        gsap.set(heart, { autoAlpha: 1, scale: 1 })
        gsap.set(reducedPenalty, { autoAlpha: 1, scale: 1 })
        return
      }

      const finalScene = gsap.timeline({
        defaults: {
          ease: 'power2.inOut',
        },
      })

      finalScene.to(
        playerVisuals,
        {
          duration: 0.25,
          opacity: 1,
        },
        0,
      )

      finalScene
        .to(
          phone,
          {
            autoAlpha: 1,
            duration: 0.35,
            rotation: 270,
            scale: 1,
            x: phonePoints[1].x,
            y: phonePoints[1].y,
          },
          0,
        )
        .to(
          timer,
          {
            autoAlpha: 1,
            duration: 0.25,
            scale: 1,
          },
          '<0.1',
        )
        .to(timerRing, {
          duration: 1.4,
          ease: 'none',
          strokeDashoffset: 100,
        })
        .to(timer, {
          autoAlpha: 0,
          duration: 0.15,
          scale: 0.75,
        })
        .to(
          heart,
          {
            autoAlpha: 1,
            duration: 0.22,
            ease: 'back.out(2)',
            scale: 1,
          },
          '<',
        )
        .to(heart, {
          duration: 0.16,
          ease: 'power2.out',
          scale: 1.35,
        })
        .to(heart, {
          autoAlpha: 0,
          duration: 0.16,
          ease: 'power4.in',
          rotation: -12,
          scale: 0,
        })

      particles.forEach((particle, index) => {
        const angle = (PARTICLE_ANGLES[index] * Math.PI) / 180
        const distance = stage.clientWidth * (0.13 + (index % 3) * 0.025)

        finalScene.fromTo(
          particle,
          {
            autoAlpha: 1,
            scale: 0.6,
            x: 0,
            y: 0,
          },
          {
            autoAlpha: 0,
            duration: 0.55,
            ease: 'power3.out',
            scale: 0,
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
          },
          '<',
        )
      })

      sceneTimelineRef.current = finalScene
    },
    {
      dependencies: [
        activeSlide,
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

    setActiveSlide(clampedSlide)
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

    if (!(
      dragState &&
      captionTrack &&
      dragState.pointerId === event.pointerId
    )) {
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
        pb-2
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
          flex
          min-h-0
          flex-1
          items-center
          justify-center
        "
      >
        <div
          ref={stageRef}
          className="
            relative
            size-[min(76vw,48dvh,11rem)]
            shrink-0
          "
        >
          {PLAYER_TEAMS.map((team, index) => (
            <div
              ref={element => {
                playerSlotRefs.current[index] = element
              }}
              className={`
                absolute
                size-[clamp(2rem,19vw,2.75rem)]
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
                  ${
                    team === 'A'
                      ? 'bg-teamAFillColor text-textOnTeamAColor'
                      : 'bg-teamBFillColor text-textOnTeamBColor'
                  }
                `}
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

                {index === 0 && (
                  <span
                    ref={youTagRef}
                    className="
                      bg-neutralColor-100
                      text-neutralColor-950
                      border-neutralColor-100
                      absolute
                      top-[-0.35rem]
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
            </div>
          ))}

          {PLAYER_TEAMS.map((team, index) => (
            <div
              ref={element => {
                commentBubbleSlotRefs.current[index] = element
              }}
              className="
                pointer-events-none
                absolute
                top-0
                left-0
                z-10
                flex
                size-8
                items-center
                justify-center
                will-change-transform
              "
              key={`comment-${team}-${index}`}
            >
              <div
                className="
                  relative
                  flex
                  size-full
                  translate-x-3
                  -translate-y-3
                "
              >
                <span
                  ref={element => {
                    commentBubbleRefs.current[index] = element
                  }}
                  className={`
                    relative
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
                  <span
                    ref={element => {
                      commentIconRefs.current[index] = element
                    }}
                    className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Icon name="solid:comment" />
                  </span>
                  <span
                    ref={element => {
                      commentQuestionIconRefs.current[index] = element
                    }}
                    className="
                      absolute
                      inset-0
                      flex
                      translate-y-3
                      items-center
                      justify-center
                      opacity-0
                    "
                  >
                    <span
                      className="
                        bg-neutralColor-100
                        absolute
                        top-[43%]
                        left-1/2
                        z-0
                        h-[0.75em]
                        w-[0.48em]
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-[50%]
                      "
                    />
                    <Icon
                      className="
                        relative
                        z-10
                      "
                      name="solid:comment-question"
                    />
                  </span>
                </span>
              </div>
            </div>
          ))}

          <div
            ref={phoneRef}
            className="
              absolute
              top-0
              left-0
              z-20
              flex
              size-[1.25rem]
              items-center
              justify-center
              text-[1.25rem]
              leading-none
              opacity-0
              will-change-transform
            "
          >
            📱
          </div>

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
                size-[2.6rem]
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
                className="stroke-teamBTextColor"
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
            ref={heartRef}
            className="
              text-teamBTextColor
              absolute
              inset-0
              z-10
              flex
              items-center
              justify-center
              text-[2.1rem]
              opacity-0
            "
          >
            <Icon name="solid:heart" />
            <span
              ref={reducedPenaltyRef}
              className="
                text-textOnTeamBColor
                absolute
                text-xs
                leading-none
                opacity-0
              "
            >
              −1
            </span>
          </div>

          <div
            className="
              pointer-events-none
              absolute
              top-1/2
              left-1/2
              z-20
            "
          >
            {PARTICLE_ANGLES.map((angle, index) => (
              <span
                ref={element => {
                  particleRefs.current[index] = element
                }}
                className="
                  bg-teamBFillColor
                  absolute
                  size-[0.28rem]
                  rounded-full
                  opacity-0
                "
                key={angle}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="shrink-0">
        <div
          ref={captionViewportRef}
          className="
            h-[4.5rem]
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
                <span>{slide.caption}</span>
              </p>
            ))}
          </div>
        </div>

        <div
          aria-label="Instruction slides"
          className="
            flex
            h-1.5
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
                onClick={() => goToSlide(index)}
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
                        ? 'bg-primaryColor-500 scale-110'
                        : 'bg-transparent opacity-55'
                    }
                  `}
                />
              </button>
            )
          })}
        </div>
      </div>

      <p
        aria-live="polite"
        className="sr-only"
      >
        {`Instruction ${activeSlide + 1} of ${instructionSlides.length}. ${instructionSlides[activeSlide].accessibleCaption}`}
      </p>
    </div>
  )
}
