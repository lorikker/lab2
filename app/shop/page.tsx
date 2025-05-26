import { Metadata } from "next";
import { Suspense } from "react";
import ShopContent from "@/app/_components/shop/shop-content";

export const metadata: Metadata = {
  title: "Shop | SixStar Fitness",
  description:
    "Browse our selection of fitness products, supplements, and memberships",
};

export default function ShopPage({
  searchParams,
}: {
  searchParams?: {
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    page?: string;
  };
}) {
  return (
    <main className="min-h-screen bg-gray-50 pt-20 font-sans">
      {/* Minimalist Hero Section */}
      <div className="bg-gray-50">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-light tracking-tight text-gray-900">
              Shop
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm font-light text-gray-600">
              Discover premium fitness essentials
            </p>
          </div>
        </div>
      </div>

      {/* Shop Content with Filters */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
          </div>
        }
      >
        <ShopContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
