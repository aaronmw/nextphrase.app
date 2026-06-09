'use client'

import { useAppContext } from '@/components/AppContext'
import { Icon } from '@/components/Icon'
import { hyphenateSync } from 'hyphen/en'
import gsap from 'gsap'
import {
  ComponentProps,
  forwardRef,
  ReactNode,
  RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { twMerge } from 'tailwind-merge'

const PHRASE_OUT_DURATION = 0.2
const PHRASE_IN_DURATION = 0.25
const PHRASE_Y_OFFSET = 16

const FROZEN_TAUNTS = [
  'Too soon.',
  'Nice try.',
  'Still locked.',
  'Calm down.',
  'Not yet.',
  'Greedy swipe.',
  'Patience, champ.',
  'Easy there.',
  'Hold up.',
  'Bit eager?',
  'Freeze means freeze.',
  'Hands off.',
  'That was quick.',
  'Relax, speedster.',
  'Nope. Wait.',
  'Cute attempt.',
  'Again? Really?',
  'Swipe later.',
  'Lock says no.',
  'Try patience.',
] as const

function pickFreezeTaunt(): string {
  return FROZEN_TAUNTS[Math.floor(Math.random() * FROZEN_TAUNTS.length)]
}

export interface PhraseFlipperHandle {
  triggerPhraseTransition: (onComplete: () => void) => void
}

interface PhraseFlipperProps extends Omit<ComponentProps<'div'>, 'children'> {
  duration?: number
}

export const PhraseFlipper = forwardRef<
  PhraseFlipperHandle,
  PhraseFlipperProps
>(function PhraseFlipper({ className, duration = 250, ...otherProps }, ref) {
  const {
    state: { currentPhraseId, freezeDuration, phrasesById },
    dispatch,
  } = useAppContext()
  const containerElementRef = useRef<HTMLDivElement>(null)
  const phraseContentRef = useRef<HTMLDivElement>(null)
  const transitionPendingRef = useRef(false)
  const prevScrollLeftRef = useRef(0)
  const [isFrozen, setIsFrozen] = useState(false)
  const [freezeTaunt, setFreezeTaunt] = useState('')
  const currentPhrase = currentPhraseId
    ? String(phrasesById.get(currentPhraseId))
    : '...'

  useImperativeHandle(ref, () => ({
    triggerPhraseTransition(onComplete: () => void) {
      const el = phraseContentRef.current
      if (!el || transitionPendingRef.current) {
        onComplete()
        return
      }
      transitionPendingRef.current = true
      gsap.to(el, {
        opacity: 0,
        y: -PHRASE_Y_OFFSET,
        duration: PHRASE_OUT_DURATION,
        ease: 'power2.in',
        onComplete: onComplete,
      })
    },
  }))

  useEffect(() => {
    if (!transitionPendingRef.current || !phraseContentRef.current) return
    const el = phraseContentRef.current
    gsap.fromTo(
      el,
      { opacity: 0, y: PHRASE_Y_OFFSET },
      {
        opacity: 1,
        y: 0,
        duration: PHRASE_IN_DURATION,
        ease: 'power2.out',
        onComplete: () => {
          transitionPendingRef.current = false
        },
      },
    )
  }, [currentPhraseId])

  function handleScroll() {
    const containerElement = containerElementRef.current

    if (!containerElement) return

    const scrollPosition = containerElement.scrollLeft
    const containerWidth = containerElement.clientWidth
    const endThreshold =
      containerWidth > 1 ? containerWidth - 1 : containerWidth
    const isScrolledToEnd = containerWidth > 0 && scrollPosition >= endThreshold

    if (isScrolledToEnd) {
      if (isFrozen) {
        const justArrivedAtEndWhileFrozen =
          prevScrollLeftRef.current < endThreshold
        if (justArrivedAtEndWhileFrozen) {
          setFreezeTaunt(pickFreezeTaunt())
        }
        prevScrollLeftRef.current = scrollPosition
        containerElement.scrollTo({ left: 0, behavior: 'smooth' })
        return
      }

      prevScrollLeftRef.current = scrollPosition
      containerElement.style.opacity = '0'
      dispatch({ type: 'NEXT_PHRASE' })

      setTimeout(() => {
        setFreezeTaunt(pickFreezeTaunt())
        setIsFrozen(true)
        prevScrollLeftRef.current = 0

        setTimeout(() => {
          setIsFrozen(false)
          setFreezeTaunt('')
        }, freezeDuration)

        containerElement.style.opacity = '1'
        containerElement.scrollTo({ left: 0, behavior: 'instant' })
      }, duration)
      return
    }

    prevScrollLeftRef.current = scrollPosition
  }

  return (
    <div
      className={twMerge(
        `
            absolute
            inset-0
            flex
            snap-x
            snap-mandatory
            overflow-x-auto
            scroll-smooth
          `,
        className,
      )}
      ref={containerElementRef}
      onScroll={handleScroll}
      {...otherProps}
    >
      <PhraseContainer
        contentRef={phraseContentRef}
        slotForText={currentPhrase}
      />
      <PhraseContainer
        slotForText={
          <div className="flex flex-col items-center justify-center gap-2">
            <div className={isFrozen ? undefined : 'animate-spin'}>
              <Icon name={isFrozen ? 'solid:lock' : 'solid:loader'} />
            </div>
            {isFrozen ? (
              <span className="max-w-[min(90vw,20rem)] text-center text-sm leading-snug font-normal normal-case">
                {freezeTaunt}
              </span>
            ) : null}
          </div>
        }
        slotForNodes={
          <div
            className={twMerge(
              `
                  bg-gradient-radial
                  absolute
                  top-0
                  right-0
                  bottom-0
                  left-1/2
                  translate-x-1/2
                  from-red-500
                  to-transparent
                  opacity-0
                  transition-opacity
                `,
              isFrozen && 'opacity-100',
            )}
          />
        }
      />
    </div>
  )
})

const PhraseContainer = ({
  contentRef,
  slotForText,
  slotForNodes,
}: {
  contentRef?: RefObject<HTMLDivElement | null>
  slotForText: ReactNode
  slotForNodes?: ReactNode
}) => {
  const renderedContent =
    typeof slotForText === 'string'
      ? hyphenateSync(slotForText, { minWordLength: 10 })
      : slotForText

  return (
    <div
      className="
        relative
        flex
        h-full
        w-screen
        shrink-0
        snap-center
        items-center
        justify-center
        text-center
        text-2xl
        leading-none
        text-balance
        uppercase
      "
    >
      {slotForNodes}

      <div
        ref={contentRef}
        className="relative"
      >
        <div
          className="
            text-bgColor
            absolute
            top-1/2
            scale-150
            p-3
            blur-sm
          "
        >
          {renderedContent}
        </div>
        <div className="relative z-10 p-3">{renderedContent}</div>
      </div>
    </div>
  )
}
