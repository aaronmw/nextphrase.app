import MousetrapInstance from "mousetrap";
import { Fragment, HTMLAttributes, useEffect } from "react";

interface MousetrapProps extends HTMLAttributes<HTMLDivElement> {
  action: (e: Mousetrap.ExtendedKeyboardEvent, combo: string) => boolean | void;
  combo: string | string[];
  disabled?: boolean;
}

const Mousetrap = ({
  action,
  children,
  combo,
  disabled = false,
  ...otherProps
}: MousetrapProps) => {
  useEffect(() => {
    if (!disabled) {
      MousetrapInstance.bind(combo, (event, combo) => {
        event.preventDefault();

        action(event, combo);
      });
    }

    return () => {
      MousetrapInstance.unbind(combo);
    };
  }, [action, combo, disabled]);

  return <Fragment {...otherProps}>{children}</Fragment>;
};

export { Mousetrap };
