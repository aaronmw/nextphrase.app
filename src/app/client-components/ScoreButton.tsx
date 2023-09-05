"use client"

import { Icon } from "@/app/client-components/Icon"
import { useAppContext } from "@/app/context"
import { TeamName } from "@/app/types"
import {
  ComponentPropsWithoutRef,
  MouseEventHandler,
  useEffect,
  useState,
} from "react"
import { twMerge } from "tailwind-merge"

export { ScoreButton }
export type { ScoreButtonProps }

interface ScoreButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children"> {
  team: TeamName
}

const ScoreButton = ({ className, team, ...otherProps }: ScoreButtonProps) => {
  const { dispatch, sounds, state } = useAppContext()

  const [didScoreChange, setDidScoreChange] = useState(false)

  const handleClick: MouseEventHandler = () => {
    dispatch({
      type: "addPoint",
      payload: {
        team,
      },
    })

    setDidScoreChange(true)

    setTimeout(() => {
      setDidScoreChange(false)
    }, 3000)
  }

  return (
    <button
      className={twMerge(
        `
          flex
          h-full
          w-full
          items-center
          justify-center
          rounded-md
          text-4xl
          font-bold
        `,
        team === "A"
          ? `
            bg-teamAColor-500
          `
          : `
            bg-teamBColor-500
          `,
        className,
      )}
      onClick={handleClick}
      {...otherProps}
    >
      {didScoreChange ? <Icon name="skull-crossbones" /> : team}
    </button>
  )
}
