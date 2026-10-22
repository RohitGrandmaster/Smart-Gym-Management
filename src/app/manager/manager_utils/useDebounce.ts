// RESPONSIBILITY: Generic debounce hook shared across all MANAGER modules.
// Prevents excessive API calls by delaying a value update until the user stops typing.
// Use this for all search inputs and filter inputs that trigger backend calls (Rule 15).
import { useState, useEffect } from 'react';

/**
 * A custom hook to debounce a value (e.g., search queries)
 * to prevent excessive API calls on every keystroke.
 * 
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
