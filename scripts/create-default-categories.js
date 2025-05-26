// This script creates default product categories
// Run with: node scripts/create-default-categories.js

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const defaultCategories = [
  {
    name: "Memberships",
    slug: "memberships",
    description: "Gym membership plans and packages",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Equipment",
    slug: "equipment",
    description: "Fitness equipment for home and gym use",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Nutrition",
    slug: "nutrition",
    description: "Supplements, protein powders, and nutritional products",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Apparel",
    slug: "apparel",
    description: "Fitness clothing and accessories",
    image:
      "https://images.unsplash.com/photo-1539710094188-9bae661a85e4?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Fitness accessories and gadgets",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
  },
];

async function createCategories() {
  try {
    console.log("Creating default product categories...");

    for (const category of defaultCategories) {
      // Check if category already exists
      const existingCategory = await prisma.productCategory.findUnique({
        where: { slug: category.slug },
      });

      if (!existingCategory) {
        // Create the category
        const newCategory = await prisma.productCategory.create({
          data: category,
        });
        console.log(`Created category: ${newCategory.name}`);
      } else {
        console.log(`Category already exists: ${existingCategory.name}`);
      }
    }

    console.log("Default categories created successfully!");
  } catch (error) {
    console.error("Error creating categories:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createCategories();
