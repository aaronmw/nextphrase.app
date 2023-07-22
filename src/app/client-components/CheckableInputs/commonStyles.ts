import { twMerge } from "tailwind-merge";

export const commonStyles = twMerge(`
  border-borderColor
  bg-appBackgroundColor
  shadow-inner
  checked:border-none
  checked:bg-accentColor
  checked:text-accentColor
  checked:shadow-none
  focus:ring-accentColor
  ui-checked:border-none
  ui-checked:bg-accentColor
  ui-checked:text-accentColor
  ui-checked:shadow-none
  dark:border-borderColorInDarkMode
  dark:bg-appBackgroundColorInDarkMode
  dark:checked:border-none
  dark:checked:bg-accentColor
  dark:checked:text-accentColor
  dark:ui-checked:border-none
  dark:ui-checked:bg-accentColor
  dark:ui-checked:text-accentColor
`);
