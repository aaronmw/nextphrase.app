import { Icon } from "@/app/client-components/Icon";
import { ComponentPropsWithoutRef, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export { Option };
export type { OptionProps };

interface OptionProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  checked: boolean;
  label: ReactNode;
}

const Option = ({ checked, className, label, ...otherProps }: OptionProps) => (
  <div
    className={twMerge(
      checked && "is-checked",
      `
        text-fadedTextColor
        opacity-60
        transition-all
        [&.is-checked]:text-textColor
        [&.is-checked]:opacity-100
      `,
      className
    )}
    {...otherProps}
  >
    <label
      className="
        flex
        items-center
        justify-between
        gap-6
      "
    >
      <div>{label}</div>

      <Icon name={checked ? "check" : "xmark"} />
    </label>
  </div>
);
