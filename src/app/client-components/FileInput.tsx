import { Input, InputProps } from "@/app/client-components/Input";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface FileInputProps extends InputProps {}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, ...otherProps }, ref) => {
    return (
      <Input
        className={twMerge(
          `
            file:bg-brandColor
            cursor-pointer
            border-none
            bg-clip-padding
            px-1
            text-neutral-400
            shadow-none
            file:mr-6
            file:cursor-pointer
            file:rounded-full
            file:border-0
            file:px-6
            file:py-3
            file:text-white
            file:transition-all
            hover:file:scale-105
          `,
          className
        )}
        ref={ref}
        type="file"
        {...otherProps}
      />
    );
  }
);

FileInput.displayName = "FileInput";

export { FileInput };
