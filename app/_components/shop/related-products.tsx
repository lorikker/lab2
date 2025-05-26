import {
  fetchProductsByCategory,
  fetchCategoryBySlug,
} from "@/app/lib/shop-data";
import ProductCard from "./product-card";
import { db } from "@/db";

export default async function RelatedProducts({
  categoryId,
  currentProductId,
}: {
  categoryId: string;
  currentProductId: string;
}) {
  // Get the category slug from the categoryId
  const category = await db.productCategory.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    return null;
  }

  // Fetch products from the same category
  const allCategoryProducts = await fetchProductsByCategory(category.slug);

  // Filter out the current product and limit to 4 products
  const relatedProducts = allCategoryProducts
    .filter((product) => product.id !== currentProductId)
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-[#2A2A2A]">
        Related Products
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
