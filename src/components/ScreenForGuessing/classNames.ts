export const classNames = {
  button: `
    relative
    text-center
    text-xs
  `,
  lightsContainer: `
    pointer-events-none
    absolute
    left-1/2
    top-1/2
    size-[200vmax]
    -translate-x-1/2
    -translate-y-1/2
    rounded-full
    overflow-hidden
  `,
  rotatingLight: `
    absolute
    inset-0
  `,
  flashingLight: `
    absolute
    inset-0
    mix-blend-overlay
    bg-gradient-radial
    from-amber-50
    to-transparent
  `,
  lightEdgeDarkener: `
    absolute
    inset-0
    bg-gradient-radial
    from-transparent
    to-bgColor
  `,
  spinningIcon: `
    aspect-square
    inline-block
    text-white
    rounded-full
    size-4
    relative
    z-10
  `,
  gotItButton: `
    w-fit
    text-2xl
    px-8
    py-3
    rounded-xl
  `,
  gotItButtonTeamA: `
    border-teamAColor-500
    bg-teamAColor-500
  `,
  gotItButtonTeamB: `
    border-teamBColor-500
    bg-teamBColor-500
  `,
  nextPhraseButton: `
    h-full
  `,
}
