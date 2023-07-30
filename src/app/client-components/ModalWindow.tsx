import { Button, IconButton } from "@/app/client-components/Button";
import { StickyContainer } from "@/app/client-components/StickyContainer";
import { StyledText } from "@/app/client-components/StyledText";
import { Dialog, Transition } from "@headlessui/react";
import { ComponentPropsWithoutRef, Fragment, ReactNode, useRef } from "react";
import { twMerge } from "tailwind-merge";

export interface ModalWindowProps
  extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  isOpen: boolean;
  description?: string;
  title?: ReactNode;
  variant?: keyof typeof classNamesByVariant;
  onClose: () => void;
  onCloseComplete?: () => void;
}

const classNamesByVariant = {
  narrow: "w-[400px]",
  normal: "w-[600px]",
  wide: "w-[960px]",
};

const ModalWindow = ({
  children,
  className,
  description,
  isOpen,
  title,
  variant = "normal",
  onClose,
  onCloseComplete,
}: ModalWindowProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Transition afterLeave={onCloseComplete} show={isOpen} as={Fragment}>
      <Dialog initialFocus={closeButtonRef} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="duration-300"
          enterFrom="backdrop-blur-0 opacity-0"
          enterTo="backdrop-blur-sm opacity-100"
          leave="duration-1000"
          leaveFrom="backdrop-blur-sm opacity-100"
          leaveTo="backdrop-blur-0 opacity-0"
        >
          <div
            className="
              pointer-events-none
              fixed
              inset-0
              z-20
              bg-fadedTextColor/30
              dark:bg-fadedTextColorInDarkMode/30
            "
            aria-hidden="true"
          />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="duration-1000"
          enterFrom="opacity-0 -translate-y-6"
          enterTo="opacity-100 translate-y-0"
          leave="duration-300"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-6"
        >
          <div
            className={twMerge(
              `
                fixed
                inset-0
                z-20
                mx-auto
                flex
                items-center
                justify-center
                p-4
              `,
              classNamesByVariant[variant],
              className
            )}
          >
            <Dialog.Panel
              className="
                text-textColor
                dark:text-textColorInDarkMode
                relative
                max-h-[calc(100vh-theme(spacing.8))]
                w-full
                overflow-auto
                rounded
                bg-appBackgroundColor
                dark:bg-appBackgroundColorInDarkMode
              "
            >
              <Dialog.Title
                as={StickyContainer}
                className="
                  z-10
                  flex
                  h-12
                  items-center
                  justify-between
                  rounded-t
                  bg-shadedColor/80
                  px-6
                  pl-6
                  pr-3
                  backdrop-blur
                  dark:bg-shadedColorInDarkMode/80
                "
              >
                <StyledText variant="h4">{title ?? <>&nbsp;</>}</StyledText>

                <IconButton
                  icon="xmark"
                  label="Close"
                  ref={closeButtonRef}
                  variant="toolbar"
                  onClick={onClose}
                />
              </Dialog.Title>

              {description && (
                <Dialog.Description className="sr-only">
                  {description}
                </Dialog.Description>
              )}

              {children}
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export { ModalWindow };
