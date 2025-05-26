import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import Breadcrumbs from "@/app/_components/dashboard/breadcrumbs";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/outline";
import DeleteCategoryButton from "@/app/_components/dashboard/delete-category-button";

export const metadata: Metadata = {
  title: "Categories Management | SixStar Fitness",
  description: "Manage your product categories",
};

export default async function CategoriesManagementPage() {
  const session = await auth();

  // Only allow admins to access this page
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch all categories with product count
  const categories = await db.productCategory.findMany({
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumbs
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Shop Management", href: "/dashboard/shop" },
            {
              label: "Categories",
              href: "/dashboard/shop/categories",
              active: true,
            },
          ]}
        />

        <Link
          href="/dashboard/shop/categories/new"
          className="mt-4 inline-flex items-center rounded-md bg-[#D5FC51] px-4 py-2 text-sm font-medium text-[#2A2A2A] transition-colors hover:bg-[#D5FC51]/80 sm:mt-0"
        >
          <PlusIcon className="mr-2 h-5 w-5" />
          Add New Category
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Slug
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Products
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No categories found. Create your first category to get
                    started.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                              <span className="text-xs text-gray-400">
                                No image
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {category._count.products}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/dashboard/shop/categories/${category.id}/edit`}
                          className="rounded p-1 text-blue-600 hover:bg-blue-50"
                          title="Edit category"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <DeleteCategoryButton
                          categoryId={category.id}
                          categoryName={category.name}
                          productCount={category._count.products}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
