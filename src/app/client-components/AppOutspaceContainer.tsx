import { ComponentPropsWithoutRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";

export const AppOutspaceContainer = ({
  children,
  className,
  ...otherProps
}: ComponentPropsWithoutRef<"div">) => {
  useEffect(() => {
    document.body.classList.add("dark");
  }, []);

  return (
    <div
      className={twMerge(
        `
          dark:text-appForegroundColorInDarkMode
          flex
          h-screen
          w-screen
          flex-col
          items-center
          justify-center
          gap-6
          overflow-y-auto
          bg-radial-gradient
          from-neutral-800
          to-neutral-950
          text-appForegroundColor
        `,
        className
      )}
      {...otherProps}
    >
      {children}
    </div>
  );
};
