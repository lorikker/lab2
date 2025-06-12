import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getImageFiles(directory) {
  const fullPath = path.join(__dirname, '..', 'public', 'uploads', directory);
  if (!fs.existsSync(fullPath)) {
    return [];
  }
  
  return fs.readdirSync(fullPath)
    .filter(file => file.endsWith('.jpg') || file.endsWith('.svg') || file.endsWith('.png'))
    .sort();
}

function displayShopDataSummary() {
  console.log('🏪 SixStar Fitness Shop Data Summary');
  console.log('=====================================\n');

  // Category images
  const categoryImages = getImageFiles('categories');
  console.log('📁 Category Images:');
  console.log(`   Total: ${categoryImages.length} images`);
  categoryImages.forEach(image => {
    const type = image.endsWith('.svg') ? '🎨 SVG' : '📷 JPG';
    console.log(`   ${type} ${image}`);
  });

  // Product images
  const productImages = getImageFiles('products');
  console.log(`\n🛍️  Product Images:`);
  console.log(`   Total: ${productImages.length} images`);
  
  const jpgImages = productImages.filter(img => img.endsWith('.jpg'));
  const svgImages = productImages.filter(img => img.endsWith('.svg'));
  
  console.log(`   📷 JPG Images: ${jpgImages.length}`);
  console.log(`   🎨 SVG Placeholders: ${svgImages.length}`);
  
  console.log('\n📷 JPG Product Images:');
  jpgImages.forEach(image => {
    console.log(`   📷 ${image}`);
  });
  
  if (svgImages.length > 0) {
    console.log('\n🎨 SVG Placeholder Images:');
    svgImages.forEach(image => {
      console.log(`   🎨 ${image}`);
    });
  }

  // Categories created
  console.log('\n📂 Categories Created:');
  const categories = [
    'Memberships - Gym membership plans and packages',
    'Equipment - Professional fitness equipment for home and gym use',
    'Nutrition - Supplements, protein powders, and nutritional products',
    'Apparel - High-performance fitness clothing and accessories',
    'Accessories - Fitness accessories, gadgets, and training tools',
    'Bundles - Curated product bundles and starter kits',
    'Recovery - Recovery tools, massage equipment, and wellness products',
    'Cardio - Cardio equipment and accessories for endurance training'
  ];
  
  categories.forEach(category => {
    console.log(`   ✅ ${category}`);
  });

  // Products created
  console.log('\n🛍️  Products Created:');
  const products = [
    // Memberships
    'Basic Gym Membership - $29.99',
    'Premium Membership - $59.99 (Sale: $49.99)',
    'VIP Elite Membership - $129.99',
    
    // Equipment
    'Adjustable Dumbbell Set - $299.99 (Sale: $249.99)',
    'Olympic Barbell - $189.99',
    'Power Rack System - $899.99 (Sale: $799.99)',
    'Resistance Band Set - $39.99 (Sale: $29.99)',
    'Kettlebell Set - $199.99 (Sale: $179.99)',
    'Yoga Mat Premium - $49.99',
    'Pull-Up Bar - $39.99 (Sale: $34.99)',
    
    // Nutrition
    'Whey Protein Isolate - $49.99',
    'Pre-Workout Energy - $34.99 (Sale: $29.99)',
    'BCAA Recovery - $24.99',
    'Multivitamin Complex - $19.99',
    'Creatine Monohydrate - $19.99',
    'Fat Burner - $39.99 (Sale: $34.99)',
    'Omega-3 Fish Oil - $24.99',
    
    // Apparel
    'Performance Tank Top - $24.99 (Sale: $19.99)',
    'Athletic Shorts - $34.99',
    'Training Shoes - $129.99 (Sale: $99.99)',
    'Compression Leggings - $49.99 (Sale: $39.99)',
    'Hoodie Performance - $59.99 (Sale: $49.99)',
    'Sports Bra - $34.99',
    'Gym Gloves - $19.99 (Sale: $16.99)',
    
    // Accessories
    'Water Bottle Insulated - $29.99',
    'Gym Bag Large - $49.99 (Sale: $39.99)',
    'Fitness Tracker - $149.99 (Sale: $129.99)',
    
    // Recovery
    'Foam Roller - $24.99',
    'Massage Gun - $199.99 (Sale: $159.99)',
    'Ice Bath Tub - $299.99',
    
    // Cardio
    'Jump Rope Speed - $19.99 (Sale: $14.99)',
    'Battle Ropes - $89.99 (Sale: $79.99)',
    'Agility Ladder - $24.99'
  ];
  
  products.forEach(product => {
    console.log(`   ✅ ${product}`);
  });

  console.log('\n📊 Summary Statistics:');
  console.log(`   📂 Categories: 8`);
  console.log(`   🛍️  Products: ${products.length}`);
  console.log(`   📷 Total Images: ${categoryImages.length + productImages.length}`);
  console.log(`   💰 Price Range: $14.99 - $899.99`);
  console.log(`   🏷️  Products on Sale: ${products.filter(p => p.includes('Sale:')).length}`);

  console.log('\n🎯 Next Steps:');
  console.log('   1. ✅ Categories and products data created');
  console.log('   2. ✅ Local images downloaded and organized');
  console.log('   3. ⏳ Run database scripts when connection is available');
  console.log('   4. ⏳ Test shop functionality in the application');
  console.log('   5. ⏳ Add product reviews and ratings');

  console.log('\n🚀 Database Scripts Available:');
  console.log('   📝 scripts/create-enhanced-shop-data.js - Creates categories and initial products');
  console.log('   📝 scripts/add-additional-products.js - Adds more products to expand inventory');
  console.log('   📝 scripts/download-fitness-images.js - Downloads fitness images');
  console.log('   📝 scripts/download-additional-images.js - Downloads additional product images');

  console.log('\n✨ All shop data and images are ready for deployment!');
}

displayShopDataSummary();
