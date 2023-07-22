import { AnchorButton } from "@/app/client-components/Button";
import { Icon } from "@/app/client-components/Icon";
import { IconName } from "@/app/client-components/Icon/types";
import { TransitionChildren } from "@/app/client-components/TransitionChildren";
import { useCustomizedPopper } from "@/hooks/useCustomizedPopper";
import { Menu as TwMenu } from "@headlessui/react";
import { ComponentProps, ComponentPropsWithRef, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface MenuItem extends ComponentPropsWithRef<"a"> {
  icon?: IconName;
  label: ReactNode;
}

interface MenuProps extends ComponentProps<"div"> {
  trigger: ReactNode;
  items: MenuItem[] | MenuItem[][];
  contentAfterItems?: ReactNode;
  contentBeforeItems?: ReactNode;
}

export const menuCardClassNames = twMerge(`
  divide-border
  relative
  z-50
  max-h-[60vh]
  min-w-[200px]
  divide-y
  overflow-y-auto
  overscroll-contain
  rounded-md
  bg-appBackgroundColor
  text-appForegroundColor
  shadow-lg
  ring-1
  ring-black
  ring-opacity-5
  focus:outline-none
  dark:divide-borderColorInDarkMode
  dark:border
  dark:border-borderColorInDarkMode
  dark:bg-appBackgroundColorInDarkMode
  dark:text-appForegroundColorInDarkMode
`);

export const menuItemClassNames = twMerge(`
  ui-active:bg-brandColor
  group
  !flex
  cursor-pointer
  items-center
  justify-start
  gap-3
  rounded
  px-3
  py-1.5
  transition-all
  ui-active:text-white
  ui-disabled:cursor-not-allowed
`);

const Menu = ({
  className,
  contentAfterItems,
  contentBeforeItems,
  items,
  trigger,
}: MenuProps) => {
  const {
    popperAttributes,
    popperStyles,
    setPopperElement,
    setReferenceElement,
  } = useCustomizedPopper();

  const groupedItems = (
    Array.isArray(items[0]) ? items : [items]
  ) as MenuItem[][];

  return (
    <TwMenu as="div" className={twMerge("relative inline-block", className)}>
      <TwMenu.Button ref={setReferenceElement}>{trigger}</TwMenu.Button>

      <TransitionChildren>
        <TwMenu.Items
          className={twMerge(
            menuCardClassNames,
            `
              right-0
              origin-top-right
              whitespace-nowrap
              text-sm
            `
          )}
          ref={setPopperElement}
          style={popperStyles}
          {...popperAttributes}
        >
          {contentBeforeItems}

          {groupedItems.map((groupItems, index) => (
            <div className="p-1" key={index}>
              {groupItems.map(
                ({ href, icon, label, ...otherProps }, itemIndex) => (
                  <TwMenu.Item key={itemIndex}>
                    {({ active }) => (
                      <AnchorButton
                        className={menuItemClassNames}
                        href={href ?? "#"}
                        variant="unstyled"
                        {...otherProps}
                      >
                        {icon && (
                          <Icon
                            className={twMerge(
                              active ? "opacity-100" : "opacity-50",
                              "transition-opacity"
                            )}
                            name={icon}
                          />
                        )}
                        {label}
                      </AnchorButton>
                    )}
                  </TwMenu.Item>
                )
              )}
            </div>
          ))}

          {contentAfterItems}
        </TwMenu.Items>
      </TransitionChildren>
    </TwMenu>
  );
};

export { Menu };
