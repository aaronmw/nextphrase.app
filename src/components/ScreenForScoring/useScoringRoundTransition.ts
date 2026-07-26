'use client'

import { useAppContext } from '@/components/AppContext'
import { RoundTransitionPhase } from '@/components/RoundTransitionContext'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { RefObject, useEffect, useRef } from 'react'

interface UseScoringRoundTransitionProps {
  applyPendingRoundEndDamage: () => void
  finishScoringEnter: () => void
  finishScoringExit: () => void
  finishScoringGameOverExit: () => void
  finishScoringGameOverReset: () => void
  finishScoringGameOverResetEnter: () => void
  finishScoringGameOverReveal: () => void
  finishScoringImpact: () => void
  gameOverTransitionTeam: 'A' | 'B' | null
  pendingRoundEndIsFinalHit: boolean
  pendingRoundEndTeam: 'A' | 'B' | null
  roundTransitionPhase: RoundTransitionPhase
  scoreBackRef: RefObject<HTMLDivElement | null>
  scoreFlashRef: RefObject<HTMLDivElement | null>
  scoreHeartsARef: RefObject<HTMLDivElement | null>
  scoreHeartsBRef: RefObject<HTMLDivElement | null>
  scoreStartRef: RefObject<HTMLDivElement | null>
  scoreTeamARef: RefObject<HTMLDivElement | null>
  scoreTeamBRef: RefObject<HTMLDivElement | null>
  scoreWinnerLabelRef: RefObject<HTMLDivElement | null>
  scoreWinnerNewGameRef: RefObject<HTMLDivElement | null>
}

type ExitDirection = 'left' | 'right' | 'up' | 'down' | 'upLeft' | 'upRight'

const EDGE_EXIT_BUFFER_PX = 24
const SCORE_TRANSITION_DURATION = 0.45
const IMPACT_SHAKE_DURATION = 0.9
const FLASH_EXPAND_DURATION = 0.16
const FLASH_HOLD_DURATION = 0.06
const FLASH_DOWN_DURATION = 0.65
const WINNER_CARD_SCALE = 2
const WINNER_CARD_REVEAL_DURATION = 0.65
const WINNER_COPY_DURATION = 0.28

function getExitTransform(element: HTMLElement, direction: ExitDirection) {
  const rect = element.getBoundingClientRect()
  const left = -rect.right - EDGE_EXIT_BUFFER_PX
  const right = window.innerWidth - rect.left + EDGE_EXIT_BUFFER_PX
  const up = -rect.bottom - EDGE_EXIT_BUFFER_PX
  const down = window.innerHeight - rect.top + EDGE_EXIT_BUFFER_PX

  switch (direction) {
    case 'left':
      return { x: left, y: 0 }
    case 'right':
      return { x: right, y: 0 }
    case 'up':
      return { x: 0, y: up }
    case 'down':
      return { x: 0, y: down }
    case 'upLeft':
      return { x: left, y: up }
    case 'upRight':
      return { x: right, y: up }
  }
}

function getCenterTransform(element: HTMLElement) {
  const rect = element.getBoundingClientRect()

  return {
    x: window.innerWidth / 2 - (rect.left + rect.width / 2),
    y: window.innerHeight / 2 - (rect.top + rect.height / 2),
  }
}

function getCircleFlashGeometry(originElement: HTMLElement) {
  const rect = originElement.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const radius = Math.ceil(
    Math.max(
      Math.hypot(centerX, centerY),
      Math.hypot(window.innerWidth - centerX, centerY),
      Math.hypot(centerX, window.innerHeight - centerY),
      Math.hypot(window.innerWidth - centerX, window.innerHeight - centerY),
    ),
  )
  const diameter = radius * 2

  return {
    diameter,
    x: centerX - radius,
    y: centerY - radius,
  }
}

function getWinnerCopyPositions({
  labelElement,
  newGameElement,
  winningTeamElement,
}: {
  labelElement: HTMLElement
  newGameElement: HTMLElement
  winningTeamElement: HTMLElement
}) {
  const winningTeamRect = winningTeamElement.getBoundingClientRect()
  const labelRect = labelElement.getBoundingClientRect()
  const newGameRect = newGameElement.getBoundingClientRect()
  const gap = gsap.utils.clamp(18, 32, window.innerHeight * 0.035)
  const cardHalfHeight = (winningTeamRect.height * WINNER_CARD_SCALE) / 2
  const viewportCenterX = window.innerWidth / 2
  const viewportCenterY = window.innerHeight / 2

  return {
    label: {
      x: viewportCenterX - labelRect.width / 2,
      y: viewportCenterY - cardHalfHeight - gap - labelRect.height,
    },
    newGame: {
      x: viewportCenterX - newGameRect.width / 2,
      y: viewportCenterY + cardHalfHeight + gap,
    },
  }
}

