import { ComponentPropsWithRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface SectionContainerProps extends ComponentPropsWithRef<"section"> {}

const SectionContainer = forwardRef<HTMLDivElement, SectionContainerProps>(
  ({ children, className, ...otherProps }, ref) => {
    return (
      <section
        className={twMerge(
          `
            container
            mx-auto
            flex
            flex-col
            gap-6
          `,
          className
        )}
        ref={ref}
        {...otherProps}
      >
        {children}
      </section>
    );
  }
);

SectionContainer.displayName = "SectionContainer";

export { SectionContainer };
