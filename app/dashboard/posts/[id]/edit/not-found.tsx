import Link from "next/link";
import { FaceFrownIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 font-sans">
      <div className="flex min-w-[200px] flex-col items-center justify-center gap-4 rounded-lg border bg-white p-8">
        <FaceFrownIcon className="w-10 text-gray-400" />
        <h2 className="text-xl font-semibold">404 Not Found</h2>
        <p>Could not find the requested post.</p>
        <Link
          href="/dashboard/posts"
          className="flex h-10 items-center rounded-lg border bg-indigo-400 px-4 py-4 text-white shadow-sm hover:bg-indigo-900 focus-visible:outline-indigo-500 active:bg-indigo-600"
        >
          Go Back
        </Link>
      </div>
    </main>
  );
}
