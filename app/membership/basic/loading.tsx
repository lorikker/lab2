export default function Loading() {
  return (
    <main className="flex flex-col">
      {/* Hero Section Skeleton */}
      <section className="relative flex min-h-[50vh] items-center justify-center bg-[#2A2A2A] text-white">
        <div className="relative z-10 container text-center">
          <div className="mb-6 h-12 w-3/4 animate-pulse rounded-lg bg-gray-700 mx-auto"></div>
          <div className="mx-auto mb-10 h-24 w-2/3 animate-pulse rounded-lg bg-gray-700"></div>
          <div className="mb-6 h-16 w-1/4 animate-pulse rounded-lg bg-gray-700 mx-auto"></div>
          <div className="h-12 w-1/3 animate-pulse rounded-lg bg-gray-700 mx-auto"></div>
        </div>
      </section>

      {/* Plan Navigation Skeleton */}
      <section className="bg-white py-4 shadow-md">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-32 animate-pulse rounded-md bg-gray-200"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="section bg-white">
        <div className="container">
          <div className="mb-12 text-center">
            <div className="mb-4 h-10 w-1/3 animate-pulse rounded-lg bg-gray-200 mx-auto"></div>
            <div className="mx-auto h-6 w-2/3 animate-pulse rounded-lg bg-gray-200"></div>
          </div>
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-16 w-full animate-pulse rounded-lg bg-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section Skeleton */}
      <section className="section bg-[#D9D9D9]">
        <div className="container">
          <div className="mb-12 text-center">
            <div className="mb-4 h-10 w-1/2 animate-pulse rounded-lg bg-gray-400 mx-auto"></div>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-lg border border-[#2A2A2A] bg-white p-6 shadow-sm">
                <div className="mb-3 h-8 w-2/3 animate-pulse rounded-lg bg-gray-200"></div>
                <div className="h-16 w-full animate-pulse rounded-lg bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Skeleton */}
      <section className="section bg-[#D5FC51]">
        <div className="container text-center">
          <div className="mb-6 h-10 w-2/3 animate-pulse rounded-lg bg-gray-700 mx-auto"></div>
          <div className="mx-auto mb-8 h-16 w-1/2 animate-pulse rounded-lg bg-gray-700"></div>
          <div className="h-12 w-1/3 animate-pulse rounded-lg bg-gray-700 mx-auto"></div>
        </div>
      </section>
    </main>
  );
}
