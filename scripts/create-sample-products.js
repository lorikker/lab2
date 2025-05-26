// This script creates sample products
// Run with: node scripts/create-sample-products.js

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const sampleProducts = [
  {
    name: "Premium Gym Membership",
    description:
      "Access to all gym facilities, classes, and amenities. Includes personal trainer sessions twice a month.",
    price: 99.99,
    salePrice: 89.99,
    inventory: 100,
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1000&auto=format&fit=crop",
    ],
    featured: true,
    slug: "premium-gym-membership",
    categorySlug: "memberships",
  },
  {
    name: "Adjustable Dumbbell Set",
    description:
      "Adjustable dumbbell set with weights ranging from 5 to 50 pounds. Perfect for home workouts.",
    price: 299.99,
    salePrice: null,
    inventory: 25,
    images: [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    ],
    featured: true,
    slug: "adjustable-dumbbell-set",
    categorySlug: "equipment",
  },
  {
    name: "Whey Protein Powder",
    description:
      "High-quality whey protein powder with 25g of protein per serving. Available in chocolate, vanilla, and strawberry flavors.",
    price: 49.99,
    salePrice: 39.99,
    inventory: 50,
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1612532275214-e4ca76d0e4d1?q=80&w=1000&auto=format&fit=crop",
    ],
    featured: false,
    slug: "whey-protein-powder",
    categorySlug: "nutrition",
  },
  {
    name: "Performance Training Shirt",
    description:
      "Moisture-wicking training shirt designed for maximum comfort and performance during workouts.",
    price: 34.99,
    salePrice: 29.99,
    inventory: 75,
    images: [
      "https://images.unsplash.com/photo-1539710094188-9bae661a85e4?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=1000&auto=format&fit=crop",
    ],
    featured: false,
    slug: "performance-training-shirt",
    categorySlug: "apparel",
  },
  {
    name: "Fitness Tracker Watch",
    description:
      "Advanced fitness tracker with heart rate monitoring, GPS, and workout tracking features.",
    price: 129.99,
    salePrice: 99.99,
    inventory: 30,
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000&auto=format&fit=crop",
    ],
    featured: true,
    slug: "fitness-tracker-watch",
    categorySlug: "accessories",
  },
];

async function createProducts() {
  try {
    console.log("Creating sample products...");

    for (const product of sampleProducts) {
      // Check if product already exists
      const existingProduct = await prisma.product.findUnique({
        where: { slug: product.slug },
      });

      if (!existingProduct) {
        // Find the category
        const category = await prisma.productCategory.findUnique({
          where: { slug: product.categorySlug },
        });

        if (!category) {
          console.log(`Category not found for product: ${product.name}`);
          continue;
        }

        // Create the product
        const { categorySlug, ...productData } = product;
        const newProduct = await prisma.product.create({
          data: {
            ...productData,
            categoryId: category.id,
          },
        });
        console.log(`Created product: ${newProduct.name}`);
      } else {
        console.log(`Product already exists: ${existingProduct.name}`);
      }
    }

    console.log("Sample products created successfully!");
  } catch (error) {
    console.error("Error creating products:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createProducts();
