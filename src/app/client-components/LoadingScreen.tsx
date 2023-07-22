import { Icon } from "@/app/client-components/Icon";
import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

interface LoadingScreenProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  isLoading: boolean;
}

const LoadingScreen = ({
  className,
  isLoading,
  ...otherProps
}: LoadingScreenProps) => (
  <div
    className={twMerge(
      isLoading ? "opacity-100" : "opacity-0",
      isLoading ? "pointer-events-all" : "pointer-events-none",
      `
        bg-shadedColor
        absolute
        left-0
        top-0
        z-10
        flex
        h-full
        w-full
        items-center
        justify-center
        rounded-lg
        border-8
        border-white
        transition-opacity
      `,
      className
    )}
    {...otherProps}
  >
    <Icon name="loader" spin={true} />
  </div>
);

export { LoadingScreen };
