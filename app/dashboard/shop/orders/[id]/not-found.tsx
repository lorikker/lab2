import Link from "next/link";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <div className="text-center">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h1 className="mt-4 text-2xl font-semibold text-gray-900">Order Not Found</h1>
        <p className="mt-2 text-gray-600">
          The order you're looking for doesn't exist or has been removed.
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard/shop/orders"
            className="inline-flex items-center rounded-md bg-[#D5FC51] px-4 py-2 text-sm font-medium text-[#2A2A2A] transition-colors hover:bg-[#D5FC51]/80"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
