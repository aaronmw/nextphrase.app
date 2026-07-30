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
  const releaseSoundCleanupRef = useRef<(() => void) | null>(null)

  const classNamesForVariant = Array.isArray(variant)
    ? variant.map(v => classNames[v])
    : variant
      ? classNames[variant]
      : ``

  const isButton = Array.isArray(variant)
    ? variant.some(v => v.startsWith('button'))
    : variant?.startsWith('button')

  useEffect(
    () => () => {
      releaseSoundCleanupRef.current?.()
    },
    [],
  )

  function handlePointerDown(event: PointerEvent) {
    const isPrimaryPress =
      event.isPrimary && (event.pointerType !== 'mouse' || event.button === 0)

    if (isPrimaryPress && !releaseSoundCleanupRef.current) {
      const { pointerId } = event

      sounds.playSound('spacebar-down')

      const finishPress = (releaseEvent: globalThis.PointerEvent) => {
        if (releaseEvent.pointerId !== pointerId) return

        releaseSoundCleanupRef.current?.()
        sounds.playSound('spacebar-up')
      }

      const cleanup = () => {
        window.removeEventListener('pointerup', finishPress, true)
        window.removeEventListener('pointercancel', finishPress, true)
        releaseSoundCleanupRef.current = null
      }

      releaseSoundCleanupRef.current = cleanup
      window.addEventListener('pointerup', finishPress, true)
      window.addEventListener('pointercancel', finishPress, true)
    }

    onPointerDown?.(event)
  }

  return (
    <Component
      className={twMerge(classNamesForVariant, className)}
      onPointerDown={isButton ? handlePointerDown : onPointerDown}
      {...otherProps}
    />
  )
}
