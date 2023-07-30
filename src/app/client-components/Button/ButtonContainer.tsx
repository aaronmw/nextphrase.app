"use client";

import { Icon } from "@/app/client-components/Icon";
import {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ElementType,
  MouseEventHandler,
  Ref,
  forwardRef,
} from "react";
import { twMerge } from "tailwind-merge";
import { classNamesByVariant } from "./classNamesByVariant";
import { ButtonContainerProps } from "./types";

export { ButtonContainer };

const ButtonContainer = forwardRef(
  <T extends ElementType>(
    {
      Component = "button",
      children,
      className,
      iconLeft,
      iconLeftVariant,
      iconRight,
      iconRightVariant,
      preventDefault,
      stopPropagation,
      variant,
      onClick,
      ...otherProps
    }: ComponentPropsWithoutRef<T> & ButtonContainerProps,
    ref: Ref<T>
  ) => {
    const handleClick: MouseEventHandler = (event) => {
      if (preventDefault) {
        event.preventDefault();
      }

      if (stopPropagation) {
        event.stopPropagation();
      }

      onClick?.(event);
    };

    return (
      <Component
        className={twMerge(classNamesByVariant[variant], className)}
        ref={ref}
        onClick={handleClick}
        {...otherProps}
      >
        {iconLeft && <Icon name={iconLeft} variant={iconLeftVariant} />}

        {children}

        {iconRight && <Icon name={iconRight} variant={iconRightVariant} />}
      </Component>
    );
  }
) as <T extends ElementType>(
  props: ComponentPropsWithRef<T> & ButtonContainerProps
) => JSX.Element;

(ButtonContainer as any).displayName = "ButtonContainer";
