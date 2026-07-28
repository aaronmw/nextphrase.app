'use client'

import { ComponentProps } from 'react'
import { createPortal } from 'react-dom'
import { twMerge } from 'tailwind-merge'

interface DebugPanelProps extends ComponentProps<'div'> {}

export function DebugPanel({
  className,
  children,
  ...otherProps
}: DebugPanelProps) {
  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      className={twMerge(
        `
          text-neutralColor-100
          fixed
          z-50
          bg-black
          p-1
          text-[12px]
        `,
        className,
      )}
      {...otherProps}
    >
      {children}
    </div>,
    document.body,
  )
}
