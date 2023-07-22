"use client";

import { useAppContext } from "@/app/context";
import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export { AppHeader };

interface AppHeaderProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {}

const AppHeader = ({ className, ...otherProps }: AppHeaderProps) => {
  const { dispatch: dispatchAppAction, state: appState } = useAppContext();

  return (
    <div
      className={twMerge(
        `
          flex
          justify-between
          bg-brandColor
          px-6
          py-3
          text-white
        `,
        className
      )}
      {...otherProps}
    >
      AppHeader.tsx
    </div>
  );
};
