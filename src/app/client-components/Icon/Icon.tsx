import { IconProps } from "@/app/client-components/Icon/types";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const Icon = forwardRef<HTMLSpanElement, IconProps>(
  (
    { className, name, spin = false, variant = "regular", ...otherProps },
    ref
  ) => (
    <span
      className={twMerge(`!no-underline`, className)}
      ref={ref}
      {...otherProps}
    >
      <i
        className={twMerge(
          `
            fa
            fa-fw
            fa-${variant}
            fa-${name}
          `,
          spin && "fa-spin"
        )}
      />
    </span>
  )
);

Icon.displayName = "Icon";

export { Icon };
