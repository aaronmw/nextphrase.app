import { ComponentPropsWithoutRef } from "react"
import { twMerge } from "tailwind-merge"

export { ScreenContainer }
export type { ScreenContainerProps }

interface ScreenContainerProps extends ComponentPropsWithoutRef<"div"> {}

const ScreenContainer = ({
  children,
  className,
  ...otherProps
}: ScreenContainerProps) => {
  return (
    <div
      className={twMerge(
        `
          fixed
          left-0
          top-0
          h-screen
          w-screen
          transition-all
          duration-500
        `,
        className,
      )}
      {...otherProps}
    >
      {children}
    </div>
  )
}
