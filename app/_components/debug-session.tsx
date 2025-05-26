"use client";

import { useSession } from "next-auth/react";

export default function DebugSession() {
  const { data: session, status } = useSession();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 m-4 max-w-md rounded-lg bg-black/80 p-4 text-xs text-white">
      <h3 className="mb-2 text-sm font-bold">Session Debug</h3>
      <div>
        <p>Status: {status}</p>
        <pre className="mt-2 max-h-40 overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
