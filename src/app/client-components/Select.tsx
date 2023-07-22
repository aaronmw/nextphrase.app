import { FieldLabelContext } from "@/app/client-components/FieldLabel";
import { Icon } from "@/app/client-components/Icon";
import { inputClassNames } from "@/app/client-components/Input";
import {
  menuCardClassNames,
  menuItemClassNames,
} from "@/app/client-components/Menu";
import { TransitionChildren } from "@/app/client-components/TransitionChildren";
import { useCustomizedPopper } from "@/hooks/useCustomizedPopper";
import { Listbox } from "@headlessui/react";
import { ComponentPropsWithRef, Fragment, ReactNode, useContext } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

interface SelectProps<TValue> extends ComponentPropsWithRef<typeof Listbox> {
  options: TValue[];
  renderOptionLabel: (option: TValue) => ReactNode;
}

const Select = <TValue,>({
  options,
  renderOptionLabel,
  ...otherProps
}: SelectProps<TValue>) => {
  const { required } = useContext(FieldLabelContext);

  const {
    popperAttributes,
    popperStyles,
    setPopperElement,
    setReferenceElement,
  } = useCustomizedPopper<HTMLDivElement>();

  return (
    <Listbox
      as="div"
      className="
        relative
        w-full
      "
      ref={(el: HTMLDivElement) => setReferenceElement(el)}
      {...otherProps}
    >
      <Listbox.Button
        className={twMerge(
          inputClassNames,
          `
            flex
            items-center
            justify-between
            text-left
            focus:outline-offset-4
          `
        )}
      >
        {({ value }) => (
          <>
            {value && !Array.isArray(value) ? (
              renderOptionLabel(value) || <>&nbsp;</>
            ) : (
              <>&nbsp;</>
            )}
            <Icon name="caret-down" variant="solid" />
          </>
        )}
      </Listbox.Button>

      {typeof document !== "undefined" &&
        createPortal(
          <TransitionChildren>
            <Listbox.Options as={Fragment}>
              <div
                // TODO: Implement <MenuCard>
                className={twMerge(menuCardClassNames)}
                ref={(el: HTMLDivElement) => setPopperElement(el)}
                style={popperStyles}
                {...popperAttributes}
              >
                <ul className="p-1">
                  {options.map((option, index) => (
                    <Listbox.Option
                      className={menuItemClassNames}
                      key={index}
                      value={option}
                    >
                      <Icon
                        className="
                        opacity-0
                        ui-selected:!opacity-100
                        ui-active:opacity-20
                      "
                        name="check"
                      />
                      {renderOptionLabel(option)}
                    </Listbox.Option>
                  ))}
                </ul>
              </div>
            </Listbox.Options>
          </TransitionChildren>,
          document.body
        )}
    </Listbox>
  );
};

export { Select };
