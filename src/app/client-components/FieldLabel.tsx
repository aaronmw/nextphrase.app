"use client";

import { Icon, IconName } from "@/app/client-components/Icon";
import { StyledText } from "@/app/client-components/StyledText";
import {
  ComponentPropsWithRef,
  ReactNode,
  createContext,
  forwardRef,
} from "react";
import { twMerge } from "tailwind-merge";

interface FieldLabelProps extends ComponentPropsWithRef<"label"> {
  label: ReactNode;
  required?: boolean;
  requiredIcon?: IconName | null;
}

interface FieldLabelContextObject {
  required: boolean;
}

export const FieldLabelContext = createContext<FieldLabelContextObject>({
  required: false,
});

const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  (
    {
      children,
      className,
      label,
      requiredIcon = "asterisk",
      required = false,
      ...otherProps
    },
    ref
  ) => {
    const fieldLabelContext = {
      required,
    };

    return (
      <FieldLabelContext.Provider value={fieldLabelContext}>
        <label
          className={twMerge(`flex flex-col items-start gap-1`, className)}
          ref={ref}
          {...otherProps}
        >
          <StyledText variant="label">
            {label}

            {required && requiredIcon && (
              <span className="relative -top-1 text-xs text-red-500">
                <Icon className="scale-75" name={requiredIcon} />
              </span>
            )}
          </StyledText>

          {children}
        </label>
      </FieldLabelContext.Provider>
    );
  }
);

FieldLabel.displayName = "FieldLabel";

export { FieldLabel };
