"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Asli logic humne ek alag function mein daal diya
function ScrollLogic() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 1. Pagination Check
    if (searchParams.has('page') || searchParams.has('p')) {
      return; 
    }

    // 2. Route Check
    if (
      (pathname.includes('/games') || pathname.includes('/categories')) && 
      pathname.includes('/page/')
    ) {
      return; 
    }

    window.scrollTo(0, 0);
  }, [pathname, searchParams]);

  return null;
}

// Main component isko Suspense mein wrap karke bhejega
export default function ScrollToTop() {
  return (
    <Suspense fallback={null}>
      <ScrollLogic />
    </Suspense>
  );
}