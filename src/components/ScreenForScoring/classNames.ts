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
    text-4xl
  `,
  pointButtonTeamA: tw`
    border-teamAFillColor
    bg-teamAFillColor
    text-textOnTeamAColor
    col-start-1
    col-end-2
    rounded-tl-xl
  `,
  pointButtonTeamB: tw`
    border-teamBFillColor
    bg-teamBFillColor
    text-textOnTeamBColor
    col-start-2
    col-end-3
    rounded-tr-xl
  `,
  startButton: ({ activeTeam }: { activeTeam: 'A' | 'B' }) =>
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
      activeTeam === 'A'
        ? `
          border-teamAFillColor
          bg-teamAFillColor
          text-textOnTeamAColor
        `
        : `
          border-teamBFillColor
          bg-teamBFillColor
          text-textOnTeamBColor
        `,
    ),
}
