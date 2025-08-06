import { useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const debouncedFunction = (...args: Parameters<T>): void => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debouncedFunction;
}
