import {
  ModalWindow,
  type ModalWindowProps,
} from "@/app/client-components/ModalWindow";
import { ProgressRing } from "@/app/client-components/ProgressRing";
import { useEffect, useReducer } from "react";
import { initialState, reducer } from "./reducer";

export const ModalWindowForBulkImport = ({
  isOpen,
  onClose,
  ...otherProps
}: ModalWindowProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { progress } = state;

  useEffect(() => {
    if (isOpen === false) {
      return;
    }

    const timer = setTimeout(() => {
      dispatch({
        type: "setState",
        payload: {
          progress: progress === null ? 0 : progress < 100 ? progress + 1 : 0,
        },
      });
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen, progress]);

  return (
    <ModalWindow
      isOpen={isOpen}
      title="Import From CSV"
      variant="normal"
      onClose={onClose}
      {...otherProps}
    >
      <form
        className="
          flex
          flex-col
          gap-6
          px-6
          py-6
        "
      >
        {progress !== null && <ProgressRing progress={progress} variant="lg" />}
      </form>
    </ModalWindow>
  );
};
