import { ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface EmptyContainerProps extends ComponentProps<"div"> {}

const EmptyContainer = forwardRef<HTMLDivElement, EmptyContainerProps>(
  ({ children, className, ...otherProps }, ref) => (
    <div
      className={twMerge(
        `
          bg-shadedColor
          dark:bg-shadedColorInDarkMode
          flex
          flex-grow
          items-center
          justify-center
          rounded-md
          border-2
          border-dashed
          border-borderColor
          py-6
          text-center
          text-xs
          text-fadedTextColor
          dark:border-borderColorInDarkMode
          dark:text-fadedTextColorInDarkMode
        `,
        className
      )}
      ref={ref}
      {...otherProps}
    >
      {children}
    </div>
  )
);

EmptyContainer.displayName = "EmptyContainer";

export { EmptyContainer };
