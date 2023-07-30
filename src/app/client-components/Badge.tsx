import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export { Badge };

interface BadgeProps extends ComponentProps<"var"> {
  variant?: keyof typeof classNamesByVariant;
}

const classNamesForAllVariants = twMerge(`
  rounded-full
  px-2
  py-px
  text-xs
  font-semibold
  not-italic
`);

const classNamesByVariant = {
  accented: twMerge(`
    bg-accentedBackgroundColor
    text-textColor
    dark:bg-accentedBackgroundColorInDarkMode
    dark:text-textColorInDarkMode
  `),
  neutral: twMerge(`
    bg-fadedTextColor
    text-appBackgroundColor
    dark:bg-fadedTextColorInDarkMode
    dark:text-appBackgroundColorInDarkMode
  `),
};

const Badge = ({
  children,
  className,
  variant = "neutral",
  ...otherProps
}: BadgeProps) => (
  <var
    className={twMerge(
      classNamesForAllVariants,
      classNamesByVariant[variant],
      className
    )}
    {...otherProps}
  >
    {children}
  </var>
);
