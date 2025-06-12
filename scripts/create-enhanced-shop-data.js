import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Enhanced categories with local images
const enhancedCategories = [
  {
    name: "Memberships",
    slug: "memberships",
    description: "Gym membership plans and packages for all fitness levels",
    image: "/uploads/categories/memberships.jpg",
  },
  {
    name: "Equipment",
    slug: "equipment",
    description: "Professional fitness equipment for home and gym use",
    image: "/uploads/categories/equipment.jpg",
  },
  {
    name: "Nutrition",
    slug: "nutrition",
    description: "Supplements, protein powders, and nutritional products",
    image: "/uploads/categories/nutrition.jpg",
  },
  {
    name: "Apparel",
    slug: "apparel",
    description: "High-performance fitness clothing and accessories",
    image: "/uploads/categories/apparel.svg",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Fitness accessories, gadgets, and training tools",
    image: "/uploads/categories/accessories.jpg",
  },
  {
    name: "Bundles",
    slug: "bundles",
    description: "Curated product bundles and starter kits",
    image: "/uploads/categories/bundles.jpg",
  },
  {
    name: "Recovery",
    slug: "recovery",
    description: "Recovery tools, massage equipment, and wellness products",
    image: "/uploads/categories/recovery.jpg",
  },
  {
    name: "Cardio",
    slug: "cardio",
    description: "Cardio equipment and accessories for endurance training",
    image: "/uploads/categories/cardio.jpg",
  },
];

// Enhanced products with local images
const enhancedProducts = [
  // Memberships
  {
    name: "Basic Gym Membership",
    description:
      "Access to gym equipment and basic facilities. Perfect for beginners starting their fitness journey.",
    price: 29.99,
    salePrice: null,
    inventory: 999,
    images: ["/uploads/products/basic-membership.jpg"],
    featured: false,
    slug: "basic-gym-membership",
    categorySlug: "memberships",
  },
  {
    name: "Premium Membership",
    description:
      "Full access to all facilities, group classes, and premium amenities. Includes guest passes.",
    price: 59.99,
    salePrice: 49.99,
    inventory: 999,
    images: ["/uploads/products/premium-membership.jpg"],
    featured: true,
    slug: "premium-membership",
    categorySlug: "memberships",
  },
  {
    name: "VIP Elite Membership",
    description:
      "Ultimate fitness experience with personal training sessions, nutrition consultation, and exclusive access.",
    price: 129.99,
    salePrice: null,
    inventory: 999,
    images: ["/uploads/products/vip-membership.jpg"],
    featured: true,
    slug: "vip-elite-membership",
    categorySlug: "memberships",
  },

  // Equipment
  {
    name: "Adjustable Dumbbell Set",
    description:
      "Professional adjustable dumbbells ranging from 5-50 lbs. Perfect for home workouts and strength training.",
    price: 299.99,
    salePrice: 249.99,
    inventory: 25,
    images: [
      "/uploads/products/adjustable-dumbbells.jpg",
      "/uploads/products/dumbbells-detail.jpg",
    ],
    featured: true,
    slug: "adjustable-dumbbell-set",
    categorySlug: "equipment",
  },
  {
    name: "Olympic Barbell",
    description:
      "Professional grade Olympic barbell, 45 lbs, perfect for deadlifts, squats, and bench press.",
    price: 189.99,
    salePrice: null,
    inventory: 15,
    images: ["/uploads/products/olympic-barbell.jpg"],
    featured: false,
    slug: "olympic-barbell",
    categorySlug: "equipment",
  },
  {
    name: "Power Rack System",
    description:
      "Complete power rack system with pull-up bar, safety bars, and plate storage. Built for serious training.",
    price: 899.99,
    salePrice: 799.99,
    inventory: 8,
    images: [
      "/uploads/products/power-rack.jpg",
      "/uploads/products/power-rack-setup.jpg",
    ],
    featured: true,
    slug: "power-rack-system",
    categorySlug: "equipment",
  },
  {
    name: "Resistance Band Set",
    description:
      "Complete resistance band set with multiple resistance levels, door anchor, and exercise guide.",
    price: 39.99,
    salePrice: 29.99,
    inventory: 100,
    images: ["/uploads/products/resistance-bands.jpg"],
    featured: false,
    slug: "resistance-band-set",
    categorySlug: "equipment",
  },

  // Nutrition
  {
    name: "Whey Protein Isolate",
    description:
      "Premium whey protein isolate with 25g protein per serving. Available in chocolate and vanilla flavors.",
    price: 49.99,
    salePrice: null,
    inventory: 75,
    images: [
      "/uploads/products/whey-protein.jpg",
      "/uploads/products/protein-flavors.jpg",
    ],
    featured: true,
    slug: "whey-protein-isolate",
    categorySlug: "nutrition",
  },
  {
    name: "Pre-Workout Energy",
    description:
      "High-performance pre-workout supplement with caffeine, beta-alanine, and creatine for maximum energy.",
    price: 34.99,
    salePrice: 29.99,
    inventory: 60,
    images: ["/uploads/products/pre-workout.jpg"],
    featured: false,
    slug: "pre-workout-energy",
    categorySlug: "nutrition",
  },
  {
    name: "BCAA Recovery",
    description:
      "Branched-chain amino acids for muscle recovery and endurance. Refreshing fruit punch flavor.",
    price: 24.99,
    salePrice: null,
    inventory: 80,
    images: ["/uploads/products/bcaa.jpg"],
    featured: false,
    slug: "bcaa-recovery",
    categorySlug: "nutrition",
  },
  {
    name: "Multivitamin Complex",
    description:
      "Complete daily multivitamin designed for active individuals. Supports energy and immune function.",
    price: 19.99,
    salePrice: null,
    inventory: 120,
    images: ["/uploads/products/multivitamin.jpg"],
    featured: false,
    slug: "multivitamin-complex",
    categorySlug: "nutrition",
  },

  // Apparel
  {
    name: "Performance Tank Top",
    description:
      "Moisture-wicking performance tank top with anti-odor technology. Available in multiple colors.",
    price: 24.99,
    salePrice: 19.99,
    inventory: 150,
    images: [
      "/uploads/products/tank-top.svg",
      "/uploads/products/tank-colors.jpg",
    ],
    featured: false,
    slug: "performance-tank-top",
    categorySlug: "apparel",
  },
  {
    name: "Athletic Shorts",
    description:
      "Lightweight athletic shorts with built-in compression liner and side pockets for essentials.",
    price: 34.99,
    salePrice: null,
    inventory: 100,
    images: ["/uploads/products/athletic-shorts.jpg"],
    featured: false,
    slug: "athletic-shorts",
    categorySlug: "apparel",
  },
  {
    name: "Training Shoes",
    description:
      "Cross-training shoes designed for weightlifting, HIIT, and gym workouts. Superior grip and support.",
    price: 129.99,
    salePrice: 99.99,
    inventory: 45,
    images: [
      "/uploads/products/training-shoes.jpg",
      "/uploads/products/shoes-detail.jpg",
    ],
    featured: true,
    slug: "training-shoes",
    categorySlug: "apparel",
  },
  {
    name: "Compression Leggings",
    description:
      "High-waisted compression leggings with moisture-wicking fabric and phone pocket.",
    price: 49.99,
    salePrice: 39.99,
    inventory: 80,
    images: ["/uploads/products/compression-leggings.svg"],
    featured: false,
    slug: "compression-leggings",
    categorySlug: "apparel",
  },
];

