"use client"

import { useAppContext } from "@/app/context"
import { ComponentPropsWithRef, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface TitleBarProps extends ComponentPropsWithRef<"header"> {
  contentInCenter?: ReactNode
  contentOnLeft?: ReactNode
  contentOnRight?: ReactNode
}

export const AppHeader = ({
  className,
  contentInCenter,
  contentOnLeft,
  contentOnRight,
  ...otherProps
}: TitleBarProps) => {
  const { state } = useAppContext()

  const { shouldRotateScreen } = state

  return (
    <header
      className={twMerge(
        `
          relative
          flex
          items-center
          justify-between
          gap-2
          text-fadedTextColor
          transition-all
        `,
        shouldRotateScreen && "pt-6",
        className,
      )}
      {...otherProps}
    >
      <div>{contentOnLeft}</div>
      <div className="font-bold">{contentInCenter}</div>
      <div>{contentOnRight}</div>
    </header>
  )
}
