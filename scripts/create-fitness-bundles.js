import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Fitness bundles with attractive combinations and savings
const fitnessBundles = [
  {
    name: "Complete Home Gym Starter",
    description: "Everything you need to start your fitness journey at home. Includes adjustable dumbbells, resistance bands, yoga mat, and premium whey protein to fuel your workouts.",
    price: 449.99,
    salePrice: 379.99, // Save $70
    images: ["/uploads/bundles/home-gym-starter.jpg"],
    featured: true,
    slug: "complete-home-gym-starter",
    items: [
      { productSlug: "adjustable-dumbbell-set", quantity: 1 },
      { productSlug: "resistance-band-set", quantity: 1 },
      { productSlug: "yoga-mat-premium", quantity: 1 },
      { productSlug: "whey-protein-isolate", quantity: 1 }
    ]
  },
  {
    name: "Strength Training Power Pack",
    description: "Serious strength training bundle for dedicated lifters. Olympic barbell, power rack system, and creatine to maximize your gains.",
    price: 1139.98,
    salePrice: 999.99, // Save $140
    images: ["/uploads/bundles/strength-training-pack.jpg"],
    featured: true,
    slug: "strength-training-power-pack",
    items: [
      { productSlug: "olympic-barbell", quantity: 1 },
      { productSlug: "power-rack-system", quantity: 1 },
      { productSlug: "creatine-monohydrate", quantity: 2 }
    ]
  },
  {
    name: "Nutrition Essentials Bundle",
    description: "Complete nutrition support for your fitness goals. Premium protein, pre-workout energy, BCAA recovery, and daily multivitamins.",
    price: 129.96,
    salePrice: 109.99, // Save $20
    images: ["/uploads/bundles/nutrition-essentials.jpg"],
    featured: false,
    slug: "nutrition-essentials-bundle",
    items: [
      { productSlug: "whey-protein-isolate", quantity: 1 },
      { productSlug: "pre-workout-energy", quantity: 1 },
      { productSlug: "bcaa-recovery", quantity: 1 },
      { productSlug: "multivitamin-complex", quantity: 1 }
    ]
  },
  {
    name: "Cardio Warrior Kit",
    description: "High-intensity cardio training bundle. Battle ropes, jump rope, and agility ladder for explosive workouts that burn calories fast.",
    price: 134.97,
    salePrice: 119.99, // Save $15
    images: ["/uploads/bundles/cardio-warrior-kit.jpg"],
    featured: false,
    slug: "cardio-warrior-kit",
    items: [
      { productSlug: "battle-ropes", quantity: 1 },
      { productSlug: "jump-rope-speed", quantity: 1 },
      { productSlug: "agility-ladder", quantity: 1 }
    ]
  },
  {
    name: "Recovery & Wellness Package",
    description: "Complete recovery solution for serious athletes. Massage gun, foam roller, and omega-3 supplements for optimal muscle recovery.",
    price: 249.97,
    salePrice: 219.99, // Save $30
    images: ["/uploads/bundles/recovery-wellness.jpg"],
    featured: false,
    slug: "recovery-wellness-package",
    items: [
      { productSlug: "massage-gun", quantity: 1 },
      { productSlug: "foam-roller", quantity: 1 },
      { productSlug: "omega-3-fish-oil", quantity: 2 }
    ]
  },
  {
    name: "Fitness Apparel Starter Set",
    description: "Complete workout wardrobe essentials. Performance tank, athletic shorts, training shoes, and gym gloves for comfort and style.",
    price: 209.96,
    salePrice: 179.99, // Save $30
    images: ["/uploads/bundles/apparel-starter-set.jpg"],
    featured: false,
    slug: "fitness-apparel-starter-set",
    items: [
      { productSlug: "performance-tank-top", quantity: 2 },
      { productSlug: "athletic-shorts", quantity: 1 },
      { productSlug: "training-shoes", quantity: 1 },
      { productSlug: "gym-gloves", quantity: 1 }
    ]
  },
  {
    name: "Functional Fitness Bundle",
    description: "Versatile equipment for functional training. Kettlebell set, resistance bands, pull-up bar, and pre-workout for dynamic workouts.",
    price: 289.97,
    salePrice: 259.99, // Save $30
    images: ["/uploads/bundles/functional-fitness.jpg"],
    featured: true,
    slug: "functional-fitness-bundle",
    items: [
      { productSlug: "kettlebell-set", quantity: 1 },
      { productSlug: "resistance-band-set", quantity: 1 },
      { productSlug: "pull-up-bar", quantity: 1 },
      { productSlug: "pre-workout-energy", quantity: 1 }
    ]
  },
  {
    name: "Gym Essentials Kit",
    description: "Everything you need for gym sessions. Water bottle, gym bag, fitness tracker, and sports bra for the complete gym experience.",
    price: 148.97,
    salePrice: 129.99, // Save $19
    images: ["/uploads/bundles/gym-essentials-kit.jpg"],
    featured: false,
    slug: "gym-essentials-kit",
    items: [
      { productSlug: "water-bottle-insulated", quantity: 1 },
      { productSlug: "gym-bag-large", quantity: 1 },
      { productSlug: "fitness-tracker", quantity: 1 },
      { productSlug: "sports-bra", quantity: 1 }
    ]
  }
];

