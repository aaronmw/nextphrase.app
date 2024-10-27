import { tw } from '@/lib/tw'
import { twMerge } from 'tailwind-merge'

export const classNames = {
  mainContainer: tw`
    absolute
    inset-3
    top-0
    grid
    grid-cols-2
    grid-rows-3
    gap-1
  `,
  pointButton: tw`
    js-point-button
    row-start-1
    row-end-2
    border-teamAColor-500
    bg-teamAColor-500
    text-4xl
  `,
  pointButtonTeamA: tw`
    col-start-1
    col-end-2
    rounded-tl-xl
    border-teamAColor-500
    bg-teamAColor-500
  `,
  pointButtonTeamB: tw`
    col-start-2
    col-end-3
    rounded-tr-xl
    border-teamBColor-500
    bg-teamBColor-500
  `,
  startButton: ({ isNewGame = false, isRoundOver = false }) =>
    twMerge(
      `
        js-start-button
        col-start-1
        col-end-3
        row-start-2
        row-end-4
        rounded-b-xl
        text-4xl
        transition-all
      `,
      isRoundOver &&
        `
          pointer-events-none
          opacity-50
          delay-0
        `,
      !isNewGame &&
        `
          delay-1000
        `,
    ),
}
