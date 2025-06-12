import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create placeholder images for the additional products
const additionalProductImages = {
  "kettlebell-set.jpg":
    "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=600&auto=format&fit=crop",
  "yoga-mat.jpg":
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
  "pull-up-bar.jpg":
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
  "creatine.jpg":
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=600&auto=format&fit=crop",
  "fat-burner.jpg":
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
  "omega-3.jpg":
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=600&auto=format&fit=crop",
  "hoodie.jpg":
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop",
  "sports-bra.jpg":
    "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?q=80&w=600&auto=format&fit=crop",
  "gym-gloves.jpg":
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
  "water-bottle.jpg":
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
  "gym-bag.jpg":
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
  "fitness-tracker.jpg":
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
  "foam-roller.jpg":
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
  "massage-gun.jpg":
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
  "ice-bath.jpg":
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
  "jump-rope.jpg":
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
  "battle-ropes.jpg":
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop",
  "agility-ladder.jpg":
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
};

// Additional products to expand the shop
const additionalProducts = [
  // More Equipment
  {
    name: "Kettlebell Set",
    description:
      "Cast iron kettlebell set with weights from 10-50 lbs. Perfect for functional training and HIIT workouts.",
    price: 199.99,
    salePrice: 179.99,
    inventory: 30,
    images: ["/uploads/products/kettlebell-set.jpg"],
    featured: false,
    slug: "kettlebell-set",
    categorySlug: "equipment",
  },
  {
    name: "Yoga Mat Premium",
    description:
      "Extra thick yoga mat with superior grip and cushioning. Eco-friendly and non-slip surface.",
    price: 49.99,
    salePrice: null,
    inventory: 85,
    images: ["/uploads/products/yoga-mat.jpg"],
    featured: false,
    slug: "yoga-mat-premium",
    categorySlug: "equipment",
  },
  {
    name: "Pull-Up Bar",
    description:
      "Doorway pull-up bar with multiple grip positions. No screws required, easy installation.",
    price: 39.99,
    salePrice: 34.99,
    inventory: 50,
    images: ["/uploads/products/pull-up-bar.jpg"],
    featured: false,
    slug: "pull-up-bar",
    categorySlug: "equipment",
  },

  // More Nutrition
  {
    name: "Creatine Monohydrate",
    description:
      "Pure creatine monohydrate powder for increased strength and muscle mass. Unflavored, 300g container.",
    price: 19.99,
    salePrice: null,
    inventory: 90,
    images: ["/uploads/products/creatine.jpg"],
    featured: false,
    slug: "creatine-monohydrate",
    categorySlug: "nutrition",
  },
  {
    name: "Fat Burner",
    description:
      "Thermogenic fat burner with natural ingredients. Supports metabolism and energy levels.",
    price: 39.99,
    salePrice: 34.99,
    inventory: 45,
    images: ["/uploads/products/fat-burner.jpg"],
    featured: false,
    slug: "fat-burner",
    categorySlug: "nutrition",
  },
  {
    name: "Omega-3 Fish Oil",
    description:
      "High-quality omega-3 fish oil capsules for heart health and recovery. 1000mg per serving.",
    price: 24.99,
    salePrice: null,
    inventory: 70,
    images: ["/uploads/products/omega-3.jpg"],
    featured: false,
    slug: "omega-3-fish-oil",
    categorySlug: "nutrition",
  },

  // More Apparel
  {
    name: "Hoodie Performance",
    description:
      "Lightweight performance hoodie with moisture-wicking technology. Perfect for warm-ups and cool-downs.",
    price: 59.99,
    salePrice: 49.99,
    inventory: 60,
    images: ["/uploads/products/hoodie.jpg"],
    featured: false,
    slug: "hoodie-performance",
    categorySlug: "apparel",
  },
  {
    name: "Sports Bra",
    description:
      "High-support sports bra with removable padding and adjustable straps. Available in multiple sizes.",
    price: 34.99,
    salePrice: null,
    inventory: 75,
    images: ["/uploads/products/sports-bra.svg"],
    featured: false,
    slug: "sports-bra",
    categorySlug: "apparel",
  },
  {
    name: "Gym Gloves",
    description:
      "Padded gym gloves with wrist support and breathable mesh. Protects hands during weightlifting.",
    price: 19.99,
    salePrice: 16.99,
    inventory: 100,
    images: ["/uploads/products/gym-gloves.jpg"],
    featured: false,
    slug: "gym-gloves",
    categorySlug: "apparel",
  },

  // Accessories
  {
    name: "Water Bottle Insulated",
    description:
      "Stainless steel insulated water bottle, 32oz capacity. Keeps drinks cold for 24 hours.",
    price: 29.99,
    salePrice: null,
    inventory: 120,
    images: ["/uploads/products/water-bottle.jpg"],
    featured: false,
    slug: "water-bottle-insulated",
    categorySlug: "accessories",
  },
  {
    name: "Gym Bag Large",
    description:
      "Spacious gym bag with separate shoe compartment and multiple pockets. Durable and water-resistant.",
    price: 49.99,
    salePrice: 39.99,
    inventory: 40,
    images: ["/uploads/products/gym-bag.jpg"],
    featured: false,
    slug: "gym-bag-large",
    categorySlug: "accessories",
  },
  {
    name: "Fitness Tracker",
    description:
      "Advanced fitness tracker with heart rate monitor, GPS, and 7-day battery life.",
    price: 149.99,
    salePrice: 129.99,
    inventory: 25,
    images: ["/uploads/products/fitness-tracker.jpg"],
    featured: true,
    slug: "fitness-tracker",
    categorySlug: "accessories",
  },

  // Recovery
  {
    name: "Foam Roller",
    description:
      "High-density foam roller for muscle recovery and myofascial release. 18-inch length.",
    price: 24.99,
    salePrice: null,
    inventory: 65,
    images: ["/uploads/products/foam-roller.jpg"],
    featured: false,
    slug: "foam-roller",
    categorySlug: "recovery",
  },
  {
    name: "Massage Gun",
    description:
      "Percussive therapy massage gun with 4 speed settings and multiple attachments.",
    price: 199.99,
    salePrice: 159.99,
    inventory: 20,
    images: ["/uploads/products/massage-gun.jpg"],
    featured: true,
    slug: "massage-gun",
    categorySlug: "recovery",
  },
  {
    name: "Ice Bath Tub",
    description:
      "Portable ice bath tub for cold therapy and recovery. Foldable design for easy storage.",
    price: 299.99,
    salePrice: null,
    inventory: 10,
    images: ["/uploads/products/ice-bath.jpg"],
    featured: false,
    slug: "ice-bath-tub",
    categorySlug: "recovery",
  },

  // Cardio
  {
    name: "Jump Rope Speed",
    description:
      "Professional speed jump rope with adjustable length and ball bearing system.",
    price: 19.99,
    salePrice: 14.99,
    inventory: 80,
    images: ["/uploads/products/jump-rope.jpg"],
    featured: false,
    slug: "jump-rope-speed",
    categorySlug: "cardio",
  },
  {
    name: "Battle Ropes",
    description:
      "Heavy-duty battle ropes, 30 feet long. Excellent for HIIT and functional training.",
    price: 89.99,
    salePrice: 79.99,
    inventory: 15,
    images: ["/uploads/products/battle-ropes.jpg"],
    featured: false,
    slug: "battle-ropes",
    categorySlug: "cardio",
  },
  {
    name: "Agility Ladder",
    description:
      "12-rung agility ladder for speed and coordination training. Includes carrying bag.",
    price: 24.99,
    salePrice: null,
    inventory: 55,
    images: ["/uploads/products/agility-ladder.jpg"],
    featured: false,
    slug: "agility-ladder",
    categorySlug: "cardio",
  },
];

async function addAdditionalProducts() {
  try {
    console.log("🛍️  Adding additional products to the shop...");

    // Get all categories to map slugs to IDs
    const categories = await prisma.productCategory.findMany();
    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.slug] = cat.id;
    });

    let addedCount = 0;
    let skippedCount = 0;

    for (const product of additionalProducts) {
      try {
        const categoryId = categoryMap[product.categorySlug];
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
          console.log(`✅ Added product: ${newProduct.name}`);
          addedCount++;
        } else {
          console.log(`⚠️  Product already exists: ${existingProduct.name}`);
          skippedCount++;
        }
      } catch (error) {
        console.error(
          `❌ Error adding product ${product.name}:`,
          error.message,
        );
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Products added: ${addedCount}`);
    console.log(`⚠️  Products skipped: ${skippedCount}`);

    // Show total count
    const totalProducts = await prisma.product.count();
    console.log(`📊 Total products in database: ${totalProducts}`);

    console.log(`\n🎉 Additional products added successfully!`);
  } catch (error) {
    console.error("❌ Error adding additional products:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addAdditionalProducts();
