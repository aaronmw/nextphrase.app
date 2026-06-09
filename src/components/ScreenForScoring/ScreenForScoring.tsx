'use client'

import { AppScreen, HEARTS_PER_TEAM } from '@/app/reducer'
import { teamAColor, teamBColor } from '@/app/theme'
import { useAppContext } from '@/components/AppContext'
import { AppHeader } from '@/components/AppHeader'
import { Confetti } from '@/components/Confetti'
import { Icon } from '@/components/Icon'
import { PointDots } from '@/components/PointDots'
import { ScreenContainer } from '@/components/ScreenContainer'
import { StyledText } from '@/components/StyledText'
import { usePrevious } from '@/lib/usePrevious'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { twMerge } from 'tailwind-merge'
import { useIsClient } from 'usehooks-ts'
import { classNames } from './classNames'
import { DistressMarks } from './DistressMarks'

function heartsForDistressMarks(
  team: 'A' | 'B',
  state: {
    heartsRemainingForTeamA: number
    heartsRemainingForTeamB: number
  },
) {
  return team === 'A'
    ? state.heartsRemainingForTeamA
    : state.heartsRemainingForTeamB
}

const GAME_OVER_PORTAL_Z = 200
const GAME_OVER_CHROME_Z = GAME_OVER_PORTAL_Z + 5
const GAME_OVER_HERO_Z = GAME_OVER_PORTAL_Z + 20
const GAME_OVER_CONFETTI_Z = GAME_OVER_PORTAL_Z + 35
const HERO_CELEBRATION_DURATION = 1.15
const HERO_SPIN_ROTATION_Y = 720
const HERO_TRANSFORM_PERSPECTIVE = 1100

type CelebrationGeo = {
  startCx: number
  startCy: number
  slotCx: number
  slotCy: number
  maxScale: number
  width: number
  height: number
  session: number
}

