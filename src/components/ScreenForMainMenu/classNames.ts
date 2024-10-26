import { tw } from '@/lib/tw'

export const classNames = {
  logoContainer: tw`
    fixed
    left-1/2
    top-1/3
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
    fixed
    left-1/2
    top-2/3
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
    absolute
    left-1/2
    top-full
    flex
    -translate-x-1/2
    -translate-y-0.5
    items-center
    justify-center
    divide-x-4
    divide-white
    overflow-hidden
    rounded-full
    border-4
    border-white
    text-xs
  `,
  teamAScore: tw`
    bg-teamAColor-500
    px-2
  `,
  teamBScore: tw`
    bg-teamBColor-500
    px-2
  `,
}
