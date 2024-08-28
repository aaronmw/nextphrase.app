'use client'

import { twMerge } from 'tailwind-merge'
import { IconProps } from './types'

export function Icon({
  className,
  name,
  rotate,
  spin = false,
  variant = 'regular',
  ...otherProps
}: IconProps) {
  return (
    <span
      className={twMerge(`!no-underline`, className)}
      {...otherProps}
    >
      <i
        className={twMerge(
          `
            fa
            fa-fw
            fa-${name}
          `,
          typeof rotate === 'string' && `fa-${rotate}`,
          typeof rotate === 'number' && `fa-rotate-${rotate}`,
          spin && `fa-spin`,
          variant.startsWith('sharp-')
            ? `
              fa-sharp
              fa-${variant.replace('sharp-', '')}
            `
            : `
              fa-${variant}
            `,
        )}
      />
    </span>
  )
}
