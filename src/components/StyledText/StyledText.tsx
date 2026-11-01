'use client'

import { usePressFeedback } from '@/components/usePressFeedback'
import { ComponentProps, ElementType, PointerEvent } from 'react'
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
  const Component = as || 'span'

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

  const handlePress = usePressFeedback({ sound: Boolean(isButton) })

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    onPointerDown?.(event)
    if (!event.defaultPrevented) handlePress(event)
  }

  return (
    <Component
      className={twMerge(classNamesForVariant, className)}
      onPointerDown={hasPressFeedback ? handlePointerDown : onPointerDown}
      {...otherProps}
    />
  )
}