async function createEnhancedShopData() {
  try {
    console.log("🚀 Creating enhanced shop data...");

    // Create categories first
    console.log("\n📁 Creating categories...");
    const createdCategories = {};

    for (const category of enhancedCategories) {
      try {
        const existingCategory = await prisma.productCategory.findUnique({
          where: { slug: category.slug },
        });

        if (!existingCategory) {
          const newCategory = await prisma.productCategory.create({
            data: category,
          });
          createdCategories[category.slug] = newCategory.id;
          console.log(`✅ Created category: ${newCategory.name}`);
        } else {
          createdCategories[category.slug] = existingCategory.id;
          console.log(`⚠️  Category already exists: ${existingCategory.name}`);
        }
      } catch (error) {
        console.error(
          `❌ Error creating category ${category.name}:`,
          error.message,
        );
      }
    }

    // Create products
    console.log("\n🛍️  Creating products...");

    for (const product of enhancedProducts) {
      try {
        const categoryId = createdCategories[product.categorySlug];
        if (!categoryId) {
          console.error(
            `❌ Category not found for slug: ${product.categorySlug}`,
          );
          continue;
        }

        const existingProduct = await prisma.product.findUnique({
          where: { slug: product.slug },
        });

        if (!existingProduct) {
          const { categorySlug, ...productData } = product;
          const newProduct = await prisma.product.create({
            data: {
              ...productData,
              categoryId,
            },
          });
          console.log(`✅ Created product: ${newProduct.name}`);
        } else {
          console.log(`⚠️  Product already exists: ${existingProduct.name}`);
        }
      } catch (error) {
        console.error(
          `❌ Error creating product ${product.name}:`,
          error.message,
        );
      }
    }

    console.log("\n🎉 Enhanced shop data creation completed!");
  } catch (error) {
    console.error("❌ Error creating enhanced shop data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createEnhancedShopData();
