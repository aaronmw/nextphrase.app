import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface LogoArrowSpriteProps extends Omit<ComponentProps<'svg'>, 'children'> {
  team: 'A' | 'B'
}

export function LogoArrowSprite({
  className,
  team,
  ...otherProps
}: LogoArrowSpriteProps) {
  return (
    <svg
      className={twMerge('', className)}
      width="475"
      height="419"
      viewBox="0 0 475 419"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      {team === 'B' ? (
        <>
          <path
            d="M351.204 231.381L296.49 27.1887L420.936 102.526L351.204 231.381Z"
            className="fill-teamBFillColor"
          />
          <path
            d="M64.2672 142.246L347.928 66.239L374.845 166.695L44.4982 255.211L64.2672 142.246Z"
            className="fill-teamBFillColor"
          />
        </>
      ) : (
        <path
          d="M158.203 332.962L172.144 384.992L47.3262 308.266L117.431 180.8L131.148 231.994L442.693 148.516L428.104 260.643L158.203 332.962Z"
          className="fill-teamAFillColor"
        />
      )}
    </svg>
  )
}
