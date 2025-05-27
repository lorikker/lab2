"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";

// Function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Create a new product
export async function createProduct(formData: FormData) {
  const session = await auth();

  // Only allow admins to create products
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Get form data
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const salePriceStr = formData.get("salePrice") as string;
  const salePrice = salePriceStr ? parseFloat(salePriceStr) : null;
  const inventory = parseInt(formData.get("inventory") as string);
  const categoryId = formData.get("categoryId") as string;
  let slug = formData.get("slug") as string;
  const featured = formData.has("featured");

  // Get image URLs
  const images = formData.getAll("images") as string[];

  // Validate required fields
  if (!name || !description || isNaN(price) || !categoryId) {
    throw new Error("Missing required fields");
  }

  // Generate slug if not provided or invalid
  if (!slug || slug.trim() === "" || slug.includes(" ")) {
    slug = generateSlug(name);
  }

  // Ensure slug is unique
  let finalSlug = slug;
  let counter = 1;
  while (true) {
    const existingProduct = await db.product.findUnique({
      where: { slug: finalSlug },
    });

    if (!existingProduct) {
      break;
    }

    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  // Create the product
  await db.product.create({
    data: {
      name,
      description,
      price,
      salePrice,
      inventory,
      categoryId,
      slug: finalSlug,
      featured,
      images,
    },
  });

  // Revalidate the products page
  revalidatePath("/dashboard/shop/products");
  revalidatePath("/shop");
}

// Update an existing product
export async function updateProduct(formData: FormData) {
  const session = await auth();

  // Only allow admins to update products
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Get form data
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const salePriceStr = formData.get("salePrice") as string;
  const salePrice = salePriceStr ? parseFloat(salePriceStr) : null;
  const inventory = parseInt(formData.get("inventory") as string);
  const categoryId = formData.get("categoryId") as string;
  let slug = formData.get("slug") as string;
  const featured = formData.has("featured");

  // Get image URLs
  const images = formData.getAll("images") as string[];

  // Validate required fields
  if (!id || !name || !description || isNaN(price) || !categoryId) {
    throw new Error("Missing required fields");
  }

  // Generate slug if not provided or invalid
  if (!slug || slug.trim() === "" || slug.includes(" ")) {
    slug = generateSlug(name);
  }

  // Ensure slug is unique (excluding current product)
  let finalSlug = slug;
  let counter = 1;
  while (true) {
    const existingProduct = await db.product.findUnique({
      where: { slug: finalSlug },
    });

    if (!existingProduct || existingProduct.id === id) {
      break;
    }

    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  // Update the product
  await db.product.update({
    where: { id },
    data: {
      name,
      description,
      price,
      salePrice,
      inventory,
      categoryId,
      slug: finalSlug,
      featured,
      images,
    },
  });

  // Revalidate the products page
  revalidatePath("/dashboard/shop/products");
  revalidatePath(`/shop/product/${finalSlug}`);
  revalidatePath("/shop");
}

// Delete a product
export async function deleteProduct(formData: FormData) {
  try {
    const session = await auth();

    // Only allow admins to delete products
    if (!session?.user || session.user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    // Get product ID
    const id = formData.get("id") as string;

    if (!id) {
      throw new Error("Product ID is required");
    }

    console.log("Attempting to delete product with ID:", id);

    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    console.log("Product found:", existingProduct.name);

    // Delete the product - related items will be handled by database constraints:
    // - CartItems: productId will be set to null (onDelete: SetNull)
    // - OrderItems: productId will be set to null (onDelete: SetNull)
    // - BundleItems: will be deleted automatically (onDelete: Cascade)
    // - Reviews: will be deleted automatically (onDelete: Cascade)
    await db.product.delete({
      where: { id },
    });

    console.log("Product deleted successfully");

    // Revalidate the products page
    revalidatePath("/dashboard/shop/products");
    revalidatePath("/shop");
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    throw error;
  }
}
