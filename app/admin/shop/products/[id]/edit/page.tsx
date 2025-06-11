import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import Breadcrumbs from "@/app/_components/dashboard/breadcrumbs";
import ProductForm from "@/app/_components/dashboard/product-form";
import { db } from "@/db";

export const metadata: Metadata = {
  title: "Edit Product | SixStar Fitness",
  description: "Edit an existing product in your shop",
};

interface Props {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: Props) {
  const session = await auth();

  // Only allow admins to access this page
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch the product
  const product = await db.product.findUnique({
    where: {
      id: params.id,
    },
  });

  // If product not found, return 404
  if (!product) {
    notFound();
  }

  // Fetch all categories for the form
  const categories = await db.productCategory.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="w-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Admin Dashboard", href: "/admin" },
          { label: "Shop Management", href: "/admin/shop" },
          { label: "Products", href: "/admin/shop/products" },
          {
            label: `Edit: ${product.name}`,
            href: `/admin/shop/products/${product.id}/edit`,
            active: true,
          },
        ]}
      />

      <div className="mt-6">
        <h1 className="text-2xl font-semibold text-[#2A2A2A]">Edit Product</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update the product information below.
        </p>
      </div>

      <div className="mt-6">
        <ProductForm
          categories={categories}
          product={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: Number(product.price),
            salePrice: product.salePrice ? Number(product.salePrice) : null,
            inventory: product.inventory,
            images: product.images,
            featured: product.featured,
            slug: product.slug,
            categoryId: product.categoryId,
          }}
        />
      </div>
    </div>
  );
}
