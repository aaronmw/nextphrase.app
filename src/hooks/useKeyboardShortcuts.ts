import Mousetrap, { ExtendedKeyboardEvent } from "mousetrap";
import { RefObject, useEffect, useRef } from "react";

type KeyName =
  | "shift"
  | "ctrl"
  | "alt"
  | "meta"
  | "option"
  | "command"
  | "backspace"
  | "tab"
  | "enter"
  | "return"
  | "capslock"
  | "esc"
  | "escape"
  | "space"
  | "pageup"
  | "pagedown"
  | "end"
  | "home"
  | "left"
  | "up"
  | "right"
  | "down"
  | "ins"
  | "del"
  | "plus";

/**
   An object keyed by one or more key combos supported by
   [Mousetrap](https://craig.is/killing/mice). Ex:

   ```javascript
   {
     'left': (e, combo) => { ... },
     'up, down': (e, combo) => { ... },
     'option+command+s, command+k s': (e, combo) => { ... }
   }
   ```

   Each handler receives two arguments: `e` the event and `combo` a string
   containing the key(s) pressed.

   Supported keys: `shift`, `ctrl`, `alt`, `meta`, `option`, `command`,
   `backspace`, `tab`, `enter`, `return`, `capslock`, `esc`, `escape`, `space`,
   `pageup`, `pagedown`, `end`, `home`, `left`, `up`, `right`, `down`, `ins`,
   `del`, `plus`
*/
export type KeyMap = {
  [combo: KeyName | string]: (
    event: ExtendedKeyboardEvent,
    combo: string
  ) => void;
};

export const useKeyboardShortcuts: (
  keyMap: KeyMap,
  nodeOrRefObject?: HTMLElement | RefObject<HTMLElement> | null
) => void = (keyMap, nodeOrRefObject) => {
  const mousetrapInstance = useRef<Mousetrap.MousetrapInstance | null>(null);

  useEffect(() => {
    // An unset ref? Wait for it to be set
    if (
      (typeof nodeOrRefObject !== "undefined" && nodeOrRefObject === null) ||
      (nodeOrRefObject as RefObject<HTMLElement>)?.current === null
    ) {
      return;
    }

    const parentNode =
      nodeOrRefObject instanceof HTMLElement
        ? nodeOrRefObject
        : nodeOrRefObject?.current instanceof HTMLElement
        ? nodeOrRefObject.current
        : document.body;

    mousetrapInstance.current = new Mousetrap(parentNode);

    Object.entries(keyMap).forEach(([combo, handler]) => {
      combo.split(",").map((singleCombo) => {
        mousetrapInstance.current!.bind(singleCombo.trim(), handler);
      });
    });

    return () => {
      mousetrapInstance.current?.reset();
    };
  }, [keyMap, nodeOrRefObject]);

  return mousetrapInstance.current;
};
