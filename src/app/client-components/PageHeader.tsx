import { StickyContainer } from "@/app/client-components/StickyContainer";
import { StyledText } from "@/app/client-components/StyledText";
import { ComponentPropsWithoutRef, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export { PageHeader };
export type { PageHeaderProps };

interface PageHeaderProps
  extends Omit<ComponentPropsWithoutRef<"header">, "children" | "title"> {
  title: ReactNode;
  actions?: ReactNode;
}

const PageHeader = ({
  actions,
  className,
  title,
  ...otherProps
}: PageHeaderProps) => (
  <StickyContainer
    className={twMerge(
      `
        border-b-border
        dark:bg-appBackgroundColorInDarkMode
        z-10
        flex
        items-center
        justify-between
        border-b
        bg-appBackgroundColor
        px-6
        py-2
        transition-all
        dark:border-b-borderColorInDarkMode
      `,
      className
    )}
    {...otherProps}
  >
    <StyledText variant="h2">{title}</StyledText>

    {actions && (
      <div
        className="
          flex
          flex-row-reverse
          items-center
          gap-6
        "
      >
        {actions}
      </div>
    )}
  </StickyContainer>
);
