import { ComponentProps, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface AppHeaderProps extends Omit<ComponentProps<'header'>, 'children'> {
  leftSlot?: ReactNode
  centerSlot?: ReactNode
  rightSlot?: ReactNode
}

export function AppHeader({
  className,
  leftSlot,
  centerSlot,
  rightSlot,
  ...otherProps
}: AppHeaderProps) {
  return (
    <header
      className={twMerge(
        `
          absolute
          inset-0
          grid
          grid-cols-[1fr,auto,1fr]
          content-center
          items-center
          px-3
          text-center
          text-xs
        `,
        className,
      )}
      {...otherProps}
    >
      <div
        className="
          js-header-button-left
          justify-self-start
        "
      >
        {leftSlot}
      </div>

      <div
        className="
          js-header-title
        "
      >
        {centerSlot}
      </div>

      <div
        className="
          js-header-button-right
          justify-self-end
        "
      >
        {rightSlot}
      </div>
    </header>
  )
}
