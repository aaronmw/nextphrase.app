import { ComponentPropsWithRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { commonStyles } from "./commonStyles";

export const RadioButton = forwardRef<
  HTMLInputElement,
  ComponentPropsWithRef<"input">
>(({ className, ...otherProps }, ref) => (
  <input
    className={twMerge(
      commonStyles,
      `
        rounded-full
      `,
      className
    )}
    ref={ref}
    type="radio"
    {...otherProps}
  />
));
