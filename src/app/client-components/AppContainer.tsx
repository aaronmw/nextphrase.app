"use client";

import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export const AppContainer = ({
  children,
  className,
  ...otherProps
}: ComponentPropsWithoutRef<"div">) => (
  <div
    className={twMerge(
      `
        flex
        h-screen
        w-screen
        flex-col
        justify-stretch
        bg-appBackgroundColor
        text-appForegroundColor
      `,
      className
    )}
    {...otherProps}
  >
    {children}
  </div>
);
