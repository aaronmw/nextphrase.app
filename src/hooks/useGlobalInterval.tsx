import omit from "lodash/omit";
import {
    createContext,
    MutableRefObject,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
} from "react";

type AnyFunction = () => void;

type GlobalIntervalContextObject = {
  setGlobalInterval: (func: AnyFunction, interval: number) => void;
  clearGlobalInterval: (func: AnyFunction, interval: number) => void;
};

const GlobalIntervalContext = createContext<GlobalIntervalContextObject>({
  setGlobalInterval: () => null,
  clearGlobalInterval: () => null,
});

// We can just keep the watchers in a global array;
// Storing them in state or context causes re-renders
const globalIntervals: MutableRefObject<{
  functions: Record<number, Array<AnyFunction>>;
  intervals: Record<number, ReturnType<typeof setInterval>>;
}> = {
  current: {
    functions: {},
    intervals: {},
  },
};

export const GlobalIntervalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const setGlobalInterval = useCallback(
    (newFunction: AnyFunction, interval: number) => {
      globalIntervals.current = {
        ...globalIntervals.current,
        functions: {
          ...globalIntervals.current.functions,
          [interval]: [
            ...(globalIntervals.current.functions[interval] ?? []),
            newFunction,
          ],
        },

        intervals: {
          ...globalIntervals.current.intervals,
          [interval]:
            globalIntervals.current.intervals[interval] ??
            setInterval(() => {
              globalIntervals.current.functions[interval].forEach((func) =>
                func()
              );
            }, interval),
        },
      };
    },
    []
  );

  const clearGlobalInterval = useCallback(
    (originalFunction: AnyFunction, interval: number) => {
      globalIntervals.current = {
        ...globalIntervals.current,
        functions: {
          ...globalIntervals.current.functions,
          [interval]: globalIntervals.current.functions[interval].filter(
            (currentFunction) => currentFunction !== originalFunction
          ),
        },
      };

      if (globalIntervals.current.functions[interval].length === 0) {
        clearInterval(globalIntervals.current.intervals[interval]);

        globalIntervals.current = {
          functions: omit(globalIntervals.current.functions, interval),
          intervals: omit(globalIntervals.current.intervals, interval),
        };
      }
    },
    []
  );

  const globalIntervalContext: GlobalIntervalContextObject = {
    setGlobalInterval,
    clearGlobalInterval,
  };

  return (
    <GlobalIntervalContext.Provider value={globalIntervalContext}>
      {children}
    </GlobalIntervalContext.Provider>
  );
};

export const useGlobalInterval: (
  func?: () => void,
  interval?: number
) => GlobalIntervalContextObject = (func, interval) => {
  const GlobalIntervalContextObject = useContext(GlobalIntervalContext);

  const { setGlobalInterval, clearGlobalInterval } =
    GlobalIntervalContextObject;

  useEffect(() => {
    if (!func || !interval) {
      return;
    }

    setGlobalInterval(func, interval);

    return () => {
      clearGlobalInterval(func, interval);
    };
  }, [clearGlobalInterval, func, interval, setGlobalInterval]);

  return GlobalIntervalContextObject;
};
