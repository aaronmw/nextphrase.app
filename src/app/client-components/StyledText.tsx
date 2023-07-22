import { ComponentPropsWithoutRef, ElementType, forwardRef, Ref } from "react";
import { twMerge } from "tailwind-merge";

export { StyledText };

type StyledTextProps<T extends ElementType = "span"> =
  ComponentPropsWithoutRef<T> & {
    as?: T;
    variant: StyledTextVariant;
  };

type StyledTextVariant = keyof typeof styledTextVariantClassNames;

const styledTextVariantClassNames = {
  code: `
    text-accentColor-500
    dark:text-accentColor-400
    font-mono
  `,
  footnote: `
    text-xs
    text-fadedTextColor
  `,
  h1: `
    text-3xl
    font-bold
  `,
  h2: `
    text-2xl
    font-bold
  `,
  h3: `
    text-xl
    font-bold
  `,
  h4: `
    text-lg
    font-bold
  `,
  h5: `
    text-md
    font-bold
  `,
  h6: `
    text-sm
    font-bold
  `,
  label: `
    text-xs
    text-fadedTextColor
    dark:text-fadedTextColorInDarkMode
  `,
  paragraph: `
    text-base
    max-w-prose
  `,
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
          text-appForegroundColor
          dark:text-appForegroundColorInDarkMode
        `,
        variant ? styledTextVariantClassNames[variant] : "",
        className
      )}
      {...otherProps}
    >
      {children}
    </Component>
  );
};
