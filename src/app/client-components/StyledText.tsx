import { ComponentPropsWithoutRef, ElementType } from "react";
import { twMerge } from "tailwind-merge";

export { StyledText };

type StyledTextProps<T extends ElementType = "span"> =
  ComponentPropsWithoutRef<T> & {
    as?: T;
    variant: StyledTextVariant;
  };

type StyledTextVariant = keyof typeof classNamesByVariant;

const classNamesByVariant = {
  code: twMerge(`
    font-mono
    text-accentedTextColor
    dark:text-accentedTextColorInDarkMode
  `),
  faded: twMerge(`
    text-fadedTextColor/80
    dark:text-fadedTextColorInDarkMode/70
  `),
  footnote: twMerge(`
    text-xs
    text-fadedTextColor/80
    dark:text-fadedTextColorInDarkMode/70
  `),
  h1: twMerge(`
    text-3xl
    font-bold
  `),
  h2: twMerge(`
    text-2xl
    font-bold
  `),
  h3: twMerge(`
    text-xl
    font-bold
  `),
  h4: twMerge(`
    text-lg
    font-bold
  `),
  h5: twMerge(`
    text-md
    font-bold
  `),
  h6: twMerge(`
    text-sm
    font-bold
  `),
  label: twMerge(`
    text-fadedTextColor
    group-hover-[&.is-selected]/table-row:text-yellow-400
    group-[&.is-selected]/table-row:text-accentedTextColor
    dark:text-fadedTextColorInDarkMode
    dark:group-hover-[&.is-selected]/table-row:text-textColorInDarkMode/50
    dark:group-[&.is-selected]/table-row:text-appBackgroundColorInDarkMode/50
    sm:text-xs
  `),
  paragraph: twMerge(`
    max-w-prose
    text-base
  `),
};

const StyledText = <T extends ElementType = "span">({
  as,
  children,
  className,
  variant,
  ...otherProps
}: StyledTextProps<T>) => {
  const Component = as ?? "span";

  return (
    <Component
      className={twMerge(
        `
          text-textColor
          dark:text-textColorInDarkMode
        `,
        variant ? classNamesByVariant[variant] : "",
        className
      )}
      {...otherProps}
    >
      {children}
    </Component>
  );
};
