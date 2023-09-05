"use client"

import { Icon } from "@/app/client-components/Icon"
import { useAppContext } from "@/app/context"
import { TeamName } from "@/app/types"
import range from "lodash/range"
import { ComponentPropsWithoutRef } from "react"
import { twMerge } from "tailwind-merge"

export { Points }
export type { PointsProps }

interface PointsProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  team: TeamName
}

const Points = ({ className, team, ...otherProps }: PointsProps) => {
  const { state } = useAppContext()

  const { pointsToWin } = state

  const points = state[`pointsFor${team}`]

  return (
    <div
      className={twMerge(
        `
          flex
          text-[16px]
        `,
        team === "A" && "flex-row-reverse",
        className,
      )}
      {...otherProps}
    >
      {range(pointsToWin).map((point) => {
        const isPoint = point < points

        return (
          <Icon
            className={twMerge(
              isPoint ? "text-fadedTextColor/50" : "text-red-500",
            )}
            key={point}
            name={isPoint ? "skull-crossbones" : "heart"}
          />
        )
      })}
    </div>
  )
}
