import { ComponentProps, forwardRef, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface DoubleDeckerLabelProps extends ComponentProps<"div"> {
  label: ReactNode;
  subLabel?: ReactNode;
}

const DoubleDeckerLabel = forwardRef<HTMLDivElement, DoubleDeckerLabelProps>(
  ({ className, label, subLabel, ...otherProps }, ref) => {
    return (
      <div
        className={twMerge(`flex flex-col gap-0`, className)}
        ref={ref}
        {...otherProps}
      >
        <div className="break-all">{label}</div>

        {subLabel && (
          <div
            className="
              text-xs
              text-neutral-400
              ui-active:text-neutral-300
            "
          >
            {subLabel}
          </div>
        )}
      </div>
    );
  }
);

DoubleDeckerLabel.displayName = "DoubleDeckerLabel";

export { DoubleDeckerLabel };
