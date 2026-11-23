"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * Safely reads a string value from `sessionStorage` without causing SSR
 * hydration mismatches or calling `setState` inside `useEffect`.
 */
export function useSessionStorageValue(key: string): string | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      try {
        return window.sessionStorage.getItem(key);
      } catch {
        return null;
      }
    },
    () => null
  );
}
