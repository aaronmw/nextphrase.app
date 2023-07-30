import { twMerge } from "tailwind-merge";

export { classNamesByVariant };

const commonClassNames = twMerge(`
  text-textColor
  focus:outline-accentedTextColor
  dark:text-textColorInDarkMode
  inline-flex
  cursor-pointer
  items-center
  justify-center
  gap-1.5
  transition-all
  disabled:pointer-events-none
  disabled:opacity-30
`);

const baseButtonClassNames = twMerge(`
  w-fit
  flex-grow-0
  rounded
  px-4
  py-2
  transition-all
  hover:scale-105
  group-[&.is-stuck]/stickyContainer:px-4
  group-[&.is-stuck]/stickyContainer:py-2
`);

const classNamesByVariant = {
  "link": twMerge(
    commonClassNames,
    `
      gap-0.5
      font-bold
      text-brandColor
      underline
      underline-offset-2
      transition-all
      hover:text-brandColor
      hover:underline-offset-4
      dark:text-brandColor
    `
  ),

  "link--subtle": twMerge(
    commonClassNames,
    `
      text-textColor/60
      dark:text-textColorInDarkMode/60
      gap-0.5
      underline
      underline-offset-2
      transition-all
      hover:text-brandColor
      hover:underline-offset-4
    `
  ),

  "primary": twMerge(
    commonClassNames,
    baseButtonClassNames,
    `
      font-display
      bg-brandColor
      font-bold
      text-white
    `
  ),

  "secondary": twMerge(
    commonClassNames,
    baseButtonClassNames,
    `
      font-display
      border-2
      border-transparent
      font-bold
      text-brandColor
      hover:border-brandColor
    `
  ),

  "toolbar": twMerge(
    commonClassNames,
    `
      font-display
      text-textColor
      dark:text-textColorInDarkMode
      dark:hover:bg-shadedColorInDarkMode/20
      rounded-md
      p-2
      hover:bg-shadedColor/20
    `
  ),

  "unstyled": commonClassNames,
};
