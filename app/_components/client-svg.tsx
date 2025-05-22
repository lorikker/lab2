"use client";

import { useEffect, useState } from "react";

export default function ClientSVG({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Don't render anything on the server
  }

  return <>{children}</>;
}
