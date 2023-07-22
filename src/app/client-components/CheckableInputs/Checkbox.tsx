import { ComponentPropsWithRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { commonStyles } from "./commonStyles";

export const Checkbox = forwardRef<
  HTMLInputElement,
  ComponentPropsWithRef<"input">
>(({ className, ...otherProps }, ref) => (
  <input
    className={twMerge(
      commonStyles,
      `
        rounded-sm
        indeterminate:bg-accentColor
        indeterminate:text-accentColor
        indeterminate:shadow-none
        dark:indeterminate:border-none
        dark:indeterminate:bg-accentColor
        dark:indeterminate:text-accentColor
      `,
      className
    )}
    ref={ref}
    type="checkbox"
    {...otherProps}
  />
));
