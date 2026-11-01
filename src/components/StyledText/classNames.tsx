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
  disabled:pointer-events-none
  disabled:opacity-40
  [&:is(:active,[data-pressed])]:scale-95
  [&:is(:active,[data-pressed])]:duration-0
  [&:is(:active,[data-pressed])]:before:opacity-100
  [&:is(:active,[data-pressed])]:before:duration-0
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

  // Legacy surface for the custom scoring controls, not ordinary UI buttons.
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
      pt-[0.3125rem]
      pb-[0.1875rem]
      text-center
      text-xs
      leading-none
      tracking-tighter
      whitespace-nowrap
      uppercase
    `,
  ),

  'label': tw`
    text-fadedTextColor
    text-xs
    leading-[1.5rem]
  `,
}
