'use client'

import { useAppContext } from '@/components/AppContext'
import { Icon } from '@/components/Icon'
import { usePhraseSwipe } from '@/components/usePhraseSwipe'
import { hyphenateSync } from 'hyphen/en'
import gsap from 'gsap'
import {
  ComponentProps,
  CSSProperties,
  forwardRef,
  ReactNode,
  RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import { twMerge } from 'tailwind-merge'

const PHRASE_OUT_DURATION = 0.2
const PHRASE_IN_DURATION = 0.25
const PHRASE_Y_OFFSET = 16
export interface PhraseFlipperHandle {
  triggerPhraseTransition: (onComplete: () => void) => void
}

interface PhraseFlipperProps extends Omit<ComponentProps<'div'>, 'children'> {
  disabled?: boolean
  duration?: number
}

export const PhraseFlipper = forwardRef<
  PhraseFlipperHandle,
  PhraseFlipperProps
>(function PhraseFlipper(
  { className, disabled = false, duration = 250, style, ...otherProps },
  ref,
) {
  const { state, dispatch } = useAppContext()
  const { currentPhraseId, phrasesById } = state
  const phraseContentRef = useRef<HTMLDivElement>(null)
  const transitionPendingRef = useRef(false)
  const {
    containerElementRef,
    finishSwipe,
    handleScroll,
    handleTouchCancel,
    handleTouchEnd,
    handleTouchStart,
    handleWheel,
    isFrozen,
    isRevealing,
    preview,
    resetSwipe,
  } = usePhraseSwipe({
    disabled,
    dispatch,
    duration,
    state,
    transitionPendingRef,
  })
  const currentPhrase = currentPhraseId
    ? (phrasesById.get(currentPhraseId) ?? '...')
    : '...'
  const showLock = isFrozen && !isRevealing

  useImperativeHandle(ref, () => ({
    triggerPhraseTransition(onComplete: () => void) {
      resetSwipe()
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

  useEffect(() => {
    const phraseContent = phraseContentRef.current
    return () => {
      if (phraseContent) gsap.killTweensOf(phraseContent)
    }
  }, [])

  return (
    <div
      className={twMerge(
        `
          focus-visible:ring-primaryColor-500
          absolute
          inset-0
          flex
          snap-x
          snap-mandatory
          [scrollbar-width:none]
          overflow-x-auto
          scroll-smooth
          outline-none
          select-none
          [-ms-overflow-style:none]
          focus-visible:ring-2
          focus-visible:ring-inset
          [&::-webkit-scrollbar]:hidden
        `,
        disabled && 'pointer-events-none',
        className,
      )}
      ref={containerElementRef}
      aria-label="Phrases"
      aria-disabled={disabled || undefined}
      role="group"
      tabIndex={disabled ? -1 : 0}
      style={
        {
          '--swipe-duration': `${duration}ms`,
          ...style,
        } as CSSProperties
      }
      onScroll={handleScroll}
      onScrollEnd={finishSwipe}
      onTouchCancel={handleTouchCancel}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onWheel={handleWheel}
      {...otherProps}
    >
      <PhraseContainer
        contentRef={phraseContentRef}
        slotForText={currentPhrase}
      />
      <PhraseContainer
        ariaHidden
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
              showLock && 'opacity-100',
            )}
          />
        }
      >
        <PhraseContent
          className={twMerge(
            'pointer-events-none absolute inset-0 transition-opacity duration-[var(--swipe-duration)] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none',
            showLock ? 'opacity-100' : 'opacity-0',
          )}
          slotForText={<Icon name="solid:lock" />}
        />
        <div className="pointer-events-none absolute inset-0 opacity-[var(--swipe-progress,0)]">
          <PhraseContent
            className={twMerge(
              'blur-[24px] transition-[opacity,filter] duration-[var(--swipe-duration)] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none',
              showLock ? 'opacity-0' : 'opacity-100',
              isRevealing && 'blur-none',
            )}
            slotForText={preview?.nextPhrase ?? ''}
          />
        </div>
      </PhraseContainer>
    </div>
  )
})

const PhraseContainer = ({
  ariaHidden,
  children,
  className,
  contentRef,
  slotForText,
  slotForNodes,
}: {
  ariaHidden?: boolean
  children?: ReactNode
  className?: string
  contentRef?: RefObject<HTMLDivElement | null>
  slotForText?: ReactNode
  slotForNodes?: ReactNode
}) => {
  return (
    <div
      aria-hidden={ariaHidden}
      className={twMerge(
        `
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
      `,
        className,
      )}
    >
      {slotForNodes}
      {children ?? (
        <PhraseContent
          contentRef={contentRef}
          slotForText={slotForText}
        />
      )}
    </div>
  )
}

const PhraseContent = ({
  className,
  contentRef,
  slotForText,
}: {
  className?: string
  contentRef?: RefObject<HTMLDivElement | null>
  slotForText: ReactNode
}) => {
  const renderedContent =
    typeof slotForText === 'string'
      ? hyphenateSync(slotForText, { minWordLength: 10 })
      : slotForText

  return (
    <div
      ref={contentRef}
      className={twMerge(
        'relative grid h-full w-full place-items-center',
        className,
      )}
    >
      {/* Project the full phrase plane away from the alarm, including wrapped lines. */}
      <div
        aria-hidden="true"
        className="
            text-bgColor
            pointer-events-none
            absolute
            inset-0
            grid
            origin-[50%_var(--phrase-shadow-origin-y,0px)]
            scale-[1.15]
            place-items-center
            blur-sm
          "
      >
        <div className="max-w-full p-3">{renderedContent}</div>
      </div>
      <div className="relative z-10 max-w-full p-3">{renderedContent}</div>
    </div>
  )
}
