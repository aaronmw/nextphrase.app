"use client";

import Link from "next/link";
import { ComponentPropsWithRef, forwardRef } from "react";
import { ButtonContainer } from "./ButtonContainer";
import { ButtonContainerProps } from "./types";

export const AnchorButton = forwardRef(
  (
    {
      children,
      ...otherProps
    }: ComponentPropsWithRef<"a"> & Omit<ButtonContainerProps, "Component">,
    ref
  ) => (
    <ButtonContainer Component={Link} ref={ref} shallow={true} {...otherProps}>
      {children}
    </ButtonContainer>
  )
);
