"use client";

import { ComponentPropsWithRef, forwardRef } from "react";
import { ButtonContainer } from "./ButtonContainer";
import { ButtonContainerProps } from "./types";

export const Button = forwardRef(
  (
    {
      children,
      ...otherProps
    }: ComponentPropsWithRef<"button"> &
      Omit<ButtonContainerProps, "Component">,
    ref
  ) => (
    <ButtonContainer Component="button" ref={ref} {...otherProps}>
      {children}
    </ButtonContainer>
  )
);
