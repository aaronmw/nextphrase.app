"use client";

import { Icon, IconName, IconVariant } from "@/app/client-components/Icon";
import { Tooltip } from "@/app/client-components/Tooltip";
import { ComponentPropsWithRef, forwardRef } from "react";
import { ButtonContainer } from "./ButtonContainer";
import { ButtonContainerProps } from "./types";

export const IconButton = forwardRef(
  (
    {
      Component = "button",
      icon,
      iconVariant,
      label,
      ...otherProps
    }: Omit<ComponentPropsWithRef<"button">, "children"> &
      Omit<ButtonContainerProps, "iconLeft" | "iconRight"> & {
        icon: IconName;
        iconVariant?: IconVariant;
        label: string;
      },
    ref
  ) => (
    <Tooltip tip={label}>
      <ButtonContainer Component={Component} ref={ref} {...otherProps}>
        <Icon name={icon} variant={iconVariant} />
        <span className="sr-only">{label}</span>
      </ButtonContainer>
    </Tooltip>
  )
);
