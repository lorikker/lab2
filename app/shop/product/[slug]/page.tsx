import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProductBySlug, fetchProductReviews } from "@/app/lib/shop-data";
import ProductDetail from "@/app/_components/shop/product-detail";
import ProductReviews from "@/app/_components/shop/product-reviews";
import RelatedProducts from "@/app/_components/shop/related-products";

type Props = {
  params: {
    slug: string;
  };
};

// We'll use a simpler approach for metadata to avoid conflicts
export const metadata: Metadata = {
  title: "Product Details | SixStar Fitness Shop",
  description: "View product details and add to cart",
};

export default async function ProductPage({ params }: Props) {
  const product = await fetchProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const reviews = await fetchProductReviews(product.id);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-white pt-24 font-sans">
      <div className="container mx-auto px-4 py-8">
        <ProductDetail product={product} />

        <div className="mt-16">
          <ProductReviews productId={product.id} reviews={reviews} />
        </div>

        <div className="mt-16">
          <RelatedProducts
            categoryId={product.categoryId}
            currentProductId={product.id}
          />
        </div>
      </div>
    </main>
  );
}
