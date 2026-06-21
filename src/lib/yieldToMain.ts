/** Yields the main thread so the browser can paint and handle input between heavy tasks. */
export function yieldToMain(timeout = 100): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => resolve(), { timeout });
    } else {
      setTimeout(resolve, 0);
    }
  });
}
