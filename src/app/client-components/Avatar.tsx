import Image from "next/image";
import { ComponentPropsWithRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface AvatarProps
  extends Omit<ComponentPropsWithRef<"figure">, "children"> {
  user: {
    displayName: string;
    photoURL: string;
  };
  variant: keyof typeof classNamesByVariant;
}

const classNamesByVariant = {
  sm: twMerge("h-8 w-8"),
  md: twMerge("h-12 w-12"),
  lg: twMerge("h-16 w-16"),
  xl: twMerge("h-32 w-32"),
};

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, user, variant, ...otherProps }, ref) => {
    const isValidUser = user && user.displayName && user.photoURL;

    if (!isValidUser) {
      return null;
    }

    return (
      <figure
        className={twMerge(
          classNamesByVariant[variant],
          `
            outline-brandColor
            relative
            flex-shrink-0
            flex-grow-0
            overflow-hidden
            rounded-full
            shadow-inner
            outline
            outline-offset-2
          `,
          className
        )}
        ref={ref}
        {...otherProps}
      >
        <Image alt={user.displayName} src={user.photoURL} fill={true} />
      </figure>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar };
