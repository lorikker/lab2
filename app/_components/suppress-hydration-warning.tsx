"use client";

import { useEffect, useState } from "react";

export default function SuppressHydrationWarning({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {/* Suppress hydration warnings during initial render */}
      <div suppressHydrationWarning>
        {isMounted ? children : <div style={{ visibility: "hidden" }}>{children}</div>}
      </div>
    </>
  );
}
