// RESPONSIBILITY: Provides a custom hook to debounce rapidly changing values (like search inputs).
// DATA FLOW: Component -> useSuperadminDebounce.ts -> API/Store
import { useState, useEffect } from 'react';

/**
 * A custom hook to debounce a value (e.g., search queries)
 * to prevent excessive API calls on every keystroke.
 * 
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useSuperadminDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
