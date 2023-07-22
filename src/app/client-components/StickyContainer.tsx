import { useMultipleRefs } from "@/hooks/useMultipleRefs";
import { getScrollingParent } from "@/utilities/getScrollingParent";
import { ComponentPropsWithoutRef, forwardRef, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

interface StickyContainerProps extends ComponentPropsWithoutRef<"div"> {
  edge?: "top" | "bottom";
  isStuck?: boolean;
}

const StickyContainer = forwardRef<HTMLDivElement, StickyContainerProps>(
  (
    { children, className, edge = "top", isStuck = false, ...otherProps },
    ref
  ) => {
    const innerRef = useRef<HTMLDivElement>(null);

    const refs = useMultipleRefs(ref, innerRef);

    useEffect(() => {
      const element = innerRef.current;

      if (!element || isStuck) {
        return;
      }

      const scrollingParent = getScrollingParent(element);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.map((entry) => {
            element.classList.toggle("is-stuck", entry.intersectionRatio < 1);
          });
        },
        { root: scrollingParent, threshold: 1 }
      );

      observer.observe(element);

      return () => {
        observer.unobserve(element);
      };
    }, [isStuck]);

    return (
      <div
        className={twMerge(
          edge === "top" ? "top-[-0.05px]" : "bottom-[-0.05px]",
          isStuck && "is-stuck",
          `
            group/stickyContainer
            sticky
            transition-all
          `,
          className
        )}
        ref={refs}
        {...otherProps}
      >
        <div
          className={twMerge(
            edge === "top" ? "top-full" : "bottom-full",
            `
              pointer-events-none
              absolute
              left-0
              right-0
              w-full
              overflow-hidden
              opacity-0
              transition-opacity
              group-[&.is-stuck]/stickyContainer:opacity-100
            `
          )}
        >
          <div
            className={twMerge(
              edge === "top" ? "-translate-y-full" : "translate-y-full",
              edge === "top"
                ? "group-[&.is-stuck]/stickyContainer:-translate-y-1/2"
                : "group-[&.is-stuck]/stickyContainer:translate-y-1/2",
              `
                h-4
                w-full
                bg-radial-gradient
                from-neutral-900/30
                transition-all
                duration-500
              `
            )}
          />
        </div>

        {children}
      </div>
    );
  }
);

StickyContainer.displayName = "StickyContainer";

export { StickyContainer };
