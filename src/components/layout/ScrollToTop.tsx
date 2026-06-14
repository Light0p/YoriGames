"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 1. Pagination Check: Agar URL mein 'page' parameter hai (e.g., ?page=2)
    if (searchParams.has('page') || searchParams.has('p')) {
      return; // Scroll mat karo, yahin ruk jao
    }

    // 2. Route Check: Agar pathname mein 'page' word hai (e.g., /games/page/2)
    if (
      (pathname.includes('/games') || pathname.includes('/categories')) && 
      pathname.includes('/page/')
    ) {
      return; // Scroll mat karo
    }

    // Agar simple page change hai (jaise Home se About Us), toh top par bhejo
    window.scrollTo(0, 0);
  }, [pathname, searchParams]);

  return null;
}