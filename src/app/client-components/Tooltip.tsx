"use client";

import { TransitionChildren } from "@/app/client-components/TransitionChildren";
import { useCustomizedPopper } from "@/hooks/useCustomizedPopper";
import { Popover } from "@headlessui/react";
import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  tip: ReactNode;
}

const Tooltip = ({ children, className, tip, ...otherProps }: TooltipProps) => {
  const [isShowingTooltip, setIsShowingTooltip] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const {
    popperAttributes,
    popperStyles,
    setPopperElement,
    setReferenceElement,
  } = useCustomizedPopper<HTMLDivElement>({
    placement: "top",
  });

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  const showTooltip = () => {
    timerRef.current = setTimeout(() => setIsShowingTooltip(true), 300);
  };

  const hideTooltip = () => {
    clearTimeout(timerRef.current);

    setIsShowingTooltip(false);
  };

  return (
    <Popover className={twMerge("group/tooltip", className)} {...otherProps}>
      <div
        className="inline-block cursor-default"
        ref={(el) => setReferenceElement(el)}
        onBlur={hideTooltip}
        onFocus={showTooltip}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <TransitionChildren className="relative z-50" show={isShowingTooltip}>
            <Popover.Panel
              className="
              font-body
              whitespace-nowrap
              rounded-md
              bg-black
              px-3
              py-2.5
              text-xs
              font-normal
              text-white
              shadow-md
            "
              ref={setPopperElement}
              static={true}
              style={popperStyles}
              {...popperAttributes}
            >
              {tip}
            </Popover.Panel>
          </TransitionChildren>,
          document.body
        )}
    </Popover>
  );
};

export { Tooltip };
