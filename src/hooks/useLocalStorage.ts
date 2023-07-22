import { useState } from "react";

const useLocalStorage = <T>({
  key,
  initialValue,
}: {
  key: string;
  initialValue: T;
}): [T, (value: T | ((val: T) => T)) => void] => {
  if (typeof window === "undefined") {
    return [initialValue, () => {}];
  }

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (newValue: T | ((newValue: T) => T)) => {
    try {
      const valueToStore =
        newValue instanceof Function ? newValue(storedValue) : newValue;

      setStoredValue(valueToStore);

      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export { useLocalStorage };
