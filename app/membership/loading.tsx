export default function Loading() {
  return (
    <main className="flex flex-col">
      {/* Hero Section Skeleton */}
      <section className="relative flex min-h-[50vh] items-center justify-center bg-[#2A2A2A] text-white">
        <div className="relative z-10 container text-center">
          <div className="mb-6 h-12 w-3/4 animate-pulse rounded-lg bg-gray-700 mx-auto"></div>
          <div className="mx-auto mb-10 h-24 w-2/3 animate-pulse rounded-lg bg-gray-700"></div>
        </div>
      </section>

      {/* Pricing Section Skeleton */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border border-[#D9D9D9] bg-white p-6 shadow-sm">
                <div className="mb-2 h-8 w-1/3 animate-pulse rounded-lg bg-gray-200"></div>
                <div className="mb-6 h-10 w-1/2 animate-pulse rounded-lg bg-gray-200"></div>
                <div className="mb-6 space-y-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-6 w-full animate-pulse rounded-lg bg-gray-200"></div>
                  ))}
                </div>
                <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section Skeleton */}
      <section className="section bg-[#D9D9D9]">
        <div className="container">
          <div className="mb-12 text-center">
            <div className="mb-4 h-10 w-1/3 animate-pulse rounded-lg bg-gray-400 mx-auto"></div>
            <div className="mx-auto h-6 w-2/3 animate-pulse rounded-lg bg-gray-400"></div>
          </div>
          <div className="mx-auto max-w-3xl">
            {[1, 2, 3].map((i) => (
              <div key={i} className="mb-6 rounded-lg border border-[#2A2A2A] bg-white p-6">
                <div className="mb-2 h-8 w-2/3 animate-pulse rounded-lg bg-gray-200"></div>
                <div className="h-16 w-full animate-pulse rounded-lg bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
