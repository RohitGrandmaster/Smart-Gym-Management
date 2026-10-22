// RESPONSIBILITY: Custom hook to intercept browser beforeunload and warn user of unsaved changes (Rule 46).
// DATA FLOW: Component isDirty state -> useWarnIfUnsavedChanges -> Browser Window Event

import { useEffect } from 'react';

export function useWarnIfUnsavedChanges(isDirty: boolean, warningMessage: string = 'You have unsaved changes. Are you sure you want to leave?') {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = warningMessage;
        return warningMessage;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, warningMessage]);
}
