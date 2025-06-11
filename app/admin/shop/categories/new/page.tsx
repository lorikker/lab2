import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Breadcrumbs from "@/app/_components/dashboard/breadcrumbs";
import CategoryForm from "@/app/_components/dashboard/category-form";

export const metadata: Metadata = {
  title: "Add New Category | SixStar Fitness",
  description: "Add a new product category to your shop",
};

export default async function NewCategoryPage() {
  const session = await auth();
  
  // Only allow admins to access this page
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  
  return (
    <div className="w-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Admin Dashboard", href: "/admin" },
          { label: "Shop Management", href: "/admin/shop" },
          { label: "Categories", href: "/admin/shop/categories" },
          { label: "Add New Category", href: "/admin/shop/categories/new", active: true },
        ]}
      />
      
      <div className="mt-6">
        <h1 className="text-2xl font-semibold text-[#2A2A2A]">Add New Category</h1>
        <p className="mt-2 text-sm text-gray-600">
          Fill out the form below to add a new product category to your shop.
        </p>
      </div>
      
      <div className="mt-6">
        <CategoryForm />
      </div>
    </div>
  );
}
