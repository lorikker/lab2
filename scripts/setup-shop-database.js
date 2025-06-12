import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  try {
    console.log('🔌 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function runShopSetup() {
  try {
    console.log('🏪 Setting up SixStar Fitness Shop Database');
    console.log('==========================================\n');

    // Test connection first
    const isConnected = await testDatabaseConnection();
    if (!isConnected) {
      console.log('\n⚠️  Database connection failed. Please check:');
      console.log('   1. Database server is running');
      console.log('   2. Environment variables are set correctly');
      console.log('   3. Network connectivity');
      console.log('\n📝 You can run the scripts manually when the database is available:');
      console.log('   node scripts/create-enhanced-shop-data.js');
      console.log('   node scripts/add-additional-products.js');
      return;
    }

    console.log('\n🚀 Starting shop database setup...\n');

    // Check if categories already exist
    const existingCategories = await prisma.productCategory.count();
    console.log(`📊 Current categories in database: ${existingCategories}`);

    // Check if products already exist
    const existingProducts = await prisma.product.count();
    console.log(`📊 Current products in database: ${existingProducts}`);

    if (existingCategories === 0) {
      console.log('\n📁 No categories found. Creating categories...');
      // Import and run the enhanced shop data script
      const { default: createEnhancedShopData } = await import('./create-enhanced-shop-data.js');
      await createEnhancedShopData();
    } else {
      console.log('\n📁 Categories already exist in database.');
    }

    if (existingProducts < 20) {
      console.log('\n🛍️  Adding additional products...');
      // Import and run the additional products script
      const { default: addAdditionalProducts } = await import('./add-additional-products.js');
      await addAdditionalProducts();
    } else {
      console.log('\n🛍️  Sufficient products already exist in database.');
    }

    // Final count
    const finalCategories = await prisma.productCategory.count();
    const finalProducts = await prisma.product.count();

    console.log('\n🎉 Shop database setup completed!');
    console.log('=====================================');
    console.log(`📂 Total categories: ${finalCategories}`);
    console.log(`🛍️  Total products: ${finalProducts}`);
    console.log(`📷 Total images: 46 (local files)`);

    console.log('\n✨ Your SixStar Fitness shop is ready!');
    console.log('   🌐 Visit the shop at: /shop');
    console.log('   🛒 Test the cart functionality');
    console.log('   💳 Try the checkout process');
    console.log('   👨‍💼 Manage products in the admin dashboard');

  } catch (error) {
    console.error('❌ Error during shop setup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Alternative function to just show what would be created
async function showShopPlan() {
  console.log('🏪 SixStar Fitness Shop Setup Plan');
  console.log('===================================\n');

  console.log('📁 Categories to be created:');
  const categories = [
    'Memberships (8 products)',
    'Equipment (10 products)', 
    'Nutrition (7 products)',
    'Apparel (7 products)',
    'Accessories (3 products)',
    'Recovery (3 products)',
    'Cardio (3 products)',
    'Bundles (future expansion)'
  ];
  
  categories.forEach(cat => console.log(`   ✅ ${cat}`));

  console.log('\n🛍️  Product highlights:');
  const highlights = [
    'Premium gym memberships ($29.99 - $129.99)',
    'Professional equipment (dumbbells, power racks, etc.)',
    'Sports nutrition (protein, supplements)',
    'Athletic apparel (shoes, clothing)',
    'Fitness accessories (trackers, bags)',
    'Recovery tools (massage guns, foam rollers)',
    'Cardio equipment (jump ropes, battle ropes)'
  ];
  
  highlights.forEach(item => console.log(`   🎯 ${item}`));

  console.log('\n📷 Images ready:');
  console.log('   📂 8 category images');
  console.log('   🛍️  38 product images');
  console.log('   🎨 3 SVG placeholders for missing images');

  console.log('\n🚀 To run the setup:');
  console.log('   node scripts/setup-shop-database.js');
}

// Check if this script is being run directly
if (process.argv[1].endsWith('setup-shop-database.js')) {
  if (process.argv.includes('--plan')) {
    showShopPlan();
  } else {
    runShopSetup();
  }
}

export { runShopSetup, showShopPlan, testDatabaseConnection };
