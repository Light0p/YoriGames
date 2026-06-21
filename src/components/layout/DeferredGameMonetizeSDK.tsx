'use client';

import { useEffect, useRef } from 'react';

const GM_SDK_SRC = 'https://api.gamemonetize.com/sdk.js';
const GM_SDK_SELECTOR = 'script[src*="gamemonetize.com/sdk.js"]';

/**
 * 'Ghost Mode' GameMonetize SDK Loader.
 * Defers SDK until first user interaction or 5s after load.
 * Ensures it only loads once and signals readiness to the GameView components.
 */
export function DeferredGameMonetizeSDK() {
  const loadedRef = useRef(false);

  useEffect(() => {
    const loadSdk = () => {
      if (loadedRef.current) return;
      loadedRef.current = true;

      // Check for existing script in DOM (e.g., from a different navigation cycle)
      if (document.querySelector(GM_SDK_SELECTOR)) {
        window.dispatchEvent(new Event('gmSDKReady'));
        return;
      }

      const script = document.createElement('script');
      script.src = GM_SDK_SRC;
      script.async = true;
      script.onload = () => {
        window.dispatchEvent(new Event('gmSDKReady'));
      };
      script.onerror = () => {
        console.warn('GameMonetize SDK failed to load. Entering fallback mode.');
        window.dispatchEvent(new Event('gmSDKReady')); // Signal readiness even on fail to unblock iframes
      };
      document.head.appendChild(script);
    };

    const onInteraction = () => {
      cleanup();
      loadSdk();
    };

    const events = ['scroll', 'click', 'touchstart', 'keydown'] as const;

    const cleanup = () => {
      events.forEach((event) =>
        window.removeEventListener(event, onInteraction, { capture: true })
      );
      clearTimeout(fallbackTimer);
    };

    // Attach interaction listeners for just-in-time loading
    events.forEach((event) =>
      window.addEventListener(event, onInteraction, { capture: true, passive: true })
    );

    // Safety fallback to ensure the SDK is available eventually
    const fallbackTimer = setTimeout(() => {
      cleanup();
      loadSdk();
    }, 5000);

    return cleanup;
  }, []);

  return null;
}
