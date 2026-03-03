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

export interface PhraseFlipperHandle {
  triggerPhraseTransition: (onComplete: () => void) => void
}

interface PhraseFlipperProps extends Omit<ComponentProps<'div'>, 'children'> {
  duration?: number
}

export const PhraseFlipper = forwardRef<PhraseFlipperHandle, PhraseFlipperProps>(
  function PhraseFlipper(
    { className, duration = 250, ...otherProps },
    ref,
  ) {
    const {
      state: { currentPhraseId, freezeDuration, phrasesById },
      dispatch,
    } = useAppContext()
    const containerElementRef = useRef<HTMLDivElement>(null)
    const phraseContentRef = useRef<HTMLDivElement>(null)
    const transitionPendingRef = useRef(false)
    const [isFrozen, setIsFrozen] = useState(false)
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
    const isScrolledToEnd = scrollPosition === containerWidth

    if (isScrolledToEnd) {
      if (isFrozen) {
        containerElement.scrollTo({ left: 0, behavior: 'smooth' })
        return
      }

      containerElement.style.opacity = '0'
      dispatch({ type: 'NEXT_PHRASE' })

      setTimeout(() => {
        setIsFrozen(true)

        setTimeout(() => {
          setIsFrozen(false)
        }, freezeDuration)

        containerElement.style.opacity = '1'
        containerElement.scrollTo({ left: 0, behavior: 'instant' })
      }, duration)
    }
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
      <PhraseContainer contentRef={phraseContentRef} slotForText={currentPhrase} />
      <PhraseContainer
        slotForText={
          <div className={isFrozen ? undefined : 'animate-spin'}>
            <Icon name={isFrozen ? 'solid:lock' : 'solid:loader'} />
          </div>
        }
        slotForNodes={
          <div
            className={twMerge(
              `
                absolute
                bottom-0
                left-1/2
                right-0
                top-0
                bg-gradient-radial
                from-red-500
                to-transparent
                opacity-0
                transition-opacity
                translate-x-1/2
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
        text-balance
        text-center
        text-2xl
        uppercase
        leading-none
      "
    >
      {slotForNodes}

      <div ref={contentRef} className="relative">
        <div
          className="
            absolute
            top-1/2
            p-3
            text-bgColor
            blur-sm
            scale-150
          "
        >
          {renderedContent}
        </div>
        <div className="relative z-10 p-3">{renderedContent}</div>
      </div>
    </div>
  )
}
