"use client";

import { Button } from "@/app/_components/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 font-sans">
      <div className="flex min-w-[200px] flex-col items-center justify-center gap-4 rounded-lg border bg-white p-8">
        <h2 className="text-center">Something went wrong!</h2>
        <Button
          className="border bg-indigo-400 text-white shadow-sm hover:bg-indigo-900 focus-visible:outline-indigo-500 active:bg-indigo-600"
          onClick={
            // Attempt to recover by trying to re-render the posts route
            () => reset()
          }
        >
          Try again
        </Button>
      </div>
    </main>
  );
}
