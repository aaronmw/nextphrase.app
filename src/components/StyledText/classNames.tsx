import { tw } from '@/lib/tw'
import { twMerge } from 'tailwind-merge'

const buttonClassNames = tw`
  inline-flex
  cursor-pointer
  items-center
  justify-center
  gap-1.5
  transition-all
  hover:scale-105
  disabled:pointer-events-none
  disabled:opacity-40
`

const headingClassNames = tw`
  font-display
  font-bold
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
      dark:text-[var(--tw-prose-invert-links)]
      [&_span]:ml-1
    `,
  ),

  'link.subtle': twMerge(
    buttonClassNames,
    `
      inline
      hover:underline
      [&_span]:ml-1
    `,
  ),

  'button.primary': twMerge(
    buttonClassNames,
    `
      js-button-primary
      rounded-md
      border-2
      border-brandColor
      bg-brandColor
      px-6
      py-3
      text-center
      text-sm
      font-semibold
      uppercase
      leading-none
      tracking-widest
      text-white
      sm:whitespace-nowrap
      dark:border-white
      dark:bg-white
      dark:text-brandColor
    `,
  ),

  'button.secondary': twMerge(
    buttonClassNames,
    `
      js-button-secondary
      relative
      z-10
      rounded-md
      border-2
      border-brandColor
      px-6
      py-3
      text-center
      text-sm
      font-semibold
      uppercase
      leading-none
      tracking-widest
      text-brandColor
      backdrop-blur-sm
      sm:whitespace-nowrap
      dark:border-white
      dark:text-white
    `,
  ),

  'button.icon': twMerge(
    buttonClassNames,
    `
      size-10
      rounded-full
      bg-shadedBgColor
      hover:bg-brandColor
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
    text-sm
    text-inherit
    hover:bg-textColor/15
    dark:text-white
  `,

  'footnote': tw`
    text-xs
    leading-relaxed
    text-fadedTextColor
    dark:text-fadedTextColorInDarkMode
  `,

  'h1': twMerge(
    headingClassNames,
    `
      text-5xl
      [&>strong]:font-normal
      [&>strong]:text-brandColor/60
    `,
  ),

  'h2': twMerge(
    headingClassNames,
    `
      text-4xl
      [&>strong]:font-normal
      [&>strong]:text-brandColor/60
    `,
  ),

  'h3': twMerge(
    headingClassNames,
    `
      text-3xl
      [&>strong]:font-normal
      [&>strong]:text-brandColor/60
    `,
  ),

  'h4': twMerge(
    headingClassNames,
    `
      font-body
      text-lg
    `,
  ),

  'superHeading': tw`
    text-xs
    font-bold
    uppercase
    tracking-[0.2em]
    text-teal-400
  `,

  'headingDecoratorCentered': tw`
    relative
    pb-6
    text-center
    after:absolute
    after:left-1/2
    after:top-full
    after:h-[4px]
    after:w-16
    after:-translate-x-1/2
    after:bg-accent-fuchsia
  `,

  'headingDecoratorLeft': tw`
    relative
    pb-6
    after:absolute
    after:left-0
    after:top-full
    after:h-[4px]
    after:w-16
    after:bg-accent-fuchsia
  `,

  'importantValue': tw`
    font-display
    text-5xl
    font-bold
    dark:text-white
  `,

  'importantValueLabel': tw`
    border-b-2
    pb-2
    text-xs
    uppercase
  `,

  'label': tw`
    text-sm
    text-fadedTextColor
  `,
}
