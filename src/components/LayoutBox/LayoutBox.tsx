import { ComponentProps, ElementType } from 'react'
import { twMerge } from 'tailwind-merge'

type LayoutBoxProps<T extends ElementType = 'div'> = ComponentProps<T> & {
  as?: T
}

export function LayoutBox<T extends ElementType = 'div'>({
  children,
  as,
  className,
  ...otherProps
}: LayoutBoxProps<T>) {
  const Component = String(as || 'div') as ElementType

  return (
    <Component
      className={twMerge(
        ``,
        className,
      )}
      {...otherProps}
    >
      {children}
    </Component>
  )
}
