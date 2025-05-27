"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { getOrCreateDefaultCategory } from "./ensure-default-category";

// Create a new category
export async function createCategory(formData: FormData) {
  const session = await auth();

  // Only allow admins to create categories
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Get form data
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const slug = formData.get("slug") as string;
  const image = formData.get("image") as string;

  // Validate required fields
  if (!name || !slug) {
    throw new Error("Name and slug are required");
  }

  // Create the category
  await db.productCategory.create({
    data: {
      name,
      description,
      slug,
      image: image || null,
    },
  });

  // Revalidate the categories page
  revalidatePath("/dashboard/shop/categories");
  revalidatePath("/shop");
}

// Update an existing category
export async function updateCategory(formData: FormData) {
  const session = await auth();

  // Only allow admins to update categories
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Get form data
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const slug = formData.get("slug") as string;
  const image = formData.get("image") as string;

  // Validate required fields
  if (!id || !name || !slug) {
    throw new Error("ID, name, and slug are required");
  }

  // Update the category
  await db.productCategory.update({
    where: { id },
    data: {
      name,
      description,
      slug,
      image: image || null,
    },
  });

  // Revalidate the categories page
  revalidatePath("/dashboard/shop/categories");
  revalidatePath(`/shop/category/${slug}`);
  revalidatePath("/shop");
}

// Delete a category
export async function deleteCategory(formData: FormData) {
  const session = await auth();

  // Only allow admins to delete categories
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Get category ID
  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("Category ID is required");
  }

  // Get the category to check if it has products
  const category = await db.productCategory.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // Prevent deletion of the "Uncategorized" category
  if (category.slug === "uncategorized") {
    throw new Error(
      "Cannot delete the 'Uncategorized' category. This is a system category used to hold products when other categories are deleted.",
    );
  }

  // If the category has products, update them to use a default category
  if (category._count.products > 0) {
    // Get or create the default "Uncategorized" category
    const defaultCategory = await getOrCreateDefaultCategory();

    // Update all products in this category to use the default category
    await db.product.updateMany({
      where: {
        categoryId: id,
      },
      data: {
        categoryId: defaultCategory.id,
      },
    });
  }

  // Delete the category
  await db.productCategory.delete({
    where: { id },
  });

  // Revalidate the categories page
  revalidatePath("/dashboard/shop/categories");
  revalidatePath("/shop");
}
