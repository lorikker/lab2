export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Action buttons skeleton */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-md">
          <div>
            <div className="h-6 w-40 animate-pulse rounded-md bg-gray-200"></div>
            <div className="mt-2 h-4 w-48 animate-pulse rounded-md bg-gray-200"></div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="h-10 w-32 animate-pulse rounded-md bg-gray-200"></div>
            <div className="h-10 w-32 animate-pulse rounded-md bg-gray-200"></div>
            <div className="h-10 w-32 animate-pulse rounded-md bg-gray-200"></div>
          </div>
        </div>
        
        {/* Invoice skeleton */}
        <div className="rounded-lg bg-white p-8 shadow-lg">
          {/* Header skeleton */}
          <div className="mb-8 flex flex-col items-start justify-between border-b border-gray-200 pb-8 md:flex-row md:items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="mr-3 h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
                <div>
                  <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200"></div>
                  <div className="mt-2 h-4 w-48 animate-pulse rounded-md bg-gray-200"></div>
                </div>
              </div>
            </div>
            <div className="h-24 w-40 animate-pulse rounded-md bg-gray-200"></div>
          </div>
          
          {/* Billing Info skeleton */}
          <div className="mb-8 grid gap-8 md:grid-cols-2">
            <div>
              <div className="mb-2 h-4 w-24 animate-pulse rounded-md bg-gray-200"></div>
              <div className="h-5 w-32 animate-pulse rounded-md bg-gray-200"></div>
              <div className="mt-2 h-4 w-48 animate-pulse rounded-md bg-gray-200"></div>
              <div className="mt-2 h-4 w-40 animate-pulse rounded-md bg-gray-200"></div>
              <div className="mt-2 h-4 w-32 animate-pulse rounded-md bg-gray-200"></div>
            </div>
            <div>
              <div className="mb-2 h-4 w-24 animate-pulse rounded-md bg-gray-200"></div>
              <div className="h-5 w-32 animate-pulse rounded-md bg-gray-200"></div>
              <div className="mt-2 h-4 w-48 animate-pulse rounded-md bg-gray-200"></div>
              <div className="mt-4 h-5 w-32 animate-pulse rounded-md bg-gray-200"></div>
              <div className="mt-2 h-4 w-48 animate-pulse rounded-md bg-gray-200"></div>
            </div>
          </div>
          
          {/* Invoice Items skeleton */}
          <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
            <div className="h-12 w-full animate-pulse bg-gray-200"></div>
            <div className="h-16 w-full animate-pulse bg-white"></div>
            <div className="h-12 w-full animate-pulse bg-gray-200"></div>
            <div className="h-12 w-full animate-pulse bg-white"></div>
            <div className="h-12 w-full animate-pulse bg-gray-200"></div>
          </div>
          
          {/* Payment Status skeleton */}
          <div className="mb-8 h-16 w-full animate-pulse rounded-lg bg-gray-200"></div>
          
          {/* Plan Details skeleton */}
          <div className="mb-8 rounded-lg bg-gray-100 p-6">
            <div className="mb-4 h-6 w-32 animate-pulse rounded-md bg-gray-200"></div>
            <div className="space-y-2">
              <div className="h-5 w-full animate-pulse rounded-md bg-gray-200"></div>
              <div className="h-5 w-full animate-pulse rounded-md bg-gray-200"></div>
              <div className="h-5 w-full animate-pulse rounded-md bg-gray-200"></div>
              <div className="h-5 w-full animate-pulse rounded-md bg-gray-200"></div>
            </div>
          </div>
          
          {/* Footer skeleton */}
          <div className="border-t border-gray-200 pt-8 text-center">
            <div className="mx-auto h-4 w-64 animate-pulse rounded-md bg-gray-200"></div>
            <div className="mx-auto mt-2 h-4 w-80 animate-pulse rounded-md bg-gray-200"></div>
            <div className="mt-4 flex justify-center space-x-4">
              <div className="h-5 w-32 animate-pulse rounded-md bg-gray-200"></div>
              <div className="h-5 w-32 animate-pulse rounded-md bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
