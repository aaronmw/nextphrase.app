import { tw } from '@/lib/tw'
import { twMerge } from 'tailwind-merge'

const buttonClassNames = tw`
  relative
  inline-flex
  cursor-pointer
  select-none
  items-center
  justify-center
  gap-1.5
  transition-all
  [-webkit-user-select:none]
  [text-shadow:2px_2px_2px_rgba(0,0,0,0.25)]
  before:pointer-events-none
  before:absolute
  before:inset-0
  before:bg-gradient-to-t
  before:from-bgColor/20
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
      hover:underline-offset-8
      hover:scale-100
      [&_span]:ml-1
    `,
  ),

  'button.primary': twMerge(
    buttonClassNames,
    `
      js-button-primary
      w-full
      whitespace-nowrap
      rounded-sm
      border-4
      border-primaryColor-500
      bg-primaryColor-500
      px-3
      py-1
      text-center
      text-xs
      uppercase
      leading-none
      tracking-tighter
      text-white
    `,
  ),

  'button.secondary': twMerge(
    buttonClassNames,
    `
      js-button-secondary
      relative
      z-10
      w-full
      whitespace-nowrap
      rounded-sm
      border-4
      border-primaryColor-400/40
      px-3
      py-1
      text-center
      text-xs
      uppercase
      leading-none
      tracking-tighter
      text-primaryColor-400
      backdrop-blur-sm
    `,
  ),

  'button.icon': twMerge(
    buttonClassNames,
    `
      hover:bg-primaryColor
      size-10
      rounded-none
      bg-shadedBgColor
      text-xs
      hover:text-white
    `,
  ),

  'button.tool': tw`
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
    hover:bg-textColor/15
  `,

  'label': tw`
    text-xs
    text-fadedTextColor
  `,
}
