'use client'

import { selectNextPhrase, type AppAction, type AppState } from '@/app/reducer'
import {
  Dispatch,
  RefObject,
  TouchEvent,
  WheelEvent,
  useEffect,
  useRef,
  useState,
} from 'react'

interface PhrasePreview {
  currentPhraseId: string | null
  nextPhraseId: string
  nextPhrase: string
}

export function usePhraseSwipe({
  disabled,
  dispatch,
  duration,
  state,
  transitionPendingRef,
}: {
  disabled: boolean
  dispatch: Dispatch<AppAction>
  duration: number
  state: AppState
  transitionPendingRef: RefObject<boolean>
}) {
  const { currentPhraseId, freezeDuration, swipeDelayEnabled } = state
  const containerElementRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<PhrasePreview | null>(null)
  const touchActiveRef = useRef(false)
  const touchSwipeRef = useRef(false)
  const rejectedSwipeRef = useRef(false)
  const revealingRef = useRef(false)
  const committedPhraseIdRef = useRef<string | null>(null)
  const frozenUntilRef = useRef(0)
  const freezeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isFrozen, setIsFrozen] = useState(false)
  const [isRevealing, setIsRevealing] = useState(false)
  const [preview, setPreview] = useState<PhrasePreview | null>(null)

  function resetSwipe() {
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current)
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    resetTimeoutRef.current = null
    scrollTimeoutRef.current = null
    previewRef.current = null
    committedPhraseIdRef.current = null
    touchActiveRef.current = false
    touchSwipeRef.current = false
    rejectedSwipeRef.current = false
    revealingRef.current = false
    const container = containerElementRef.current
    container?.scrollTo({ left: 0, behavior: 'instant' })
    container?.style.setProperty('--swipe-progress', '0')
    setPreview(null)
    setIsRevealing(false)
  }

  function preparePreview() {
    if (
      previewRef.current ||
      disabled ||
      transitionPendingRef.current ||
      revealingRef.current
    )
      return
    const nextPhrase = selectNextPhrase(state).phrase
    if (!nextPhrase) return
    const nextPreview = {
      currentPhraseId,
      nextPhraseId: nextPhrase.id,
      nextPhrase: nextPhrase.phrase,
    }
    previewRef.current = nextPreview
    setPreview(nextPreview)
  }

  function finishSwipe() {
    const container = containerElementRef.current
    if (
      !container ||
      disabled ||
      touchActiveRef.current ||
      revealingRef.current
    )
      return
    const width = container.clientWidth
    if (width === 0 || Math.abs(container.scrollLeft - width) > 1) return

    const activePreview = previewRef.current
    if (
      !activePreview ||
      rejectedSwipeRef.current ||
      transitionPendingRef.current ||
      (swipeDelayEnabled && performance.now() < frozenUntilRef.current) ||
      activePreview.currentPhraseId !== currentPhraseId
    ) {
      rejectedSwipeRef.current = true
      container.scrollTo({ left: 0, behavior: 'smooth' })
      return
    }

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    scrollTimeoutRef.current = null
    revealingRef.current = true
    committedPhraseIdRef.current = activePreview.nextPhraseId
    setIsRevealing(true)
    dispatch({ type: 'NEXT_PHRASE', phraseId: activePreview.nextPhraseId })
    if (freezeTimeoutRef.current) clearTimeout(freezeTimeoutRef.current)
    freezeTimeoutRef.current = null
    frozenUntilRef.current = swipeDelayEnabled
      ? performance.now() + freezeDuration
      : 0
    setIsFrozen(swipeDelayEnabled)
    if (swipeDelayEnabled) {
      freezeTimeoutRef.current = setTimeout(() => {
        freezeTimeoutRef.current = null
        setIsFrozen(false)
      }, freezeDuration)
    }
    resetTimeoutRef.current = setTimeout(resetSwipe, duration)
  }

  function handleScroll() {
    const container = containerElementRef.current
    if (!container || revealingRef.current) return
    const progress = Math.max(
      0,
      Math.min(1, container.scrollLeft / Math.max(container.clientWidth, 1)),
    )
    container.style.setProperty('--swipe-progress', String(progress))
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    if (progress === 0) {
      rejectedSwipeRef.current = false
      return
    }
    preparePreview()
    if (touchSwipeRef.current && !touchActiveRef.current) {
      finishSwipe()
    }
    // Keep native snapping authoritative, including browsers without scrollend.
    if (!revealingRef.current && !('onscrollend' in container))
      scrollTimeoutRef.current = setTimeout(finishSwipe, 150)
  }

  function handleTouchStart() {
    touchActiveRef.current = true
    touchSwipeRef.current = true
    rejectedSwipeRef.current = false
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    preparePreview()
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (event.touches.length > 0) return
    touchActiveRef.current = false
    if (swipeDelayEnabled && performance.now() < frozenUntilRef.current)
      rejectedSwipeRef.current = true
    finishSwipe()
  }

  function handleTouchCancel() {
    resetSwipe()
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    if (event.deltaX === 0) return
    touchSwipeRef.current = false
    preparePreview()
  }

  useEffect(() => {
    if (swipeDelayEnabled) return
    if (freezeTimeoutRef.current) clearTimeout(freezeTimeoutRef.current)
    freezeTimeoutRef.current = null
    frozenUntilRef.current = 0
    rejectedSwipeRef.current = false
    setIsFrozen(false)
  }, [swipeDelayEnabled])

  useEffect(() => {
    const activePreview = previewRef.current
    if (
      disabled ||
      (activePreview &&
        currentPhraseId !== activePreview.currentPhraseId &&
        currentPhraseId !== committedPhraseIdRef.current)
    )
      resetSwipe()
  }, [currentPhraseId, disabled])

  useEffect(
    () => () => {
      if (freezeTimeoutRef.current) clearTimeout(freezeTimeoutRef.current)
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    },
    [],
  )

  return {
    containerElementRef,
    finishSwipe,
    handleScroll,
    handleTouchCancel,
    handleTouchEnd,
    handleTouchStart,
    handleWheel,
    isFrozen: swipeDelayEnabled && isFrozen,
    isRevealing,
    preview,
    resetSwipe,
  }
}
