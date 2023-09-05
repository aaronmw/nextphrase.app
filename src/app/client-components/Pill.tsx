import { ComponentPropsWithoutRef } from "react"
import { twMerge } from "tailwind-merge"

export { Pill }
export type { PillProps }

interface PillProps extends ComponentPropsWithoutRef<"span"> {
  variant: keyof typeof classNamesByVariant
}

const classNamesByVariant = {
  buttonForTeamA: twMerge(`
    bg-teamAColor-500
  `),
  buttonForTeamB: twMerge(`
    bg-teamBColor-500
  `),
  startButton: twMerge(`
  `),
}

const Pill = ({ children, className, variant, ...otherProps }: PillProps) => {
  return (
    <span
      className={twMerge(
        `
          rounded-full
          px-2
          font-bold
        `,
        classNamesByVariant[variant],
        className,
      )}
      {...otherProps}
    >
      {children}
    </span>
  )
}
