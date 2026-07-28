import { tw } from '@/lib/tw'
import { twMerge } from 'tailwind-merge'

const buttonClassNames = tw`
  before:from-bgColor/20
  relative
  inline-flex
  cursor-pointer
  items-center
  justify-center
  gap-1.5
  transition-all
  select-none
  [-webkit-user-select:none]
  [text-shadow:2px_2px_2px_rgba(0,0,0,0.25)]
  before:pointer-events-none
  before:absolute
  before:inset-0
  before:bg-gradient-to-t
  before:to-transparent
  before:opacity-0
  before:transition-opacity
  active:scale-95
  active:before:opacity-100
  disabled:pointer-events-none
  disabled:opacity-40
`

export const classNames = {
  'link': twMerge(
    buttonClassNames,
    `
      inline
      text-[var(--tw-prose-links)]
      underline
      underline-offset-4
      hover:scale-100
      hover:underline-offset-8
      [&_span]:ml-1
    `,
  ),

  'button.primary': twMerge(
    buttonClassNames,
    `
      js-button-primary
      border-accentFillColor
      bg-accentFillColor
      text-textOnAccentColor
      w-full
      rounded-sm
      border-4
      px-3
      py-1
      text-center
      text-xs
      leading-none
      tracking-tighter
      whitespace-nowrap
      uppercase
    `,
  ),

  'button.secondary': twMerge(
    buttonClassNames,
    `
      js-button-secondary
      border-primaryColor-400/40
      text-primaryColor-400
      relative
      z-10
      w-full
      rounded-sm
      border-4
      px-3
      py-1
      text-center
      text-xs
      leading-none
      tracking-tighter
      whitespace-nowrap
      uppercase
      backdrop-blur-sm
    `,
  ),

  'button.icon': twMerge(
    buttonClassNames,
    `
      hover:bg-primaryColor
      bg-shadedBgColor
      hover:text-neutralColor-100
      size-10
      rounded-none
      text-xs
    `,
  ),

  'button.tool': tw`
    hover:bg-textColor/15
    -my-0.5
    inline-flex
    items-center
    justify-center
    gap-2
    rounded-sm
    px-1
    py-0.5
    text-xs
    text-inherit
  `,

  'label': tw`
    text-fadedTextColor
    text-xs
    leading-[1.5rem]
  `,
}
