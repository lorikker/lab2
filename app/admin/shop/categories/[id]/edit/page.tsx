import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import Breadcrumbs from "@/app/_components/dashboard/breadcrumbs";
import CategoryForm from "@/app/_components/dashboard/category-form";
import { db } from "@/db";

export const metadata: Metadata = {
  title: "Edit Category | SixStar Fitness",
  description: "Edit an existing product category",
};

interface Props {
  params: {
    id: string;
  };
}

export default async function EditCategoryPage({ params }: Props) {
  const session = await auth();

  // Only allow admins to access this page
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch the category
  const category = await db.productCategory.findUnique({
    where: {
      id: params.id,
    },
  });

  // If category not found, return 404
  if (!category) {
    notFound();
  }

  return (
    <div className="w-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Admin Dashboard", href: "/admin" },
          { label: "Shop Management", href: "/admin/shop" },
          { label: "Categories", href: "/admin/shop/categories" },
          {
            label: `Edit: ${category.name}`,
            href: `/admin/shop/categories/${category.id}/edit`,
            active: true,
          },
        ]}
      />

      <div className="mt-6">
        <h1 className="text-2xl font-semibold text-[#2A2A2A]">Edit Category</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update the category information below.
        </p>
      </div>

      <div className="mt-6">
        <CategoryForm
          category={{
            id: category.id,
            name: category.name,
            description: category.description,
            slug: category.slug,
            image: category.image,
          }}
        />
      </div>
    </div>
  );
}
