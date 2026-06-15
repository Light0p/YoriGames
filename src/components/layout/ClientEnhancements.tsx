'use client';

import { useState, useEffect, ReactNode } from 'react';

/**
 * Ensures children are only rendered on the client after hydration.
 * This prevents UI flickering and mismatch errors with Cloudflare ISR cache.
 */
export function ClientEnhancements({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; 
  }

  return <>{children}</>;
}
