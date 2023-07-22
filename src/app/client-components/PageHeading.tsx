import {
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
} from "react";
import { twMerge } from "tailwind-merge";

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

type AsProp<C extends ElementType> = {
  as?: C;
};

type PolymorphicComponentProp<
  C extends ElementType,
  Props = {}
> = PropsWithChildren<Props & AsProp<C>> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

interface PageHeadingProps {
  variant?: keyof typeof pageHeadingVariantDescriptors;
}

const pageHeadingVariantDescriptors = {
  unstyled: { as: "div", className: "" },
  h1: { as: "h1", className: "font-display text-5xl font-bold" },
  h2: { as: "h2", className: "font-display text-4xl font-bold" },
  h3: { as: "h3", className: "font-display text-xl font-medium" },
  h4: { as: "h4", className: "font-display text-lg font-medium" },
  h5: { as: "h5", className: "font-display font-bold" },
};

const PageHeading = <E extends ElementType = "div">({
  as,
  children,
  className,
  variant = "unstyled",
  ...otherProps
}: PolymorphicComponentProp<E, PageHeadingProps>) => {
  const variantDescriptor = pageHeadingVariantDescriptors[variant];

  const Component = as ?? variantDescriptor.as ?? "div";

  return (
    <Component
      className={twMerge(variantDescriptor.className, className)}
      {...otherProps}
    >
      {children}
    </Component>
  );
};

export { PageHeading };
