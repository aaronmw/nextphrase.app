import { ConditionalWrapper } from "@/app/client-components/ConditionalWrapper";
import { Icon } from "@/app/client-components/Icon";
import { IconName } from "@/app/client-components/Icon/types";
import { Tooltip } from "@/app/client-components/Tooltip";
import Link from "next/link";
import {
  ComponentPropsWithoutRef,
  MouseEventHandler,
  ReactNode,
  forwardRef,
} from "react";
import { twMerge } from "tailwind-merge";

type ButtonVariant = keyof typeof classNamesByVariant;

type BaseButtonProps = {
  iconLeft?: IconName;
  iconRight?: IconName;
  preventDefault?: boolean;
} & (
  | {
      children?: never;
      icon: IconName;
      label: ReactNode;
      variant: "iconOnly";
    }
  | {
      children: ReactNode;
      icon?: IconName;
      label?: never;
      variant?: ButtonVariant;
    }
);

type ButtonProps = ComponentPropsWithoutRef<"button"> & BaseButtonProps;

type AnchorButtonProps = ComponentPropsWithoutRef<"a"> &
  BaseButtonProps & {
    href: string;
  };

const commonClassNames = twMerge(`
  inline-flex
  cursor-pointer
  items-center
  justify-center
  gap-1.5
  text-appForegroundColor
  transition-all
  focus:outline-accentColor
  disabled:pointer-events-none
  disabled:opacity-30
  dark:text-appForegroundColorInDarkMode
`);

const baseButtonClassNames = twMerge(`
  w-fit
  flex-grow-0
  rounded
  px-4
  py-2
  transition-all
  hover:scale-105
  group-[&.is-stuck]/stickyContainer:px-4
  group-[&.is-stuck]/stickyContainer:py-2
`);

const classNamesByVariant = {
  "iconOnly": twMerge(
    commonClassNames,
    `
      hover:scale-110
    `
  ),

  "link": twMerge(
    commonClassNames,
    `
      gap-0.5
      font-bold
      text-brandColor
      underline
      underline-offset-2
      transition-all
      hover:text-brandColor
      hover:underline-offset-4
      dark:text-brandColor
    `
  ),

  "link--subtle": twMerge(
    commonClassNames,
    `
      gap-0.5
      text-appForegroundColor/60
      underline
      underline-offset-2
      transition-all
      hover:text-brandColor
      hover:underline-offset-4
      dark:text-appForegroundColorInDarkMode/60
    `
  ),

  "primary": twMerge(
    commonClassNames,
    baseButtonClassNames,
    `
      font-display
      bg-brandColor
      font-bold
      text-white
    `
  ),

  "secondary": twMerge(
    commonClassNames,
    baseButtonClassNames,
    `
      font-display
      border-2
      border-transparent
      font-bold
      text-brandColor
      hover:border-brandColor
    `
  ),

  "toolbar": twMerge(
    commonClassNames,
    `
      font-display
      rounded-md
      px-2
      py-1
      text-xs
      hover:bg-highlightColor
    `
  ),

  "unstyled": commonClassNames,
};

const AnchorButton = forwardRef<HTMLAnchorElement, AnchorButtonProps>(
  (
    {
      children,
      className,
      icon,
      iconLeft,
      iconRight,
      label,
      preventDefault = false,
      variant = "link",
      onClick,
      ...otherProps
    },
    ref
  ) => {
    const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
      event.stopPropagation();

      if (preventDefault) {
        event.preventDefault();
      }

      onClick?.(event);
    };

    return (
      <ConditionalWrapper
        condition={variant.startsWith("iconOnly")}
        wrapper={(button) => <Tooltip tip={label}>{button}</Tooltip>}
      >
        <Link
          className={twMerge(classNamesByVariant[variant], className)}
          ref={ref}
          onClick={handleClick}
          {...otherProps}
        >
          {icon && (
            <span className="no-underline">
              <Icon name={icon} />
            </span>
          )}
          {iconLeft && (
            <span className="no-underline">
              <Icon name={iconLeft} />
            </span>
          )}

          {label && <span className="sr-only">{label}</span>}
          {children}

          {iconRight && (
            <span className="no-underline">
              <Icon name={iconRight} />
            </span>
          )}
        </Link>
      </ConditionalWrapper>
    );
  }
);

AnchorButton.displayName = "AnchorButton";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      icon,
      iconLeft,
      iconRight,
      label,
      preventDefault = false,
      variant = "secondary",
      onClick,
      ...otherProps
    },
    ref
  ) => {
    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
      event.stopPropagation();

      if (preventDefault) {
        event.preventDefault();
      }

      onClick?.(event);
    };

    return (
      <ConditionalWrapper
        condition={variant.startsWith("iconOnly")}
        wrapper={(button) => <Tooltip tip={label}>{button}</Tooltip>}
      >
        <button
          className={twMerge(classNamesByVariant[variant], className)}
          ref={ref}
          onClick={handleClick}
          {...otherProps}
        >
          {icon && (
            <span className="no-underline">
              <Icon name={icon} />
            </span>
          )}
          {iconLeft && (
            <span className="no-underline">
              <Icon name={iconLeft} />
            </span>
          )}

          {label && <span className="sr-only">{label}</span>}
          {children}

          {iconRight && (
            <span className="no-underline">
              <Icon name={iconRight} />
            </span>
          )}
        </button>
      </ConditionalWrapper>
    );
  }
);

Button.displayName = "Button";

export { AnchorButton, Button };
export type { AnchorButtonProps, ButtonProps };
