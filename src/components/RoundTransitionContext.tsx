'use client'

import { AppAction, AppScreen, AppState } from '@/app/reducer'
import { useAppContext } from '@/components/AppContext'
import {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

export type RoundTransitionPhase =
  | 'idle'
  | 'scoringExit'
  | 'guessingEnter'
  | 'countdown'
  | 'phraseEnter'
  | 'guessingExit'
  | 'scoringEnter'
  | 'scoringImpact'
  | 'scoringHeartLoss'
  | 'scoringGameOverExit'
  | 'scoringGameOverReveal'
  | 'scoringGameOver'
  | 'scoringGameOverReset'
  | 'scoringGameOverResetEnter'

type RoundExitReason = 'abort' | 'end'
type CountdownLabel = '3' | '2' | '1' | 'GO!'
type Team = 'A' | 'B'

const BLANK_BEAT_MS = 80
const COUNTDOWN_STEP_MS = 800
const HEART_LOSS_ANIMATION_MS = 1100
const COUNTDOWN_LABELS: CountdownLabel[] = ['3', '2', '1', 'GO!']

interface RoundTransitionContextObject {
  applyPendingRoundEndDamage: () => void
  countdownLabel: CountdownLabel | null
  finishGuessingEnter: () => void
  finishGuessingExit: () => void
  finishPhraseEnter: () => void
  finishScoringGameOverExit: () => void
  finishScoringGameOverReset: () => void
  finishScoringGameOverResetEnter: () => void
  finishScoringGameOverReveal: () => void
  finishScoringImpact: () => void
  finishScoringEnter: () => void
  finishScoringExit: () => void
  pendingRoundEndIsFinalHit: boolean
  pendingRoundEndTeam: Team | null
  phase: RoundTransitionPhase
  gameOverResetWinningTeam: Team | null
  requestAbortRound: () => void
  requestEndRound: () => void
  requestNewGame: () => void
  resetRoundTransition: () => void
  startRoundTransition: () => void
}

interface PendingRoundEnd {
  didApplyDamage: boolean
  isFinalHit: boolean
  team: Team
}

const noop = () => {}

const PrivateRoundTransitionContext =
  createContext<RoundTransitionContextObject>({
    applyPendingRoundEndDamage: noop,
    countdownLabel: null,
    finishGuessingEnter: noop,
    finishGuessingExit: noop,
    finishPhraseEnter: noop,
    finishScoringGameOverExit: noop,
    finishScoringGameOverReset: noop,
    finishScoringGameOverResetEnter: noop,
    finishScoringGameOverReveal: noop,
    finishScoringImpact: noop,
    finishScoringEnter: noop,
    finishScoringExit: noop,
    pendingRoundEndIsFinalHit: false,
    pendingRoundEndTeam: null,
    phase: 'idle',
    gameOverResetWinningTeam: null,
    requestAbortRound: noop,
    requestEndRound: noop,
    requestNewGame: noop,
    resetRoundTransition: noop,
    startRoundTransition: noop,
  })

const phasesWithAbortAvailable: RoundTransitionPhase[] = [
  'countdown',
  'phraseEnter',
]

function getInitialPhase(state: AppState): RoundTransitionPhase {
  const isGameOver =
    state.heartsRemainingForTeamA === 0 || state.heartsRemainingForTeamB === 0

  if (state.activeScreen === AppScreen.Scoring && isGameOver) {
    return 'scoringGameOver'
  }

  return state.activeScreen === AppScreen.Scoring ? 'scoringEnter' : 'idle'
}

function useRoundTransitionTimeouts() {
  const blankBeatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const heartLossTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearBlankBeatTimeout = useCallback(() => {
    if (blankBeatTimeoutRef.current === null) return
    clearTimeout(blankBeatTimeoutRef.current)
    blankBeatTimeoutRef.current = null
  }, [])

  const clearHeartLossTimeout = useCallback(() => {
    if (heartLossTimeoutRef.current === null) return
    clearTimeout(heartLossTimeoutRef.current)
    heartLossTimeoutRef.current = null
  }, [])

  useEffect(() => clearBlankBeatTimeout, [clearBlankBeatTimeout])
  useEffect(() => clearHeartLossTimeout, [clearHeartLossTimeout])

  return {
    blankBeatTimeoutRef,
    clearBlankBeatTimeout,
    clearHeartLossTimeout,
    heartLossTimeoutRef,
  }
}

function useRoundCountdown({
  dispatch,
  phase,
  setPhase,
}: {
  dispatch: Dispatch<AppAction>
  phase: RoundTransitionPhase
  setPhase: (nextPhase: RoundTransitionPhase) => void
}) {
  const [countdownLabel, setCountdownLabel] = useState<CountdownLabel | null>(
    null,
  )

  useEffect(() => {
    if (phase !== 'countdown') return

    let labelIndex = 0
    setCountdownLabel(COUNTDOWN_LABELS[labelIndex])

    const countdownInterval = setInterval(() => {
      labelIndex += 1

      if (labelIndex < COUNTDOWN_LABELS.length) {
        setCountdownLabel(COUNTDOWN_LABELS[labelIndex])
        return
      }

      clearInterval(countdownInterval)
      dispatch({ type: 'START_ROUND' })
      setPhase('phraseEnter')
    }, COUNTDOWN_STEP_MS)

    return () => clearInterval(countdownInterval)
  }, [dispatch, phase, setPhase])

  return { countdownLabel, setCountdownLabel }
}

function useRoundTransitionContextValue({
  applyPendingRoundEndDamage,
  countdownLabel,
  finishGuessingEnter,
  finishGuessingExit,
  finishPhraseEnter,
  finishScoringGameOverExit,
  finishScoringGameOverReset,
  finishScoringGameOverResetEnter,
  finishScoringGameOverReveal,
  finishScoringImpact,
  finishScoringEnter,
  finishScoringExit,
  gameOverResetWinningTeam,
  pendingRoundEndIsFinalHit,
  pendingRoundEndTeam,
  phase,
  requestAbortRound,
  requestEndRound,
  requestNewGame,
  resetRoundTransition,
  startRoundTransition,
}: RoundTransitionContextObject) {
  return useMemo(
    () => ({
      applyPendingRoundEndDamage,
      countdownLabel,
      finishGuessingEnter,
      finishGuessingExit,
      finishPhraseEnter,
      finishScoringGameOverExit,
      finishScoringGameOverReset,
      finishScoringGameOverResetEnter,
      finishScoringGameOverReveal,
      finishScoringImpact,
      finishScoringEnter,
      finishScoringExit,
      gameOverResetWinningTeam,
      pendingRoundEndIsFinalHit,
      pendingRoundEndTeam,
      phase,
      requestAbortRound,
      requestEndRound,
      requestNewGame,
      resetRoundTransition,
      startRoundTransition,
    }),
    [
      applyPendingRoundEndDamage,
      countdownLabel,
      finishGuessingEnter,
      finishGuessingExit,
      finishPhraseEnter,
      finishScoringGameOverExit,
      finishScoringGameOverReset,
      finishScoringGameOverResetEnter,
      finishScoringGameOverReveal,
      finishScoringImpact,
      finishScoringEnter,
      finishScoringExit,
      gameOverResetWinningTeam,
      pendingRoundEndIsFinalHit,
      pendingRoundEndTeam,
      phase,
      requestAbortRound,
      requestEndRound,
      requestNewGame,
      resetRoundTransition,
      startRoundTransition,
    ],
  )
}

function useRoundTransitionController() {
  const { dispatch, state } = useAppContext()
  const [phase, setPhaseState] = useState<RoundTransitionPhase>(() =>
    getInitialPhase(state),
  )
  const [pendingRoundEndTeam, setPendingRoundEndTeam] = useState<Team | null>(
    null,
  )
  const [pendingRoundEndIsFinalHit, setPendingRoundEndIsFinalHit] =
    useState(false)
  const [gameOverResetWinningTeam, setGameOverResetWinningTeam] =
    useState<Team | null>(null)
  const exitReasonRef = useRef<RoundExitReason | null>(null)
  const pendingRoundEndRef = useRef<PendingRoundEnd | null>(null)
  const phaseRef = useRef(phase)
  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  const setPhase = useCallback((nextPhase: RoundTransitionPhase) => {
    phaseRef.current = nextPhase
    setPhaseState(nextPhase)
  }, [])

  const {
    blankBeatTimeoutRef,
    clearBlankBeatTimeout,
    clearHeartLossTimeout,
    heartLossTimeoutRef,
  } = useRoundTransitionTimeouts()
  const { countdownLabel, setCountdownLabel } = useRoundCountdown({
    dispatch,
    phase,
    setPhase,
  })

  const startRoundTransition = useCallback(() => {
    if (
      phaseRef.current !== 'idle' ||
      stateRef.current.activeScreen !== AppScreen.Scoring
    ) {
      return
    }

    clearBlankBeatTimeout()
    clearHeartLossTimeout()
    exitReasonRef.current = null
    pendingRoundEndRef.current = null
    setPendingRoundEndIsFinalHit(false)
    setPendingRoundEndTeam(null)
    setGameOverResetWinningTeam(null)
    setCountdownLabel(null)
    setPhase('scoringExit')
  }, [
    clearBlankBeatTimeout,
    clearHeartLossTimeout,
    setCountdownLabel,
    setPhase,
  ])

  const resetRoundTransition = useCallback(() => {
    clearBlankBeatTimeout()
    clearHeartLossTimeout()
    exitReasonRef.current = null
    pendingRoundEndRef.current = null
    setPendingRoundEndIsFinalHit(false)
    setPendingRoundEndTeam(null)
    setGameOverResetWinningTeam(null)
    setCountdownLabel(null)
    setPhase('scoringEnter')
  }, [
    clearBlankBeatTimeout,
    clearHeartLossTimeout,
    setCountdownLabel,
    setPhase,
  ])

  const requestNewGame = useCallback(() => {
    if (
      phaseRef.current !== 'scoringGameOver' ||
      stateRef.current.activeScreen !== AppScreen.Scoring
    ) {
      return
    }

    const { heartsRemainingForTeamA, heartsRemainingForTeamB } =
      stateRef.current
    const winningTeam =
      heartsRemainingForTeamA === 0
        ? 'B'
        : heartsRemainingForTeamB === 0
          ? 'A'
          : null

    if (!winningTeam) return

    clearBlankBeatTimeout()
    clearHeartLossTimeout()
    exitReasonRef.current = null
    pendingRoundEndRef.current = null
    setPendingRoundEndIsFinalHit(false)
    setPendingRoundEndTeam(null)
    setGameOverResetWinningTeam(winningTeam)
    setCountdownLabel(null)
    setPhase('scoringGameOverReset')
  }, [
    clearBlankBeatTimeout,
    clearHeartLossTimeout,
    setCountdownLabel,
    setPhase,
  ])

  const finishScoringExit = useCallback(() => {
    if (phaseRef.current !== 'scoringExit') return

    clearBlankBeatTimeout()
    blankBeatTimeoutRef.current = setTimeout(() => {
      blankBeatTimeoutRef.current = null
      if (phaseRef.current !== 'scoringExit') return
      setPhase('guessingEnter')
    }, BLANK_BEAT_MS)
  }, [blankBeatTimeoutRef, clearBlankBeatTimeout, setPhase])

  const finishGuessingEnter = useCallback(() => {
    if (phaseRef.current !== 'guessingEnter') return

    if (stateRef.current.countdownEnabled) {
      setPhase('countdown')
      return
    }

    setCountdownLabel(null)
    dispatch({ type: 'START_ROUND' })
    setPhase('phraseEnter')
  }, [dispatch, setCountdownLabel, setPhase])

  const finishPhraseEnter = useCallback(() => {
    if (phaseRef.current !== 'phraseEnter') return
    setCountdownLabel(null)
    setPhase('idle')
  }, [setCountdownLabel, setPhase])

  const requestAbortRound = useCallback(() => {
    const currentPhase = phaseRef.current
    const isActiveGuessingScreen =
      currentPhase === 'idle' &&
      stateRef.current.activeScreen === AppScreen.Guessing
    const isAbortableTransition =
      phasesWithAbortAvailable.includes(currentPhase)

    if (!(isActiveGuessingScreen || isAbortableTransition)) return

    clearBlankBeatTimeout()
    clearHeartLossTimeout()
    exitReasonRef.current = 'abort'
    pendingRoundEndRef.current = null
    setPendingRoundEndIsFinalHit(false)
    setPendingRoundEndTeam(null)
    setCountdownLabel(null)
    setPhase('guessingExit')
  }, [
    clearBlankBeatTimeout,
    clearHeartLossTimeout,
    setCountdownLabel,
    setPhase,
  ])

  const requestEndRound = useCallback(() => {
    if (
      phaseRef.current !== 'idle' ||
      stateRef.current.activeScreen !== AppScreen.Guessing
    ) {
      return
    }

    exitReasonRef.current = 'end'
    setCountdownLabel(null)
    setPhase('guessingExit')
  }, [setCountdownLabel, setPhase])

  const finishGuessingExit = useCallback(() => {
    if (phaseRef.current !== 'guessingExit') return

    const exitReason = exitReasonRef.current
    exitReasonRef.current = null
    setCountdownLabel(null)

    if (exitReason === 'end') {
      const {
        activeTeamInRound,
        heartsRemainingForTeamA,
        heartsRemainingForTeamB,
      } = stateRef.current
      const activeTeamHearts =
        activeTeamInRound === 'A'
          ? heartsRemainingForTeamA
          : heartsRemainingForTeamB
      const isFinalHit = Math.max(0, activeTeamHearts - 1) === 0

      pendingRoundEndRef.current = {
        didApplyDamage: false,
        isFinalHit,
        team: activeTeamInRound,
      }
      setPendingRoundEndIsFinalHit(isFinalHit)
      setPendingRoundEndTeam(activeTeamInRound)
      setPhase('scoringEnter')
      return
    }

    dispatch({ type: 'ABORT_ROUND' })
    setPhase('scoringEnter')
  }, [dispatch, setCountdownLabel, setPhase])

  const finishScoringEnter = useCallback(() => {
    if (phaseRef.current !== 'scoringEnter') return

    if (pendingRoundEndRef.current) {
      setPhase('scoringImpact')
      return
    }

    setPhase('idle')
  }, [setPhase])

  const applyPendingRoundEndDamage = useCallback(() => {
    const pendingRoundEnd = pendingRoundEndRef.current

    if (!pendingRoundEnd || pendingRoundEnd.didApplyDamage) return

    pendingRoundEndRef.current = {
      ...pendingRoundEnd,
      didApplyDamage: true,
    }
    dispatch({ type: 'END_ROUND' })
  }, [dispatch])

  const finishScoringImpact = useCallback(() => {
    if (phaseRef.current !== 'scoringImpact') return

    clearHeartLossTimeout()
    setPhase('scoringHeartLoss')

    heartLossTimeoutRef.current = setTimeout(() => {
      heartLossTimeoutRef.current = null

      if (phaseRef.current !== 'scoringHeartLoss') return

      if (pendingRoundEndRef.current?.isFinalHit) {
        setPhase('scoringGameOverExit')
        return
      }

      pendingRoundEndRef.current = null
      setPendingRoundEndIsFinalHit(false)
      setPendingRoundEndTeam(null)
      setPhase('idle')
    }, HEART_LOSS_ANIMATION_MS)
  }, [clearHeartLossTimeout, heartLossTimeoutRef, setPhase])

  const finishScoringGameOverExit = useCallback(() => {
    if (phaseRef.current !== 'scoringGameOverExit') return
    setPhase('scoringGameOverReveal')
  }, [setPhase])

  const finishScoringGameOverReveal = useCallback(() => {
    if (phaseRef.current !== 'scoringGameOverReveal') return
    pendingRoundEndRef.current = null
    setPendingRoundEndIsFinalHit(false)
    setPendingRoundEndTeam(null)
    setPhase('scoringGameOver')
  }, [setPhase])

  const finishScoringGameOverReset = useCallback(() => {
    if (phaseRef.current !== 'scoringGameOverReset') return
    dispatch({ type: 'NEW_GAME' })
    setPhase('scoringGameOverResetEnter')
  }, [dispatch, setPhase])

  const finishScoringGameOverResetEnter = useCallback(() => {
    if (phaseRef.current !== 'scoringGameOverResetEnter') return
    setGameOverResetWinningTeam(null)
    setPhase('idle')
  }, [setPhase])

  const value = useRoundTransitionContextValue({
    applyPendingRoundEndDamage,
    countdownLabel,
    finishGuessingEnter,
    finishGuessingExit,
    finishPhraseEnter,
    finishScoringGameOverExit,
    finishScoringGameOverReset,
    finishScoringGameOverResetEnter,
    finishScoringGameOverReveal,
    finishScoringImpact,
    finishScoringEnter,
    finishScoringExit,
    gameOverResetWinningTeam,
    pendingRoundEndIsFinalHit,
    pendingRoundEndTeam,
    phase,
    requestAbortRound,
    requestEndRound,
    requestNewGame,
    resetRoundTransition,
    startRoundTransition,
  })

  return value
}

export function RoundTransitionProvider({ children }: { children: ReactNode }) {
  const value = useRoundTransitionController()

  return (
    <PrivateRoundTransitionContext value={value}>
      {children}
    </PrivateRoundTransitionContext>
  )
}

export function useRoundTransition() {
  return useContext(PrivateRoundTransitionContext)
}
