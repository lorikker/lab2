import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  fetchCategoryBySlug,
  fetchProductsByCategory,
} from "@/app/lib/shop-data";
import ProductCard from "@/app/_components/shop/product-card";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

type Props = {
  params: {
    slug: string;
  };
};

// We'll use a simpler approach for metadata to avoid conflicts
export const metadata: Metadata = {
  title: "Shop Category | SixStar Fitness",
  description: "Browse products by category",
};

export default async function CategoryPage({ params }: Props) {
  const category = await fetchCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const products = await fetchProductsByCategory(params.slug);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-white pt-24 font-sans">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center text-sm text-gray-500">
          <Link href="/shop" className="hover:text-[#D5FC51]">
            Shop
          </Link>
          <ChevronRightIcon className="mx-2 h-4 w-4" />
          <span className="font-medium text-[#2A2A2A]">{category.name}</span>
        </div>

        {/* Category header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#2A2A2A]">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-2 text-gray-600">{category.description}</p>
            )}
          </div>

          {/* Sort options could go here */}
        </div>

        {/* Products grid */}
        {products.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-medium text-[#2A2A2A]">
              No products found
            </h2>
            <p className="mt-2 text-gray-600">
              We couldn't find any products in this category.
            </p>
            <Link
              href="/shop"
              className="mt-4 inline-block rounded-md bg-[#D5FC51] px-4 py-2 font-medium text-[#2A2A2A] transition-colors hover:bg-[#D5FC51]/80"
            >
              Back to Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
