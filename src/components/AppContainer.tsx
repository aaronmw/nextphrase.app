import { useAppContext } from "context"
import { ComponentPropsWithoutRef } from "react"
import { twMerge } from "tailwind-merge"

export const AppContainer = ({
  children,
  className,
  ...otherProps
}: ComponentPropsWithoutRef<"div">) => {
  const { state } = useAppContext()

  const { shouldRotateScreen } = state

  return (
    <div
      className={twMerge(
        `
          font-boogaloo
          grid
          h-screen
          w-screen
          rotate-0
          gap-3
          bg-appBackgroundColor
          p-3
          text-textColor
          transition-all
          duration-700
        `,
        shouldRotateScreen &&
          `
            rotate-180
          `,
        className,
      )}
      {...otherProps}
    >
      {children}
    </div>
  )
}
