"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * ScrollToTop Component
 * Ensures that the window is scrolled to the top whenever the pathname changes.
 * This fixes issues where navigation to long pages (like game grids) would 
 * preserve the scroll position of the previous page.
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
