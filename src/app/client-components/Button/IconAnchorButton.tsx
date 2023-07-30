"use client";

import { Icon, IconName, IconVariant } from "@/app/client-components/Icon";
import { Tooltip } from "@/app/client-components/Tooltip";
import Link from "next/link";
import { ComponentPropsWithRef, forwardRef } from "react";
import { ButtonContainer } from "./ButtonContainer";
import { ButtonContainerProps } from "./types";

export const IconAnchorButton = forwardRef(
  (
    {
      icon,
      iconVariant,
      label,
      ...otherProps
    }: Omit<ComponentPropsWithRef<"a">, "children"> &
      Omit<ButtonContainerProps, "Component" | "iconLeft" | "iconRight"> & {
        icon: IconName;
        iconVariant?: IconVariant;
        label: string;
        href: string;
      },
    ref
  ) => (
    <Tooltip tip={label}>
      <ButtonContainer Component={Link} ref={ref} {...otherProps}>
        <Icon name={icon} variant={iconVariant} />
        <span className="sr-only">{label}</span>
      </ButtonContainer>
    </Tooltip>
  )
);
