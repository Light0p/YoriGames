"use client"

import React, { useEffect, useRef, useState, ReactNode } from 'react';

const DEFAULT_ROOT_MARGIN = '200px 0px';

interface LazyGridSlotProps {
  children: ReactNode;
  rootMargin?: string;
}

/** Renders children only once the slot enters (or nears) the viewport. */
function LazyGridSlot({ children, rootMargin = DEFAULT_ROOT_MARGIN }: LazyGridSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className="min-w-0">
      {visible ? (
        children
      ) : (
        <div
          className="w-full aspect-[4/3] bg-[#140A2E] border-2 border-[#1B123D] animate-pulse"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export interface LazyGridProps<T> {
  items: T[];
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  rootMargin?: string;
}

/**
 * Generic lazy-render grid — only mounts card DOM when slots are near the viewport.
 * Prevents mobile scroll jank from thousands of simultaneous nodes/images.
 */
export function LazyGrid<T>({
  items,
  getKey,
  renderItem,
  className,
  rootMargin,
}: LazyGridProps<T>) {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <LazyGridSlot key={getKey(item, index)} rootMargin={rootMargin}>
          {renderItem(item, index)}
        </LazyGridSlot>
      ))}
    </div>
  );
}