export function ScreenForScoring() {
  const { dispatch, state } = useAppContext()
  const isClient = useIsClient()
  const {
    activeScreen,
    activeTeamInRound,
    heartsRemainingForTeamA,
    heartsRemainingForTeamB,
    gameOverSequence,
    gameOverWinnerTeam,
  } = state
  const timerRef = useRef<NodeJS.Timeout>(null)
  const touchStartedAtRef = useRef<number | null>(null)

  const headerChromeRef = useRef<HTMLDivElement>(null)
  const teamCellARef = useRef<HTMLDivElement>(null)
  const teamCellBRef = useRef<HTMLDivElement>(null)
  const startBlockRef = useRef<HTMLDivElement>(null)
  const winnerTitleRef = useRef<HTMLDivElement>(null)
  const newGameWrapRef = useRef<HTMLDivElement>(null)
  const heroPortalRef = useRef<HTMLDivElement>(null)
  const heroMiddleSlotRef = useRef<HTMLDivElement>(null)
  const animationSessionRef = useRef(0)
  const celebrationGeoRef = useRef<CelebrationGeo | null>(null)
  const exitTimelineRef = useRef<ReturnType<typeof gsap.timeline> | null>(null)

  const [confettiTrigger, setConfettiTrigger] = useState(false)
  const [isNewGameExiting, setIsNewGameExiting] = useState(false)

  const winnerTeam: 'A' | 'B' | null =
    gameOverSequence !== 'idle' && gameOverWinnerTeam
      ? gameOverWinnerTeam
      : null
  const loserTeam: 'A' | 'B' | null =
    winnerTeam === 'A' ? 'B' : winnerTeam === 'B' ? 'A' : null

  const confettiColors =
    winnerTeam === 'A' ? Object.values(teamAColor) : Object.values(teamBColor)

  const prevHeartsA = usePrevious(heartsRemainingForTeamA)
  const prevHeartsB = usePrevious(heartsRemainingForTeamB)
  const didChangeA =
    prevHeartsA != null && heartsRemainingForTeamA !== prevHeartsA
  const didChangeB =
    prevHeartsB != null && heartsRemainingForTeamB !== prevHeartsB

  const [shakingA, setShakingA] = useState(false)
  const [shakingB, setShakingB] = useState(false)
  const SHAKE_MS = 1000

  const showGameOverPortal =
    isClient &&
    (gameOverSequence === 'playing' || gameOverSequence === 'complete') &&
    winnerTeam

  useEffect(() => {
    if (gameOverSequence !== 'idle') return
    const resetId = setTimeout(() => {
      setConfettiTrigger(false)
      setIsNewGameExiting(false)
    }, 0)
    celebrationGeoRef.current = null
    if (activeScreen !== AppScreen.Scoring) {
      return () => clearTimeout(resetId)
    }

    const toReset = [
      teamCellARef.current,
      teamCellBRef.current,
      headerChromeRef.current,
      startBlockRef.current,
    ]
    for (const el of toReset) {
      if (!el) continue
      gsap.set(el, {
        clearProps:
          'position,top,left,width,height,zIndex,margin,opacity,scale,xPercent,yPercent,transform,visibility',
      })
    }
    return () => clearTimeout(resetId)
  }, [gameOverSequence, activeScreen])

  useEffect(() => {
    return () => {
      exitTimelineRef.current?.kill()
      exitTimelineRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!didChangeA) return
    setShakingA(false)
    let removeId: ReturnType<typeof setTimeout> | null = null
    const addBackId = setTimeout(() => {
      setShakingA(true)
      removeId = setTimeout(() => {
        setShakingA(false)
      }, SHAKE_MS)
    }, 0)
    return () => {
      clearTimeout(addBackId)
      if (removeId) {
        clearTimeout(removeId)
      }
    }
  }, [didChangeA])

  useEffect(() => {
    if (!didChangeB) return
    setShakingB(false)
    let removeId: ReturnType<typeof setTimeout> | null = null
    const addBackId = setTimeout(() => {
      setShakingB(true)
      removeId = setTimeout(() => {
        setShakingB(false)
      }, SHAKE_MS)
    }, 0)
    return () => {
      clearTimeout(addBackId)
      if (removeId) {
        clearTimeout(removeId)
      }
    }
  }, [didChangeB])

  useGSAP(
    () => {
      if (gameOverSequence !== 'playing') return
      if (!loserTeam || !winnerTeam) return

      const header = headerChromeRef.current
      const start = startBlockRef.current
      const loserEl =
        loserTeam === 'A' ? teamCellARef.current : teamCellBRef.current
      const winnerEl =
        winnerTeam === 'A' ? teamCellARef.current : teamCellBRef.current
      const titleEl = winnerTitleRef.current
      const newGameEl = newGameWrapRef.current
      const hero = heroPortalRef.current
      const heroSlot = heroMiddleSlotRef.current

      if (
        !header ||
        !start ||
        !loserEl ||
        !winnerEl ||
        !titleEl ||
        !newGameEl ||
        !hero ||
        !heroSlot
      )
        return

      const session = ++animationSessionRef.current

      gsap.set([titleEl, newGameEl], { opacity: 0 })
      gsap.set(titleEl, { y: -60 })
      gsap.set(newGameEl, { y: 60 })

      const tl = gsap.timeline()

      tl.to(loserEl, { opacity: 0, duration: 0.45, ease: 'power2.out' })
      tl.to({}, { duration: 0.08 })
      tl.call(() => {
        if (animationSessionRef.current !== session) return
        const r = winnerEl.getBoundingClientRect()
        gsap.set(winnerEl, { visibility: 'hidden' })

        void heroSlot.offsetHeight
        const slotR = heroSlot.getBoundingClientRect()
        const pad = 16
        const innerW = Math.max(0, slotR.width - pad * 2)
        const innerH = Math.max(0, slotR.height - pad * 2)
        const maxScale = Math.min(
          2,
          r.width > 0 ? innerW / r.width : 2,
          r.height > 0 ? innerH / r.height : 2,
        )

        const startCx = r.left + r.width / 2
        const startCy = r.top + r.height / 2
        const slotCx = slotR.left + slotR.width / 2
        const slotCy = slotR.top + slotR.height / 2

        celebrationGeoRef.current = {
          startCx,
          startCy,
          slotCx,
          slotCy,
          maxScale,
          width: r.width,
          height: r.height,
          session,
        }

        gsap.set(hero, {
          position: 'fixed',
          left: startCx,
          top: startCy,
          xPercent: -50,
          yPercent: -50,
          width: r.width,
          height: r.height,
          scale: 1,
          rotationY: 0,
          transformPerspective: HERO_TRANSFORM_PERSPECTIVE,
          transformOrigin: '50% 50%',
          zIndex: GAME_OVER_HERO_Z,
          margin: 0,
          opacity: 1,
          visibility: 'visible',
        })

        const celebrate = gsap.timeline({
          onComplete: () => {
            if (animationSessionRef.current === session) {
              dispatch({ type: 'GAME_OVER_SEQUENCE_COMPLETE' })
            }
          },
        })
        celebrate.to(hero, {
          left: slotCx,
          top: slotCy,
          scale: maxScale,
          rotationY: HERO_SPIN_ROTATION_Y,
          duration: HERO_CELEBRATION_DURATION,
          ease: 'power2.inOut',
        })
        celebrate.to(
          [header, start],
          { opacity: 0, duration: 0.55, ease: 'power2.out' },
          '<',
        )
        celebrate.call(
          () => {
            if (animationSessionRef.current === session) {
              setConfettiTrigger(true)
            }
          },
          undefined,
          '<0.15',
        )
        celebrate.to(
          titleEl,
          { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out' },
          `-=${HERO_CELEBRATION_DURATION * 0.35}`,
        )
        celebrate.to(
          newGameEl,
          { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out' },
          '<0.12',
        )

        tl.add(celebrate)
      })

      return () => {
        tl.kill()
      }
    },
    {
      dependencies: [
        gameOverSequence,
        gameOverWinnerTeam,
        loserTeam,
        winnerTeam,
        dispatch,
      ],
    },
  )

  function handleNewGameClick() {
    if (gameOverSequence !== 'complete' || isNewGameExiting) return
    if (!loserTeam || !winnerTeam) {
      dispatch({ type: 'NEW_GAME' })
      return
    }

    const geo = celebrationGeoRef.current
    if (!geo || geo.session !== animationSessionRef.current) {
      dispatch({ type: 'NEW_GAME' })
      return
    }

    const header = headerChromeRef.current
    const start = startBlockRef.current
    const loserEl =
      loserTeam === 'A' ? teamCellARef.current : teamCellBRef.current
    const winnerEl =
      winnerTeam === 'A' ? teamCellARef.current : teamCellBRef.current
    const titleEl = winnerTitleRef.current
    const newGameEl = newGameWrapRef.current
    const hero = heroPortalRef.current

    if (
      !header ||
      !start ||
      !loserEl ||
      !winnerEl ||
      !titleEl ||
      !newGameEl ||
      !hero
    ) {
      dispatch({ type: 'NEW_GAME' })
      return
    }

    exitTimelineRef.current?.kill()
    setIsNewGameExiting(true)
    setConfettiTrigger(false)

    const exitTl = gsap.timeline({
      onComplete: () => {
        exitTimelineRef.current = null
      },
    })
    exitTimelineRef.current = exitTl

    exitTl.to(titleEl, {
      y: -60,
      opacity: 0,
      duration: 0.55,
      ease: 'power2.in',
    })
    exitTl.to(
      newGameEl,
      { y: 60, opacity: 0, duration: 0.55, ease: 'power2.in' },
      '<',
    )

    exitTl.to(
      hero,
      {
        left: geo.startCx,
        top: geo.startCy,
        scale: 1,
        rotationY: 0,
        duration: HERO_CELEBRATION_DURATION,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(winnerEl, { visibility: 'visible' })
          gsap.set(hero, {
            visibility: 'hidden',
            clearProps:
              'position,left,top,width,height,scale,rotationY,transformPerspective,transformOrigin,zIndex,margin,xPercent,yPercent,opacity',
          })
          celebrationGeoRef.current = null
        },
      },
      '>',
    )
    exitTl.to(
      [header, start],
      { opacity: 1, duration: 0.55, ease: 'power2.out' },
      '<',
    )

    exitTl.to(
      loserEl,
      { opacity: 1, duration: 0.45, ease: 'power2.out' },
      '-=0.2',
    )

    exitTl.call(() => {
      dispatch({ type: 'NEW_GAME' })
      setIsNewGameExiting(false)
    })
  }

  function handleTouchStart(team: 'A' | 'B') {
    if (gameOverSequence !== 'idle') return
    touchStartedAtRef.current = Date.now()
    timerRef.current = setTimeout(() => {
      dispatch({ type: 'ADD_HEART', team })
    }, 1000)
  }

  function handleTouchEnd(team: 'A' | 'B') {
    if (gameOverSequence !== 'idle') return
    const touchStartedAt = touchStartedAtRef.current!
    const touchDuration = Date.now() - touchStartedAt

    touchStartedAtRef.current = null
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    if (touchDuration < 500) {
      dispatch({ type: 'SET_ACTIVE_TEAM', team })
    }
  }

  const blockGameInput = gameOverSequence !== 'idle'

  const gameOverPortal =
    showGameOverPortal && winnerTeam
      ? createPortal(
          <div
            className="pointer-events-none fixed inset-0 flex min-h-0 flex-col"
            style={{ zIndex: GAME_OVER_PORTAL_Z }}
          >
            <Confetti
              colors={confettiColors}
              style={{ zIndex: GAME_OVER_CONFETTI_Z }}
              trigger={confettiTrigger}
            />

            <div
              className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-4 pt-[max(1rem,env(safe-area-inset-top))]"
              style={{ zIndex: GAME_OVER_CHROME_Z }}
            >
              <div
                ref={winnerTitleRef}
                className="text-textColor pointer-events-none text-center text-4xl font-bold tracking-tight uppercase sm:text-5xl"
              >
                Winner!
              </div>
            </div>

            <div
              ref={heroMiddleSlotRef}
              className="
                flex
                min-h-[min(46dvh,400px)]
                shrink-0
                items-center
                justify-center
              "
              aria-hidden
            />

            <div
              className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
              style={{ zIndex: GAME_OVER_CHROME_Z }}
            >
              <div
                ref={newGameWrapRef}
                className={twMerge(
                  'text-center',
                  gameOverSequence === 'complete' && 'pointer-events-auto',
                )}
              >
                <StyledText
                  as="button"
                  variant="button.primary"
                  disabled={gameOverSequence !== 'complete' || isNewGameExiting}
                  onClick={handleNewGameClick}
                >
                  New Game
                </StyledText>
              </div>
            </div>

            <div
              ref={heroPortalRef}
              className="
                game-over-hero-glow
                pointer-events-none
                invisible
                fixed
                rounded-xl
                transform-3d
              "
              style={{
                transformStyle: 'preserve-3d',
                ...({
                  '--game-over-card-glow-color':
                    winnerTeam === 'A' ? teamAColor[500] : teamBColor[500],
                } as CSSProperties),
              }}
            >
              <div
                className="relative h-full w-full"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div
                  className={twMerge(
                    `
                      absolute
                      inset-0
                      flex
                      flex-col
                      overflow-hidden
                      rounded-xl
                      border-2
                    `,
                    winnerTeam === 'A'
                      ? 'border-teamAColor-500 bg-teamAColor-500'
                      : 'border-teamBColor-500 bg-teamBColor-500',
                  )}
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <StyledText
                    as="div"
                    className={twMerge(
                      'flex h-full w-full items-center justify-center text-4xl',
                      winnerTeam === 'A'
                        ? 'border-teamAColor-500 bg-teamAColor-500'
                        : 'border-teamBColor-500 bg-teamBColor-500',
                    )}
                    variant="button.primary"
                  >
                    {winnerTeam}
                  </StyledText>
                  <DistressMarks
                    flip={winnerTeam === 'B'}
                    heartsLeft={HEARTS_PER_TEAM}
                  />
                </div>
                <div
                  className="absolute inset-0 rounded-xl border-2 border-solid"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    backgroundColor:
                      winnerTeam === 'A' ? teamAColor[800] : teamBColor[800],
                    borderColor:
                      winnerTeam === 'A' ? teamAColor[950] : teamBColor[950],
                  }}
                  aria-hidden
                />
              </div>
            </div>
          </div>,
          document.body,
        )
      : null

  return (
    <>
      <ScreenContainer
        screenName={AppScreen.Scoring}
        slotForHeader={
          <div
            ref={headerChromeRef}
            className="h-full w-full"
          >
            <AppHeader
              leftSlot={<PointDots team="A" />}
              centerSlot={
                <StyledText
                  as="button"
                  variant="button.tool"
                  disabled={blockGameInput}
                  onClick={() =>
                    dispatch({
                      type: 'SET_ACTIVE_SCREEN',
                      screen: AppScreen.MainMenu,
                    })
                  }
                >
                  <Icon name="arrow-left-long" />
                </StyledText>
              }
              rightSlot={<PointDots team="B" />}
            />
          </div>
        }
        slotForMain={
          <main
            className={twMerge(
              classNames.mainContainer,
              blockGameInput && 'pointer-events-none',
            )}
          >
            {(['A', 'B'] as const).map(team => {
              const heartsLeft = heartsForDistressMarks(team, state)
              const shaking = team === 'A' ? shakingA : shakingB
              const cellRef = team === 'A' ? teamCellARef : teamCellBRef

              return (
                <div
                  ref={cellRef}
                  key={team}
                  className={twMerge(
                    'relative overflow-hidden',
                    shaking && 'animate__animated animate__shakeX',
                    team === 'A'
                      ? 'col-start-1 col-end-2 row-start-1 row-end-2 rounded-tl-xl'
                      : 'col-start-2 col-end-3 row-start-1 row-end-2 rounded-tr-xl',
                  )}
                >
                  <StyledText
                    as="button"
                    className={twMerge(
                      'h-full w-full',
                      classNames.pointButton,
                      team === 'A'
                        ? classNames.pointButtonTeamA
                        : classNames.pointButtonTeamB,
                      team !== activeTeamInRound && 'opacity-50',
                    )}
                    variant="button.primary"
                    onTouchStart={() => handleTouchStart(team)}
                    onTouchEnd={() => handleTouchEnd(team)}
                  >
                    {team}
                  </StyledText>
                  <DistressMarks
                    flip={team === 'B'}
                    heartsLeft={heartsLeft}
                  />
                </div>
              )
            })}

            <div
              ref={startBlockRef}
              className="relative col-start-1 col-end-3 row-start-2 row-end-4 grid min-h-0 overflow-hidden rounded-b-xl [grid-template:1fr/1fr]"
            >
              <StyledText
                as="button"
                className={twMerge(
                  'h-full w-full [grid-area:1/1]',
                  classNames.startButton({ activeTeam: activeTeamInRound }),
                )}
                variant="button.primary"
                onClick={() => dispatch({ type: 'START_ROUND' })}
              >
                Start
              </StyledText>
              <div className="pointer-events-none relative z-10 min-h-0 [grid-area:1/1]">
                {(['A', 'B'] as const).map(team => {
                  const heartsLeft = heartsForDistressMarks(team, state)
                  const isActive = activeTeamInRound === team
                  return (
                    <div
                      key={team}
                      className="absolute inset-0"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transition: 'opacity 2000ms',
                      }}
                    >
                      <DistressMarks heartsLeft={heartsLeft} />
                    </div>
                  )
                })}
              </div>
            </div>
          </main>
        }
      />
      {gameOverPortal}
    </>
  )
}
