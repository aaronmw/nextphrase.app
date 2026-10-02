'use client'

import { useAppContext } from '@/components/AppContext'
import {
  ComponentProps,
  ElementType,
  PointerEvent,
  useEffect,
  useRef,
} from 'react'
import { twMerge } from 'tailwind-merge'
import { classNames } from './classNames'

type StyledTextVariant = keyof typeof classNames

export type StyledTextProps<T extends ElementType = 'span'> = Omit<
  ComponentProps<T>,
  'variant'
> & {
  as?: T
  variant?: StyledTextVariant | StyledTextVariant[]
}

export function StyledText<T extends ElementType = 'span'>({
  as,
  className,
  variant,
  onPointerDown,
  ...otherProps
}: StyledTextProps<T>) {
  const { sounds } = useAppContext()
  const Component = as || 'span'
  const pressCleanupRef = useRef<(() => void) | null>(null)

  const classNamesForVariant = Array.isArray(variant)
    ? variant.map(v => classNames[v])
    : variant
      ? classNames[variant]
      : ``

  const isButton = Array.isArray(variant)
    ? variant.some(v => v.startsWith('button'))
    : variant?.startsWith('button')
  const hasPressFeedback =
    isButton ||
    (Array.isArray(variant) ? variant.includes('link') : variant === 'link')

  useEffect(
    () => () => {
      pressCleanupRef.current?.()
    },
    [],
  )

  function handlePointerDown(event: PointerEvent) {
    const isPrimaryPress =
      event.isPrimary && (event.pointerType !== 'mouse' || event.button === 0)

    if (isPrimaryPress && !pressCleanupRef.current) {
      const { pointerId } = event
      const pressedElement = event.currentTarget

      // Chrome delays touch :active, so the pointer event owns press feedback.
      pressedElement.setAttribute('data-pressed', '')
      if (isButton) sounds.playSound('spacebar-down')

      const finishPress = (releaseEvent: globalThis.PointerEvent) => {
        if (releaseEvent.pointerId !== pointerId) return

        pressCleanupRef.current?.()
        if (isButton) sounds.playSound('spacebar-up')
      }

      const cleanup = () => {
        window.removeEventListener('pointerup', finishPress, true)
        window.removeEventListener('pointercancel', finishPress, true)
        window.removeEventListener('blur', cleanup)
        pressedElement.removeAttribute('data-pressed')
        pressCleanupRef.current = null
      }

      pressCleanupRef.current = cleanup
      window.addEventListener('pointerup', finishPress, true)
      window.addEventListener('pointercancel', finishPress, true)
      window.addEventListener('blur', cleanup)
    }

    onPointerDown?.(event)
  }

  return (
    <Component
      className={twMerge(classNamesForVariant, className)}
      onPointerDown={hasPressFeedback ? handlePointerDown : onPointerDown}
      {...otherProps}
    />
  )
}
