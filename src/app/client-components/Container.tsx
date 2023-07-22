import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export { Container };
export type { ContainerProps };

interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  variant?: keyof typeof classNamesByVariant;
}

const classNamesByVariant = {
  narrow: twMerge(`
    sm:max-w-screen-sm
    md:max-w-screen-md
  `),

  normal: twMerge(`
    max-xl:max-w-screen-xl
    sm:max-w-screen-sm
    md:max-w-screen-md
    lg:max-w-screen-lg
  `),
};

const Container = ({
  children,
  className,
  variant = "normal",
  ...otherProps
}: ContainerProps) => (
  <div
    className={twMerge(
      `
        mx-auto
        my-6
        px-6
      `,
      classNamesByVariant[variant],
      className
    )}
    {...otherProps}
  >
    {children}
  </div>
);
