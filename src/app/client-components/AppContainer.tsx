"use client";

import { AppHeader } from "@/app/client-components/AppHeader";
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
        overflow-auto
        bg-appBackgroundColor
        text-appForegroundColor
        dark:bg-appBackgroundColorInDarkMode
        dark:text-appForegroundColorInDarkMode
      `,
      className
    )}
    {...otherProps}
  >
    <AppHeader />

    <div
      className="
        relative
        h-full
        w-full
        overflow-y-auto
      "
    >
      {children}
    </div>
  </div>
);
