import { IconName, IconVariant } from "@/app/client-components/Icon";
import { ElementType } from "react";
import { classNamesByVariant } from "./classNamesByVariant";

export type ButtonVariant = keyof typeof classNamesByVariant;

export type ButtonContainerProps = {
  Component?: ElementType;
  iconLeft?: IconName;
  iconLeftVariant?: IconVariant;
  iconRight?: IconName;
  iconRightVariant?: IconVariant;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  variant: ButtonVariant;
};
