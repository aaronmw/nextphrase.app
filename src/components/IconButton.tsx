import { Icon } from "components/Icon"
import { IconName, IconVariant } from "components/Icon/types"
import { ComponentPropsWithoutRef } from "react"
import { twMerge } from "tailwind-merge"

export { IconButton }
export type { IconButtonProps }

interface IconButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children"> {
  icon: IconName
  iconVariant?: IconVariant
}

const IconButton = ({
  className,
  icon,
  iconVariant = "regular",
  ...otherProps
}: IconButtonProps) => {
  return (
    <button
      className={twMerge(
        `
          cursor-pointer
        `,
        className,
      )}
      {...otherProps}
    >
      <Icon
        name={icon}
        variant={iconVariant}
      />
    </button>
  )
}
