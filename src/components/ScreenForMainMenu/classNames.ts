import { tw } from '@/lib/tw'

export const classNames = {
  logoContainer: tw`
    js-intro-logo
    fixed
    top-1/3
    left-1/2
    aspect-square
    size-[70vmin]
    -translate-x-1/2
    -translate-y-2/3
  `,
  logo: tw`
    h-full
    w-full
  `,
  mainContainer: tw`
    js-main-menu-actions
    fixed
    top-2/3
    left-1/2
    flex
    -translate-x-1/2
    -translate-y-1/3
    flex-col
    gap-1
  `,
  continueButton: tw`
    js-continue-button
    relative
    mb-5
  `,
  scoreContainer: tw`
    divide-neutralColor-100
    border-neutralColor-100
    absolute
    top-full
    left-1/2
    flex
    -translate-x-1/2
    -translate-y-0.5
    items-center
    justify-center
    divide-x-4
    overflow-hidden
    rounded-full
    border-4
    text-xs
  `,
  teamAScore: tw`
    bg-teamAFillColor
    text-textOnTeamAColor
    px-2
  `,
  teamBScore: tw`
    bg-teamBFillColor
    text-textOnTeamBColor
    px-2
  `,
}
