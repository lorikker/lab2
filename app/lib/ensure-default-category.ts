import { db } from "@/db";

/**
 * Ensures that the "Uncategorized" system category exists in the database.
 * This function should be called during app initialization or when needed.
 * 
 * @returns Promise<void>
 */
export async function ensureDefaultCategory(): Promise<void> {
  try {
    // Check if the "Uncategorized" category already exists
    const existingCategory = await db.productCategory.findFirst({
      where: {
        slug: "uncategorized",
      },
    });

    // If it doesn't exist, create it
    if (!existingCategory) {
      await db.productCategory.create({
        data: {
          name: "Uncategorized",
          slug: "uncategorized",
          description:
            "System category for products that don't belong to any specific category. This category is automatically created and cannot be deleted.",
        },
      });
      
      console.log("✅ Created default 'Uncategorized' category");
    }
  } catch (error) {
    console.error("❌ Error ensuring default category exists:", error);
    // Don't throw the error to prevent app startup issues
  }
}

/**
 * Gets the "Uncategorized" category, creating it if it doesn't exist.
 * 
 * @returns Promise<ProductCategory> The uncategorized category
 */
export async function getOrCreateDefaultCategory() {
  // First try to find the existing category
  let defaultCategory = await db.productCategory.findFirst({
    where: {
      slug: "uncategorized",
    },
  });

  // If it doesn't exist, create it
  if (!defaultCategory) {
    defaultCategory = await db.productCategory.create({
      data: {
        name: "Uncategorized",
        slug: "uncategorized",
        description:
          "System category for products that don't belong to any specific category. This category is automatically created and cannot be deleted.",
      },
    });
  }

  return defaultCategory;
}
