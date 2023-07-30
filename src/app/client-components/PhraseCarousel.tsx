import { phrasesByListName } from "@/app/phrasesByListName";
import { ComponentPropsWithRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export const PhraseCarousel = ({
  className,
  ...otherProps
}: ComponentPropsWithRef<"div">) => {
  return (
    <div
      className={twMerge(
        `
          flex
          h-[100vw]
          w-[100vw]
          items-center
          justify-center
          p-6
          text-center
          text-3xl
        `,
        className
      )}
      {...otherProps}
    >
      Phrase Goes Here
    </div>
  );
};
