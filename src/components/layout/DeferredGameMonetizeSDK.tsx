'use client';

import { useEffect, useRef } from 'react';

const GM_SDK_SRC = 'https://api.gamemonetize.com/sdk.js';
const GM_SDK_SELECTOR = 'script[src*="gamemonetize.com/sdk.js"]';

/**
 * Defers GameMonetize SDK until first user interaction or 5s after load.
 * Keeps the main thread free for Hero paint and improves LCP/FID on mobile.
 */
export function DeferredGameMonetizeSDK() {
  const loadedRef = useRef(false);

  useEffect(() => {
    const loadSdk = () => {
      if (loadedRef.current) return;
      loadedRef.current = true;

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

    events.forEach((event) =>
      window.addEventListener(event, onInteraction, { capture: true, passive: true })
    );

    const fallbackTimer = setTimeout(() => {
      cleanup();
      loadSdk();
    }, 5000);

    return cleanup;
  }, []);

  return null;
}
