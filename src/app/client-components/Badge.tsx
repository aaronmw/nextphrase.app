import { ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface BadgeProps extends ComponentProps<"var"> {}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, className, ...otherProps }, ref) => {
    return (
      <var
        className={twMerge(
          `
            bg-highlightColor
            rounded-full
            px-2
            py-px
            text-xs
            not-italic
          `,
          className
        )}
        ref={ref}
        {...otherProps}
      >
        {children}
      </var>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
