"use client";

import { FieldLabelContext } from "@/app/client-components/FieldLabel";
import { ComponentPropsWithRef, forwardRef, useContext } from "react";
import { twMerge } from "tailwind-merge";

export interface InputProps
  extends Omit<ComponentPropsWithRef<"input">, "children"> {}

export const inputClassNames = twMerge(`
  inline-block
  w-full
  flex-grow
  rounded
  border
  border-borderColor
  bg-white
  px-3
  py-1.5
  text-appForegroundColor
  shadow-inner
  placeholder:text-fadedTextColor
  focus:border-borderColor
  focus:outline-offset-2
  focus:outline-accentColor
  focus:ring-transparent
  disabled:pointer-events-none
  disabled:bg-shadedColor
  disabled:text-fadedTextColor
  dark:border-borderColorInDarkMode
  dark:bg-shadedColorInDarkMode
  dark:text-appForegroundColorInDarkMode
  dark:[color-scheme:dark]
  dark:disabled:bg-shadedColorInDarkMode
  dark:disabled:text-fadedTextColorInDarkMode
`);

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...otherProps }, ref) => {
    const { required } = useContext(FieldLabelContext);

    return (
      <input
        className={twMerge(inputClassNames, className)}
        ref={ref}
        required={required}
        {...otherProps}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
