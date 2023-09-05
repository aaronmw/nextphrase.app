import { ComponentPropsWithoutRef, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export const OptionGroup = ({
  children,
  className,
  label,
  ...otherProps
}: ComponentPropsWithoutRef<"div"> & {
  label: ReactNode;
}) => {
  return (
    <div
      className={twMerge(
        `
          flex
          flex-col
          gap-3
          [&+&]:mt-6
          [&+&]:border-t
          [&+&]:border-t-borderColor
          [&+&]:pt-6
        `,
        className
      )}
      {...otherProps}
    >
      <div
        className="
          text-xl
          font-bold
          text-fadedTextColor
          opacity-60
        "
      >
        {label}
      </div>

      {children}
    </div>
  );
};
