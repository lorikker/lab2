"use client";

import { useEffect, useState } from "react";

export default function SuppressHydrationWarning({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        style={{ visibility: "hidden" }}
        aria-hidden="true"
        suppressHydrationWarning
      >
        {children}
      </div>
    );
  }

  return <div suppressHydrationWarning>{children}</div>;
}
