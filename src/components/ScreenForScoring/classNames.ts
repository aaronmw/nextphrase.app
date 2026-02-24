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
    gap-3
  `,
  scoreCardTeamA: tw`
    js-score-card-a
    col-start-1
    col-end-2
    row-start-1
    row-end-2
    rounded-tl-xl
  `,
  scoreCardTeamB: tw`
    js-score-card-b
    col-start-2
    col-end-3
    row-start-1
    row-end-2
    rounded-tr-xl
  `,
  startButton: ({ isNewGame = false }) =>
    twMerge(
      `
        js-start-button
        col-start-1
        col-end-3
        row-start-2
        row-end-4
        rounded-t-xl
        rounded-b-xl
        text-4xl
        transition-all
      `,
      !isNewGame &&
        `
          delay-1000
        `,
    ),
}
