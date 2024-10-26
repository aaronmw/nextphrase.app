import { useAppContext } from '@/components/AppContext'
import { ComponentProps, ElementType, TouchEvent } from 'react'
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
  onTouchStart,
  ...otherProps
}: StyledTextProps<T>) {
  const { sounds } = useAppContext()
  const Component = as || 'span'

  const classNamesForVariant = Array.isArray(variant)
    ? variant.map(v => classNames[v])
    : variant
      ? classNames[variant]
      : ``

  const isButton = Array.isArray(variant)
    ? variant.some(v => v.startsWith('button'))
    : variant?.startsWith('button')

  function handleTouchStart(event: TouchEvent) {
    sounds.playSound('spacebar-click')
    onTouchStart?.(event)
  }

  return (
    <Component
      className={twMerge(classNamesForVariant, className)}
      onTouchStart={isButton ? handleTouchStart : onTouchStart}
      {...otherProps}
    />
  )
}
