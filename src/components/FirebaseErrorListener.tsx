'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

/**
 * Listens for specialized Firestore errors and re-throws them 
 * to be caught by the Next.js development error overlay.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handlePermissionError = (error: any) => {
      // Re-throwing the error inside the component lifecycle 
      // will trigger the Next.js error overlay with the contextual message.
      throw error;
    };

    errorEmitter.on('permission-error', handlePermissionError);
    return () => errorEmitter.off('permission-error', handlePermissionError);
  }, []);

  return null;
}
