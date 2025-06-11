import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";

// Use the singleton Prisma client
const prisma = db;

// Helper function to add review data to products
async function addReviewData(products: any[]): Promise<Product[]> {
  try {
    // Connect to MongoDB
    const { MongoClient } = require("mongodb");
    const client = new MongoClient(process.env.MONGODB_URI as string);
    await client.connect();

    const db = client.db("lab2");

    // Process each product
    const productsWithReviews = await Promise.all(
      products.map(async (product) => {
        // Get review stats from MongoDB
        const reviews = await db
          .collection("reviews")
          .find({ productId: product.id })
          .toArray();

        const averageRating =
          reviews.length > 0
            ? reviews.reduce(
                (sum: number, review: any) => sum + review.rating,
                0,
              ) / reviews.length
            : 0;

        // Convert Decimal objects to numbers
        return {
          ...product,
          price: Number(product.price),
          salePrice: product.salePrice ? Number(product.salePrice) : null,
          averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
          reviewCount: reviews.length,
        };
      }),
    );

    await client.close();
    return productsWithReviews;
  } catch (error) {
    console.error("Error adding review data:", error);

    // If there's an error, just convert Decimal objects to numbers without review data
    return products.map((product) => ({
      ...product,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
    }));
  }
}

// For testing purposes, we'll use a mock database with some sample data
const mockProducts = [
  {
    id: "1",
    name: "Monthly Membership",
    description: "Access to gym equipment and classes for one month",
    price: 49.99,
    salePrice: null,
    inventory: 999,
    images: ["/images/products/membership.jpg"],
    featured: true,
    slug: "monthly-membership",
    categoryId: "1",
    category: {
      id: "1",
      name: "Memberships",
      slug: "memberships",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Premium Plan",
    description:
      "Includes nutrition consultation, workout plan, and trainer access",
    price: 99.99,
    salePrice: 89.99,
    inventory: 999,
    images: ["/images/products/premium-plan.jpg"],
    featured: true,
    slug: "premium-plan",
    categoryId: "1",
    category: {
      id: "1",
      name: "Memberships",
      slug: "memberships",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Protein Powder",
    description: "High-quality whey protein for muscle recovery",
    price: 29.99,
    salePrice: null,
    inventory: 50,
    images: ["/images/products/protein.jpg"],
    featured: true,
    slug: "protein-powder",
    categoryId: "2",
    category: {
      id: "2",
      name: "Nutrition",
      slug: "nutrition",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Dumbbells Set",
    description: "Set of adjustable dumbbells for home workouts",
    price: 149.99,
    salePrice: 129.99,
    inventory: 15,
    images: ["/images/products/dumbbells.jpg"],
    featured: true,
    slug: "dumbbells-set",
    categoryId: "3",
    category: {
      id: "3",
      name: "Equipment",
      slug: "equipment",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockCategories = [
  {
    id: "1",
    name: "Memberships",
    description: "Gym membership plans and packages",
    slug: "memberships",
    image: "/images/categories/memberships.jpg",
  },
  {
    id: "2",
    name: "Nutrition",
    description: "Supplements and nutrition products",
    slug: "nutrition",
    image: "/images/categories/nutrition.jpg",
  },
  {
    id: "3",
    name: "Equipment",
    description: "Fitness equipment for home and gym",
    slug: "equipment",
    image: "/images/categories/equipment.jpg",
  },
  {
    id: "4",
    name: "Apparel",
    description: "Workout clothes and accessories",
    slug: "apparel",
    image: "/images/categories/apparel.jpg",
  },
  {
    id: "5",
    name: "Bundles",
    description: "Product bundles and kits",
    slug: "bundles",
    image: "/images/categories/bundles.jpg",
  },
];

// Product Types
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  inventory: number;
  images: string[];
  featured: boolean;
  slug: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: Date;
  updatedAt: Date;
  averageRating?: number;
  reviewCount?: number;
};

export type Category = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  image: string | null;
};

export type Bundle = {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  images: string[];
  featured: boolean;
  slug: string;
  items?: {
    id: string;
    quantity: number;
    product: Product;
  }[];
};

export type CartItem = {
  id: string;
  quantity: number;
  product?: Product | null;
  bundle?: Bundle | null;
};

export type Cart = {
  id: string;
  items: CartItem[];
  total: number;
};

export type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

// Fetch all product categories
export async function fetchCategories(): Promise<Category[]> {
  try {
    // Use the database to fetch categories
    return await prisma.productCategory.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch product categories.");
  }
}

// Fetch a single category by slug
export async function fetchCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  try {
    // Use the database to fetch the category
    return await prisma.productCategory.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch category.");
  }
}

// Fetch featured products
export async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    // Use the database to fetch featured products
    const products = await prisma.product.findMany({
      where: { featured: true },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    // Add review data and convert Decimal objects to numbers
    return await addReviewData(products);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch featured products.");
  }
}

// Fetch products by category
export async function fetchProductsByCategory(
  categorySlug: string,
): Promise<Product[]> {
  try {
    // Use the database to fetch products by category
    const products = await prisma.product.findMany({
      where: {
        category: { slug: categorySlug },
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { name: "asc" },
    });

    // Add review data and convert Decimal objects to numbers
    return await addReviewData(products);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch products by category.");
  }
}

// Fetch a single product by slug
export async function fetchProductBySlug(
  slug: string,
): Promise<Product | null> {
  try {
    // Use the database to fetch the product
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!product) return null;

    // Add review data and convert Decimal objects to numbers
    const productsWithReviews = await addReviewData([product]);
    return productsWithReviews[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch product.");
  }
}

// Fetch product reviews
export async function fetchProductReviews(
  productId: string,
): Promise<Review[]> {
  try {
    // Connect to MongoDB
    const { MongoClient } = require("mongodb");
    const client = new MongoClient(process.env.MONGODB_URI as string);
    await client.connect();

    const db = client.db("lab2");
    const reviews = await db
      .collection("reviews")
      .find({ productId })
      .sort({ createdAt: -1 })
      .toArray();

    await client.close();

    return reviews;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch product reviews.");
  }
}

// Fetch bundles
export async function fetchBundles(): Promise<Bundle[]> {
  try {
    // Use the database to fetch bundles
    return await prisma.bundle.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch bundles.");
  }
}

// Fetch a single bundle by slug
export async function fetchBundleBySlug(slug: string): Promise<Bundle | null> {
  try {
    // Use the database to fetch the bundle
    return await prisma.bundle.findUnique({
      where: {
        slug,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch bundle.");
  }
}

// Fetch user cart
export async function fetchUserCart(): Promise<Cart | null> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      // For non-logged in users, return an empty cart
      return {
        id: "guest-cart",
        items: [],
        total: 0,
      };
    }

    // For logged-in users, fetch from database
    let cart = await prisma.cart.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
            bundle: {
              include: {
                items: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
              bundle: {
                include: {
                  items: {
                    include: {
                      product: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    // Calculate total
    let total = 0;

    for (const item of cart.items) {
      if (item.product) {
        const price = item.product.salePrice || item.product.price;
        total += Number(price) * item.quantity;
      } else if (item.bundle) {
        const price = item.bundle.salePrice || item.bundle.price;
        total += Number(price) * item.quantity;
      }
    }

    // Convert Decimal objects to numbers
    const serializedCart = {
      ...cart,
      items: cart.items.map((item) => ({
        ...item,
        product: item.product
          ? {
              ...item.product,
              price: Number(item.product.price),
              salePrice: item.product.salePrice
                ? Number(item.product.salePrice)
                : null,
            }
          : null,
        bundle: item.bundle
          ? {
              ...item.bundle,
              price: Number(item.bundle.price),
              salePrice: item.bundle.salePrice
                ? Number(item.bundle.salePrice)
                : null,
              items: item.bundle.items.map((bundleItem) => ({
                ...bundleItem,
                product: bundleItem.product
                  ? {
                      ...bundleItem.product,
                      price: Number(bundleItem.product.price),
                      salePrice: bundleItem.product.salePrice
                        ? Number(bundleItem.product.salePrice)
                        : null,
                    }
                  : null,
              })),
            }
          : null,
      })),
      total,
    };

    return serializedCart;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user cart.");
  }
}
