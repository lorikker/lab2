"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">Something went wrong!</h2>
        <p className="mb-4 text-gray-600">
          We encountered an error while loading this page.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => reset()}
            className="hover:bg-opacity-90 rounded bg-[#D5FC51] px-4 py-2 font-medium text-black"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
