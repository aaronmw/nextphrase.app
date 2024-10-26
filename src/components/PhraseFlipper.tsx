'use client'

import { useAppContext } from '@/components/AppContext'
import { Icon } from '@/components/Icon'
import { hyphenateSync } from 'hyphen/en'
import { ComponentProps, ReactNode, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface PhraseFlipperProps extends Omit<ComponentProps<'div'>, 'children'> {
  duration?: number
}

export function PhraseFlipper({
  className,
  duration = 250,
  ...otherProps
}: PhraseFlipperProps) {
  const {
    state: { currentPhraseId, freezeDuration, phrasesById },
    dispatch,
  } = useAppContext()
  const containerElementRef = useRef<HTMLDivElement>(null)
  const [isFrozen, setIsFrozen] = useState(false)
  const currentPhrase = currentPhraseId
    ? String(phrasesById.get(currentPhraseId))
    : '...'

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

      setTimeout(() => {
        dispatch({ type: 'NEXT_PHRASE' })

        setIsFrozen(true)
        setTimeout(() => {
          setIsFrozen(false)
        }, freezeDuration)

        containerElement.scrollTo({ left: 0, behavior: 'instant' })
        containerElement.style.opacity = '1'
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
      style={{
        transitionDuration: `${duration}ms`,
      }}
      onScroll={handleScroll}
      {...otherProps}
    >
      <PhraseContainer slotForText={currentPhrase} />
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
}

const PhraseContainer = ({
  slotForText,
  slotForNodes,
}: {
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
        uppercase
        leading-none
      "
    >
      {slotForNodes}

      <div className="relative">
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
