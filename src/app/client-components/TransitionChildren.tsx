import { Transition } from "@headlessui/react";
import { ComponentPropsWithoutRef } from "react";

interface TransitionChildrenProps extends ComponentPropsWithoutRef<"div"> {
  show?: boolean;
}

const TransitionChildren = ({
  children,
  show,
  ...otherProps
}: TransitionChildrenProps) => (
  <Transition
    as="div"
    className="relative z-20"
    enter="transition ease-out duration-100"
    enterFrom="opacity-0 -translate-y-1"
    enterTo="opacity-100 translate-y-0"
    leave="transition ease-in duration-75"
    leaveFrom="opacity-100 translate-y-0"
    leaveTo="opacity-0 -translate-y-1"
    show={show}
    {...otherProps}
  >
    {children}
  </Transition>
);

export { TransitionChildren };
