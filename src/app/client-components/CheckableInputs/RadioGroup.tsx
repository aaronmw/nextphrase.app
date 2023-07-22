import { RadioButton } from "@/app/client-components/CheckableInputs/RadioButton";
import {
  RadioGroup as HeadlessUIRadioGroup,
  type RadioGroupProps as HeadlessUIRadioGroupProps,
} from "@headlessui/react";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface RadioGroupProps
  extends HeadlessUIRadioGroupProps<"input", string | number> {
  className?: string;
  options: {
    label: ReactNode;
    value: string | number;
  }[];
  variant: keyof typeof classNamesByVariant;
}

const classNamesByVariant = {
  horizontal: twMerge(`
    flex
    items-center
    gap-6
  `),
  vertical: twMerge(`
    flex
    flex-col
    gap-0.5
  `),
};

export const RadioGroup = ({
  className,
  options,
  variant,
  ...otherProps
}: RadioGroupProps) => (
  <HeadlessUIRadioGroup
    as="div"
    className={twMerge(classNamesByVariant[variant], className)}
    {...otherProps}
  >
    {options.map((option) => (
      <HeadlessUIRadioGroup.Option
        className="
          flex
          flex-row
          items-center
          gap-2
          text-fadedTextColor
          ui-checked:text-appForegroundColor
          dark:text-fadedTextColor
          ui-checked:dark:text-appForegroundColorInDarkMode
        "
        key={option.value}
        value={option.value}
      >
        {({ checked }) => (
          <>
            <RadioButton checked={checked} />
            {option.label}
          </>
        )}
      </HeadlessUIRadioGroup.Option>
    ))}
  </HeadlessUIRadioGroup>
);