export function useScoringRoundTransition({
  applyPendingRoundEndDamage,
  finishScoringEnter,
  finishScoringExit,
  finishScoringGameOverExit,
  finishScoringGameOverReset,
  finishScoringGameOverResetEnter,
  finishScoringGameOverReveal,
  finishScoringImpact,
  gameOverTransitionTeam,
  pendingRoundEndIsFinalHit,
  pendingRoundEndTeam,
  roundTransitionPhase,
  scoreBackRef,
  scoreFlashRef,
  scoreHeartsARef,
  scoreHeartsBRef,
  scoreStartRef,
  scoreTeamARef,
  scoreTeamBRef,
  scoreWinnerLabelRef,
  scoreWinnerNewGameRef,
}: UseScoringRoundTransitionProps) {
  const impactTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const gameOverRevealTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const gameOverResetTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const { sounds } = useAppContext()
  const playSoundRef = useRef(sounds.playSound)

  useEffect(() => {
    playSoundRef.current = sounds.playSound
  }, [sounds.playSound])

  useGSAP(
    () => {
      const scoreBack = scoreBackRef.current
      const scoreFlash = scoreFlashRef.current
      const scoreHeartsA = scoreHeartsARef.current
      const scoreHeartsB = scoreHeartsBRef.current
      const scoreStart = scoreStartRef.current
      const scoreTeamA = scoreTeamARef.current
      const scoreTeamB = scoreTeamBRef.current
      const scoreWinnerLabel = scoreWinnerLabelRef.current
      const scoreWinnerNewGame = scoreWinnerNewGameRef.current

      if (
        !(
          scoreBack &&
          scoreFlash &&
          scoreHeartsA &&
          scoreHeartsB &&
          scoreStart &&
          scoreTeamA &&
          scoreTeamB
        )
      ) {
        return
      }

      const scoreElements = [
        scoreBack,
        scoreHeartsA,
        scoreHeartsB,
        scoreStart,
        scoreTeamA,
        scoreTeamB,
      ]
      const winnerCopyElements = [scoreWinnerLabel, scoreWinnerNewGame].filter(
        Boolean,
      ) as HTMLDivElement[]
      const animatedElements = [
        ...scoreElements,
        scoreFlash,
        ...winnerCopyElements,
      ]

      if (
        roundTransitionPhase === 'scoringImpact' &&
        impactTimelineRef.current
      ) {
        return
      }

      if (
        roundTransitionPhase === 'scoringGameOverReveal' &&
        gameOverRevealTimelineRef.current
      ) {
        return
      }

      if (
        (roundTransitionPhase === 'scoringGameOverReset' ||
          roundTransitionPhase === 'scoringGameOverResetEnter') &&
        gameOverResetTimelineRef.current
      ) {
        return
      }

      if (roundTransitionPhase !== 'scoringImpact') {
        impactTimelineRef.current?.kill()
        impactTimelineRef.current = null
      }

      if (roundTransitionPhase !== 'scoringGameOverReveal') {
        gameOverRevealTimelineRef.current?.kill()
        gameOverRevealTimelineRef.current = null
      }

      if (
        roundTransitionPhase !== 'scoringGameOverReset' &&
        roundTransitionPhase !== 'scoringGameOverResetEnter'
      ) {
        gameOverResetTimelineRef.current?.kill()
        gameOverResetTimelineRef.current = null
      }

      gsap.killTweensOf(animatedElements)

      if (
        roundTransitionPhase === 'scoringExit' ||
        roundTransitionPhase === 'scoringEnter' ||
        roundTransitionPhase === 'scoringImpact' ||
        roundTransitionPhase === 'scoringHeartLoss' ||
        roundTransitionPhase === 'scoringGameOverExit' ||
        roundTransitionPhase === 'scoringGameOverResetEnter'
      ) {
        gsap.set(scoreElements, { scale: 1, x: 0, y: 0 })
        gsap.set([scoreTeamA, scoreTeamB], { animation: 'none' })
      }

      const scoreExitTransforms = {
        back: getExitTransform(scoreBack, 'up'),
        heartsA: getExitTransform(scoreHeartsA, 'upLeft'),
        heartsB: getExitTransform(scoreHeartsB, 'upRight'),
        start: getExitTransform(scoreStart, 'down'),
        teamA: getExitTransform(scoreTeamA, 'left'),
        teamB: getExitTransform(scoreTeamB, 'right'),
      }

      if (roundTransitionPhase === 'scoringExit') {
        gsap.set(scoreElements, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          willChange: 'transform',
        })
        gsap
          .timeline({
            defaults: {
              duration: SCORE_TRANSITION_DURATION,
              ease: 'power2.in',
              overwrite: true,
            },
            onComplete: finishScoringExit,
          })
          .addLabel('exit', 0)
          .to(scoreStart, scoreExitTransforms.start, 'exit')
          .to(scoreTeamA, scoreExitTransforms.teamA, 'exit')
          .to(scoreTeamB, scoreExitTransforms.teamB, 'exit')
          .to(scoreHeartsA, scoreExitTransforms.heartsA, 'exit')
          .to(scoreHeartsB, scoreExitTransforms.heartsB, 'exit')
          .to(scoreBack, scoreExitTransforms.back, 'exit')
        return
      }

      if (roundTransitionPhase === 'scoringEnter') {
        gsap.set(winnerCopyElements, { autoAlpha: 0 })
        gsap.set(scoreElements, {
          pointerEvents: 'auto',
          scale: 1,
          zIndex: 'auto',
        })
        gsap.set(scoreStart, { autoAlpha: 1, ...scoreExitTransforms.start })
        gsap.set(scoreTeamA, { autoAlpha: 1, ...scoreExitTransforms.teamA })
        gsap.set(scoreTeamB, { autoAlpha: 1, ...scoreExitTransforms.teamB })
        gsap.set(scoreHeartsA, {
          autoAlpha: 1,
          ...scoreExitTransforms.heartsA,
        })
        gsap.set(scoreHeartsB, {
          autoAlpha: 1,
          ...scoreExitTransforms.heartsB,
        })
        gsap.set(scoreBack, { autoAlpha: 1, ...scoreExitTransforms.back })
        gsap.set(scoreElements, { willChange: 'transform' })
        gsap.to(scoreElements, {
          autoAlpha: 1,
          duration: SCORE_TRANSITION_DURATION,
          ease: 'power2.out',
          overwrite: true,
          x: 0,
          y: 0,
          onComplete: () => {
            gsap.set(scoreElements, {
              clearProps:
                'transform,opacity,visibility,willChange,animation,zIndex,pointerEvents',
            })
            gsap.set(winnerCopyElements, {
              clearProps:
                'transform,opacity,visibility,willChange,pointerEvents',
            })
            finishScoringEnter()
          },
        })
        return
      }

      if (roundTransitionPhase === 'scoringImpact') {
        if (!pendingRoundEndTeam) {
          finishScoringImpact()
          return
        }

        const losingTeamElement =
          pendingRoundEndTeam === 'A' ? scoreTeamA : scoreTeamB
        const shakeState = { progress: 0 }
        const setX = gsap.quickSetter(losingTeamElement, 'x', 'px')
        const setY = gsap.quickSetter(losingTeamElement, 'y', 'px')
        const setRotation = gsap.quickSetter(
          losingTeamElement,
          'rotation',
          'deg',
        )
        const setScale = gsap.quickSetter(losingTeamElement, 'scale')

        gsap.set(scoreElements, {
          autoAlpha: 1,
          x: 0,
          y: 0,
        })
        gsap.set(scoreFlash, {
          autoAlpha: 0,
          pointerEvents: 'none',
          scale: 0,
        })
        gsap.set(losingTeamElement, {
          transformOrigin: 'center',
          willChange: 'transform',
        })

        const impactTimeline = gsap.timeline({
          onComplete: () => {
            impactTimelineRef.current = null
            gsap.set(losingTeamElement, {
              clearProps: 'transform,willChange,animation',
            })
            gsap.set(scoreFlash, {
              autoAlpha: 0,
              clearProps:
                'borderRadius,height,left,opacity,scale,top,transform,visibility,width,willChange',
            })
            finishScoringImpact()
          },
        })

        impactTimelineRef.current = impactTimeline

        impactTimeline
          .to(shakeState, {
            duration: IMPACT_SHAKE_DURATION,
            ease: 'power2.in',
            progress: 1,
            onUpdate: () => {
              const radius = gsap.utils.interpolate(1, 18, shakeState.progress)
              const angle = shakeState.progress * Math.PI * 30

              setX(Math.cos(angle) * radius)
              setY(Math.sin(angle * 1.31) * radius * 0.8)
              setRotation(Math.sin(angle * 0.73) * radius * 0.2)
              setScale(1 + shakeState.progress * 0.025)
            },
          })
          .set(losingTeamElement, { rotation: 0, scale: 1, x: 0, y: 0 })
          .call(() => {
            playSoundRef.current('glass-explosion')

            const { diameter, x, y } = getCircleFlashGeometry(losingTeamElement)

            gsap.set(scoreFlash, {
              autoAlpha: 1,
              borderRadius: '50%',
              height: diameter,
              left: 0,
              pointerEvents: 'none',
              scale: 0,
              top: 0,
              transformOrigin: 'center',
              width: diameter,
              willChange: 'transform, opacity',
              x,
              y,
            })
          })
          .to(scoreFlash, {
            autoAlpha: 1,
            duration: FLASH_EXPAND_DURATION,
            ease: 'power2.out',
            scale: 1,
          })
          .call(() => {
            applyPendingRoundEndDamage()

            if (pendingRoundEndIsFinalHit) {
              gsap.set(losingTeamElement, {
                autoAlpha: 0,
              })
            }
          })
          .to(scoreFlash, {
            autoAlpha: 1,
            duration: FLASH_HOLD_DURATION,
          })
          .to(scoreFlash, {
            autoAlpha: 0,
            duration: FLASH_DOWN_DURATION,
            ease: 'power2.out',
          })
        return
      }

      if (roundTransitionPhase === 'scoringHeartLoss') {
        const finalHitLosingTeamElement =
          pendingRoundEndIsFinalHit && pendingRoundEndTeam
            ? pendingRoundEndTeam === 'A'
              ? scoreTeamA
              : scoreTeamB
            : null

        gsap.set(scoreElements, {
          autoAlpha: 1,
          x: 0,
          y: 0,
        })
        if (finalHitLosingTeamElement) {
          gsap.set(finalHitLosingTeamElement, {
            autoAlpha: 0,
          })
        }
        gsap.set(scoreFlash, {
          autoAlpha: 0,
          pointerEvents: 'none',
          scale: 1,
        })
        return
      }

      if (roundTransitionPhase === 'scoringGameOverExit') {
        if (
          !(gameOverTransitionTeam && scoreWinnerLabel && scoreWinnerNewGame)
        ) {
          finishScoringGameOverExit()
          return
        }

        const winningTeamElement =
          gameOverTransitionTeam === 'A' ? scoreTeamA : scoreTeamB
        const losingTeamElement =
          gameOverTransitionTeam === 'A' ? scoreTeamB : scoreTeamA

        gsap.set(winningTeamElement, {
          autoAlpha: 1,
          pointerEvents: 'none',
          scale: 1,
          x: 0,
          y: 0,
          zIndex: 60,
        })
        gsap.set(losingTeamElement, {
          autoAlpha: 0,
          pointerEvents: 'none',
        })
        gsap.set([scoreBack, scoreHeartsA, scoreHeartsB, scoreStart], {
          autoAlpha: 1,
          scale: 1,
          x: 0,
          y: 0,
          willChange: 'transform, opacity',
        })
        gsap.set(winnerCopyElements, {
          autoAlpha: 0,
          pointerEvents: 'none',
        })

        gsap
          .timeline({
            defaults: {
              duration: SCORE_TRANSITION_DURATION,
              ease: 'power2.in',
              overwrite: true,
            },
            onComplete: () => {
              gsap.set([scoreBack, scoreHeartsA, scoreHeartsB, scoreStart], {
                clearProps: 'willChange',
              })
              finishScoringGameOverExit()
            },
          })
          .addLabel('gameOverExit', 0)
          .to(scoreStart, scoreExitTransforms.start, 'gameOverExit')
          .to(scoreHeartsA, scoreExitTransforms.heartsA, 'gameOverExit')
          .to(scoreHeartsB, scoreExitTransforms.heartsB, 'gameOverExit')
          .to(scoreBack, scoreExitTransforms.back, 'gameOverExit')
        return
      }

      if (roundTransitionPhase === 'scoringGameOverReveal') {
        if (
          !(gameOverTransitionTeam && scoreWinnerLabel && scoreWinnerNewGame)
        ) {
          finishScoringGameOverReveal()
          return
        }

        const winningTeamElement =
          gameOverTransitionTeam === 'A' ? scoreTeamA : scoreTeamB
        const losingTeamElement =
          gameOverTransitionTeam === 'A' ? scoreTeamB : scoreTeamA
        const winnerTransform = getCenterTransform(winningTeamElement)
        const winnerCopyPositions = getWinnerCopyPositions({
          labelElement: scoreWinnerLabel,
          newGameElement: scoreWinnerNewGame,
          winningTeamElement,
        })

        gsap.set(losingTeamElement, {
          autoAlpha: 0,
          pointerEvents: 'none',
        })
        gsap.set([scoreBack, scoreHeartsA, scoreHeartsB, scoreStart], {
          autoAlpha: 0,
          pointerEvents: 'none',
        })
        gsap.set(winningTeamElement, {
          autoAlpha: 1,
          pointerEvents: 'none',
          transformOrigin: 'center',
          willChange: 'transform',
          zIndex: 60,
        })
        gsap.set(scoreWinnerLabel, {
          ...winnerCopyPositions.label,
          autoAlpha: 0,
          y: winnerCopyPositions.label.y - 24,
        })
        gsap.set(scoreWinnerNewGame, {
          ...winnerCopyPositions.newGame,
          autoAlpha: 0,
          y: winnerCopyPositions.newGame.y + 24,
        })

        const gameOverRevealTimeline = gsap.timeline({
          onComplete: () => {
            gameOverRevealTimelineRef.current = null
            gsap.set(winningTeamElement, { clearProps: 'willChange' })
            finishScoringGameOverReveal()
          },
        })

        gameOverRevealTimelineRef.current = gameOverRevealTimeline

        gameOverRevealTimeline
          .to(winningTeamElement, {
            ...winnerTransform,
            duration: WINNER_CARD_REVEAL_DURATION,
            ease: 'power3.inOut',
            scale: WINNER_CARD_SCALE,
          })
          .to(
            scoreWinnerLabel,
            {
              autoAlpha: 1,
              duration: WINNER_COPY_DURATION,
              ease: 'power2.out',
              y: winnerCopyPositions.label.y,
            },
            '>-0.06',
          )
          .to(
            scoreWinnerNewGame,
            {
              autoAlpha: 1,
              duration: WINNER_COPY_DURATION,
              ease: 'power2.out',
              y: winnerCopyPositions.newGame.y,
            },
            '<0.08',
          )
        return
      }

      if (roundTransitionPhase === 'scoringGameOver') {
        if (
          !(gameOverTransitionTeam && scoreWinnerLabel && scoreWinnerNewGame)
        ) {
          return
        }

        const winningTeamElement =
          gameOverTransitionTeam === 'A' ? scoreTeamA : scoreTeamB
        const losingTeamElement =
          gameOverTransitionTeam === 'A' ? scoreTeamB : scoreTeamA
        gsap.set(winningTeamElement, {
          scale: 1,
          x: 0,
          y: 0,
        })
        const winnerTransform = getCenterTransform(winningTeamElement)
        const winnerCopyPositions = getWinnerCopyPositions({
          labelElement: scoreWinnerLabel,
          newGameElement: scoreWinnerNewGame,
          winningTeamElement,
        })

        gsap.set(losingTeamElement, {
          autoAlpha: 0,
          pointerEvents: 'none',
        })
        gsap.set([scoreBack, scoreHeartsA, scoreHeartsB, scoreStart], {
          autoAlpha: 0,
          pointerEvents: 'none',
        })
        gsap.set(winningTeamElement, {
          ...winnerTransform,
          autoAlpha: 1,
          pointerEvents: 'none',
          scale: WINNER_CARD_SCALE,
          transformOrigin: 'center',
          zIndex: 60,
        })
        gsap.set(scoreWinnerLabel, {
          ...winnerCopyPositions.label,
          autoAlpha: 1,
        })
        gsap.set(scoreWinnerNewGame, {
          ...winnerCopyPositions.newGame,
          autoAlpha: 1,
          pointerEvents: 'auto',
        })
        return
      }

      if (roundTransitionPhase === 'scoringGameOverReset') {
        if (
          !(gameOverTransitionTeam && scoreWinnerLabel && scoreWinnerNewGame)
        ) {
          finishScoringGameOverReset()
          return
        }

        const winningTeamElement =
          gameOverTransitionTeam === 'A' ? scoreTeamA : scoreTeamB

        gsap.set(scoreWinnerNewGame, { pointerEvents: 'none' })
        gsap.set(winningTeamElement, {
          autoAlpha: 1,
          pointerEvents: 'none',
          transformOrigin: 'center',
          willChange: 'transform',
          zIndex: 60,
        })

        const gameOverResetTimeline = gsap.timeline({
          onComplete: () => {
            gameOverResetTimelineRef.current = null
            gsap.set(winningTeamElement, { clearProps: 'willChange' })
            finishScoringGameOverReset()
          },
        })

        gameOverResetTimelineRef.current = gameOverResetTimeline

        gameOverResetTimeline
          .to(
            scoreWinnerLabel,
            {
              autoAlpha: 0,
              duration: WINNER_COPY_DURATION,
              ease: 'power2.in',
              y: '-=24',
            },
            0,
          )
          .to(
            scoreWinnerNewGame,
            {
              autoAlpha: 0,
              duration: WINNER_COPY_DURATION,
              ease: 'power2.in',
              y: '+=24',
            },
            0,
          )
          .to(
            winningTeamElement,
            {
              duration: WINNER_CARD_REVEAL_DURATION,
              ease: 'power3.inOut',
              scale: 1,
              x: 0,
              y: 0,
            },
            0,
          )
        return
      }

      if (roundTransitionPhase === 'scoringGameOverResetEnter') {
        if (!gameOverTransitionTeam) {
          finishScoringGameOverResetEnter()
          return
        }

        const winningTeamElement =
          gameOverTransitionTeam === 'A' ? scoreTeamA : scoreTeamB
        const losingTeamElement =
          gameOverTransitionTeam === 'A' ? scoreTeamB : scoreTeamA
        const losingTeamTransform =
          gameOverTransitionTeam === 'A'
            ? scoreExitTransforms.teamB
            : scoreExitTransforms.teamA
        const enteringElements = [
          scoreBack,
          scoreHeartsA,
          scoreHeartsB,
          scoreStart,
          losingTeamElement,
        ]

        gsap.set(winnerCopyElements, {
          autoAlpha: 0,
          pointerEvents: 'none',
        })
        gsap.set(winningTeamElement, {
          autoAlpha: 1,
          pointerEvents: 'none',
          scale: 1,
          x: 0,
          y: 0,
          zIndex: 60,
        })
        gsap.set(losingTeamElement, {
          autoAlpha: 1,
          ...losingTeamTransform,
        })
        gsap.set(scoreStart, { autoAlpha: 1, ...scoreExitTransforms.start })
        gsap.set(scoreHeartsA, {
          autoAlpha: 1,
          ...scoreExitTransforms.heartsA,
        })
        gsap.set(scoreHeartsB, {
          autoAlpha: 1,
          ...scoreExitTransforms.heartsB,
        })
        gsap.set(scoreBack, { autoAlpha: 1, ...scoreExitTransforms.back })
        gsap.set([...enteringElements, winningTeamElement], {
          willChange: 'transform, opacity',
        })

        const gameOverResetTimeline = gsap.timeline({
          defaults: {
            duration: SCORE_TRANSITION_DURATION,
            ease: 'power2.out',
            overwrite: true,
          },
          onComplete: () => {
            gameOverResetTimelineRef.current = null
            gsap.set(scoreElements, {
              clearProps:
                'transform,opacity,visibility,willChange,animation,zIndex,pointerEvents',
            })
            gsap.set(winnerCopyElements, {
              clearProps:
                'transform,opacity,visibility,willChange,pointerEvents',
            })
            finishScoringGameOverResetEnter()
          },
        })

        gameOverResetTimelineRef.current = gameOverResetTimeline

        gameOverResetTimeline.to(enteringElements, {
          autoAlpha: 1,
          x: 0,
          y: 0,
        })
        return
      }

      if (roundTransitionPhase === 'idle') {
        gsap.set(scoreElements, {
          clearProps:
            'transform,opacity,visibility,willChange,animation,zIndex,pointerEvents',
        })
        gsap.set(winnerCopyElements, {
          clearProps: 'transform,opacity,visibility,willChange,pointerEvents',
        })
      }
    },
    {
      dependencies: [
        applyPendingRoundEndDamage,
        finishScoringEnter,
        finishScoringExit,
        finishScoringGameOverExit,
        finishScoringGameOverReset,
        finishScoringGameOverResetEnter,
        finishScoringGameOverReveal,
        finishScoringImpact,
        gameOverTransitionTeam,
        pendingRoundEndIsFinalHit,
        pendingRoundEndTeam,
        roundTransitionPhase,
      ],
    },
  )
}
