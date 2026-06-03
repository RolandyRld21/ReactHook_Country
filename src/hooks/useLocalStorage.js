import { useCallback, useEffect, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const updateValue = useCallback((nextValue) => {
    setValue((currentValue) =>
      typeof nextValue === "function" ? nextValue(currentValue) : nextValue,
    );
  }, []);

  return [value, updateValue];
}
