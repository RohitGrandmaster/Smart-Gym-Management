'use client';
// RESPONSIBILITY: Provides a type-safe, SSR-safe React hook for reading and writing
// to the browser's localStorage. Prevents hydration mismatches by deferring reads
// to the client-side only. Frontend Rule 61.

import { useState, useEffect, useCallback } from 'react';

/**
 * A custom hook to safely read and write to `window.localStorage`.
 *
 * Solves the Next.js hydration mismatch problem:
 * - Server renders with the `initialValue` (since localStorage doesn't exist on server).
 * - After hydration, the hook reads the real stored value and syncs the state.
 *
 * Usage:
 *   const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('sidebar_collapsed', false);
 *   const [densityMode, setDensityMode] = useLocalStorage<'comfortable' | 'compact'>('density_mode', 'comfortable');
 *
 * @param key - The localStorage key string.
 * @param initialValue - The value to use if no stored value exists, or during SSR.
 * @returns A stateful value and a setter function (same API as useState).
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prevValue: T) => T)) => void] {
  // Initialize with the initialValue to match SSR output and avoid hydration mismatch.
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // After mount (client-side only), read the real value from localStorage.
  // useEffect: Runs once on mount to sync state with actual localStorage value.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        /* eslint-disable react-hooks/set-state-in-effect */
        setStoredValue(JSON.parse(item) as T);
        /* eslint-enable react-hooks/set-state-in-effect */
      }
    } catch {
      // Silently handle JSON parse errors or SecurityErrors (private browsing).
      // Falls back to initialValue already set in useState.
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prevValue: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const nextValue = value instanceof Function ? value(prev) : value;
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(nextValue));
          }
          return nextValue;
        });
      } catch {
        // Silently handle QuotaExceededError or SecurityErrors.
      }
    },
    [key]
  );

  return [storedValue, setValue];
}
