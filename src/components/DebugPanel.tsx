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
  return createPortal(
    <div
      className={twMerge(
        `
          fixed
          z-50
          bg-black
          p-1
          text-[12px]
          text-white
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
