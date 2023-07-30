import { ComponentPropsWithRef, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface TitleBarProps extends ComponentPropsWithRef<"header"> {
  contentInCenter?: ReactNode;
  contentOnLeft?: ReactNode;
  contentOnRight?: ReactNode;
}

export const TitleBar = ({
  className,
  contentInCenter,
  contentOnLeft,
  contentOnRight,
  ...otherProps
}: TitleBarProps) => {
  return (
    <header
      className={twMerge(
        `
          flex
          h-barHeight
          items-center
          justify-between
          gap-3
          bg-shadedColor
          px-3
          text-fadedTextColor
        `,
        className
      )}
      {...otherProps}
    >
      <div>{contentOnLeft}</div>
      <div className="font-bold">{contentInCenter}</div>
      <div>{contentOnRight}</div>
    </header>
  );
};
