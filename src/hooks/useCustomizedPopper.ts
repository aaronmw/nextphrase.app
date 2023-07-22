import { Options } from "@popperjs/core";
import { useMemo, useState } from "react";
import { usePopper } from "react-popper";

const useCustomizedPopper = <
  R extends HTMLElement = HTMLButtonElement,
  P extends HTMLElement = HTMLDivElement
>(
  options?: Partial<Options>
) => {
  const [referenceElement, setReferenceElement] = useState<R | null>(null);

  const [popperElement, setPopperElement] = useState<P | null>(null);

  const modifiers = useMemo(
    () => ({
      ...options,
      modifiers: [
        ...(options?.modifiers ?? []),
        {
          name: "offset",
          options: {
            offset: [0, 5],
          },
        },
        {
          name: "preventOverflow",
          options: {
            altAxis: true,
            padding: 5,
          },
        },
      ],
    }),
    [options]
  );

  const { styles, attributes } = usePopper(
    referenceElement,
    popperElement,
    modifiers
  );

  return {
    popperAttributes: attributes.popper,
    popperStyles: styles.popper,
    setPopperElement,
    setReferenceElement,
  };
};

export { useCustomizedPopper };
