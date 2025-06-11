import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Breadcrumbs from "@/app/_components/dashboard/breadcrumbs";
import ProductForm from "@/app/_components/dashboard/product-form";
import { db } from "@/db";

export const metadata: Metadata = {
  title: "Add New Product | SixStar Fitness",
  description: "Add a new product to your shop",
};

export default async function NewProductPage() {
  const session = await auth();

  // Only allow admins to access this page
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
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
            label: "Add New Product",
            href: "/admin/shop/products/new",
            active: true,
          },
        ]}
      />

      <div className="mt-6">
        <h1 className="text-2xl font-semibold text-[#2A2A2A]">
          Add New Product
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Fill out the form below to add a new product to your shop.
        </p>
      </div>

      <div className="mt-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
