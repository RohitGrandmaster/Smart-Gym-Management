// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
"use client";
// RESPONSIBILITY: Provides the LandingContext and useLandingContext() hook.
// Wraps the entire Landing page tree so all sub-components can read shared state
// without prop drilling through LandingMain → each section.
//
// DATA FLOW: useLandingLogic → LandingProvider.value (memoized) → useLandingContext() → leaf components
//
// Rule 5: useMemo on context value prevents re-renders when parent updates.
// Rule 15: All handler functions in useLandingLogic are wrapped in useCallback.

import React, { createContext, useContext, useMemo } from 'react';
import { useLandingLogic } from '@/app/landing/landing_context/useLandingLogic';
import type { LandingContextType } from '@/app/landing/landing_types/landing_types';

const LandingContext = createContext<LandingContextType | undefined>(undefined);

/** Wraps the landing page tree and provides all shared UI state via context. */
export function LandingProvider({ children }: { children: React.ReactNode }) {
  const logic = useLandingLogic();
  const value = useMemo(() => logic, [logic]);

  return (
    <LandingContext.Provider value={value}>
      {children}
    </LandingContext.Provider>
  );
}

/**
 * Convenience hook for consuming LandingContext in any landing sub-component.
 * Throws a descriptive error if used outside of LandingProvider.
 */
export function useLandingContext(): LandingContextType {
  const context = useContext(LandingContext);
  if (context === undefined) {
    throw new Error('useLandingContext must be used within a LandingProvider');
  }
  return context;
}