async function createFitnessBundles() {
  try {
    console.log("🎁 Creating fitness bundles...\n");

    // First, get all products to map slugs to IDs
    const products = await prisma.product.findMany({
      select: { id: true, slug: true, name: true, price: true }
    });

    const productMap = {};
    products.forEach(product => {
      productMap[product.slug] = product;
    });

    let bundlesCreated = 0;
    let bundlesSkipped = 0;

    for (const bundleData of fitnessBundles) {
      try {
        // Check if bundle already exists
        const existingBundle = await prisma.bundle.findUnique({
          where: { slug: bundleData.slug }
        });

        if (existingBundle) {
          console.log(`⚠️  Bundle already exists: ${bundleData.name}`);
          bundlesSkipped++;
          continue;
        }

        // Map product slugs to IDs and validate
        const bundleItems = [];
        let totalOriginalPrice = 0;
        let allProductsFound = true;

        for (const item of bundleData.items) {
          const product = productMap[item.productSlug];
          if (!product) {
            console.error(`❌ Product not found: ${item.productSlug}`);
            allProductsFound = false;
            break;
          }

          bundleItems.push({
            productId: product.id,
            quantity: item.quantity
          });

          totalOriginalPrice += Number(product.price) * item.quantity;
        }

        if (!allProductsFound) {
          console.error(`❌ Skipping bundle: ${bundleData.name} - missing products`);
          continue;
        }

        // Calculate savings
        const bundlePrice = bundleData.salePrice || bundleData.price;
        const savings = totalOriginalPrice - bundlePrice;

        // Create the bundle
        const { items, ...bundleCreateData } = bundleData;
        const newBundle = await prisma.bundle.create({
          data: {
            ...bundleCreateData,
            items: {
              create: bundleItems
            }
          },
          include: {
            items: {
              include: {
                product: {
                  select: { name: true, price: true }
                }
              }
            }
          }
        });

        console.log(`✅ Created bundle: ${newBundle.name}`);
        console.log(`   💰 Bundle price: $${bundlePrice}`);
        console.log(`   🏷️  Original total: $${totalOriginalPrice.toFixed(2)}`);
        console.log(`   💸 You save: $${savings.toFixed(2)}`);
        console.log(`   📦 Contains ${bundleItems.length} products\n`);

        bundlesCreated++;

      } catch (error) {
        console.error(`❌ Error creating bundle ${bundleData.name}:`, error.message);
      }
    }

    console.log("📊 Bundle Creation Summary:");
    console.log(`✅ Bundles created: ${bundlesCreated}`);
    console.log(`⚠️  Bundles skipped: ${bundlesSkipped}`);
    console.log(`🎁 Total bundles: ${bundlesCreated + bundlesSkipped}`);

    // Show final bundle count
    const totalBundles = await prisma.bundle.count();
    console.log(`📦 Total bundles in database: ${totalBundles}`);

    console.log("\n🎉 Fitness bundles creation completed!");

  } catch (error) {
    console.error("❌ Error creating fitness bundles:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createFitnessBundles();
