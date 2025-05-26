const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addMoreProducts() {
  try {
    console.log('Adding more products to the database...');

    // Get existing categories
    const categories = await prisma.category.findMany();
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });

    console.log('Found categories:', Object.keys(categoryMap));

    // Additional products to add
    const newProducts = [
      // Equipment
      {
        name: "Adjustable Dumbbells Set",
        description: "Professional adjustable dumbbells with quick-change weight system.",
        price: 299.99,
        salePrice: 249.99,
        categoryId: categoryMap['equipment'],
        images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500"],
        featured: true,
        inventory: 15,
        slug: "adjustable-dumbbells-set"
      },
      {
        name: "Resistance Bands Kit",
        description: "Complete resistance bands set with multiple resistance levels.",
        price: 49.99,
        categoryId: categoryMap['equipment'],
        images: ["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500"],
        featured: false,
        inventory: 25,
        slug: "resistance-bands-kit"
      },
      {
        name: "Yoga Mat Premium",
        description: "High-quality non-slip yoga mat with extra cushioning.",
        price: 79.99,
        salePrice: 59.99,
        categoryId: categoryMap['equipment'],
        images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500"],
        featured: false,
        inventory: 30,
        slug: "yoga-mat-premium"
      },
      {
        name: "Kettlebell 20kg",
        description: "Cast iron kettlebell with comfortable grip handle.",
        price: 89.99,
        categoryId: categoryMap['equipment'],
        images: ["https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=500"],
        featured: false,
        inventory: 12,
        slug: "kettlebell-20kg"
      },
      {
        name: "Pull-up Bar",
        description: "Doorway pull-up bar with multiple grip positions.",
        price: 39.99,
        categoryId: categoryMap['equipment'],
        images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500"],
        featured: false,
        inventory: 20,
        slug: "pull-up-bar"
      },

      // Nutrition
      {
        name: "Whey Protein Isolate",
        description: "Pure whey protein isolate with 25g protein per serving.",
        price: 59.99,
        categoryId: categoryMap['nutrition'],
        images: ["https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500"],
        featured: true,
        inventory: 40,
        slug: "whey-protein-isolate"
      },
      {
        name: "Pre-Workout Energy",
        description: "Natural pre-workout supplement with caffeine and amino acids.",
        price: 34.99,
        categoryId: categoryMap['nutrition'],
        images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500"],
        featured: false,
        inventory: 35,
        slug: "pre-workout-energy"
      },
      {
        name: "BCAA Recovery",
        description: "Branched-chain amino acids for muscle recovery.",
        price: 29.99,
        salePrice: 24.99,
        categoryId: categoryMap['nutrition'],
        images: ["https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500"],
        featured: false,
        inventory: 28,
        slug: "bcaa-recovery"
      },
      {
        name: "Multivitamin Complex",
        description: "Complete daily multivitamin with essential vitamins.",
        price: 24.99,
        categoryId: categoryMap['nutrition'],
        images: ["https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500"],
        featured: false,
        inventory: 50,
        slug: "multivitamin-complex"
      },

      // Apparel
      {
        name: "Performance T-Shirt",
        description: "Moisture-wicking athletic t-shirt with anti-odor technology.",
        price: 29.99,
        categoryId: categoryMap['apparel'],
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
        featured: false,
        inventory: 45,
        slug: "performance-t-shirt"
      },
      {
        name: "Training Shorts",
        description: "Lightweight training shorts with built-in compression liner.",
        price: 39.99,
        salePrice: 29.99,
        categoryId: categoryMap['apparel'],
        images: ["https://images.unsplash.com/photo-1506629905607-d9c36e0a3e3d?w=500"],
        featured: false,
        inventory: 38,
        slug: "training-shorts"
      },
      {
        name: "Athletic Hoodie",
        description: "Comfortable fleece hoodie perfect for workouts.",
        price: 69.99,
        categoryId: categoryMap['apparel'],
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
        featured: false,
        inventory: 22,
        slug: "athletic-hoodie"
      },
      {
        name: "Running Shoes",
        description: "Lightweight running shoes with responsive cushioning.",
        price: 129.99,
        salePrice: 99.99,
        categoryId: categoryMap['apparel'],
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"],
        featured: true,
        inventory: 18,
        slug: "running-shoes"
      }
    ];

    // Add products to database
    for (const product of newProducts) {
      try {
        await prisma.product.create({
          data: product
        });
        console.log(`✅ Added product: ${product.name}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️  Product already exists: ${product.name}`);
        } else {
          console.error(`❌ Error adding product ${product.name}:`, error.message);
        }
      }
    }

    console.log('\n🎉 Finished adding products to the database!');
    
    // Show total count
    const totalProducts = await prisma.product.count();
    console.log(`📊 Total products in database: ${totalProducts}`);

  } catch (error) {
    console.error('Error adding products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMoreProducts();
