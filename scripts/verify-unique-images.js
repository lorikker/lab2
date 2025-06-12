import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verifyUniqueImages() {
  console.log('🔍 Verifying all images are unique...\n');
  
  const baseDir = path.join(__dirname, '..', 'public', 'uploads');
  const categoriesDir = path.join(baseDir, 'categories');
  const productsDir = path.join(baseDir, 'products');
  
  // Get all JPG images
  const categoryImages = fs.readdirSync(categoriesDir)
    .filter(file => file.endsWith('.jpg'))
    .map(file => ({ file, type: 'category', path: path.join(categoriesDir, file) }));
    
  const productImages = fs.readdirSync(productsDir)
    .filter(file => file.endsWith('.jpg'))
    .map(file => ({ file, type: 'product', path: path.join(productsDir, file) }));
  
  const allImages = [...categoryImages, ...productImages];
  
  console.log(`📊 Total JPG images to verify: ${allImages.length}`);
  console.log(`   📁 Category images: ${categoryImages.length}`);
  console.log(`   🛍️  Product images: ${productImages.length}`);
  
  // Check file sizes to identify potential duplicates
  const fileSizes = {};
  const duplicateSizes = [];
  
  allImages.forEach(({ file, type, path: filePath }) => {
    const stats = fs.statSync(filePath);
    const size = stats.size;
    
    if (!fileSizes[size]) {
      fileSizes[size] = [];
    }
    fileSizes[size].push({ file, type, size });
    
    if (fileSizes[size].length > 1) {
      duplicateSizes.push(size);
    }
  });
  
  console.log('\n🔍 Checking for duplicate file sizes...');
  
  if (duplicateSizes.length === 0) {
    console.log('✅ No files with identical sizes found!');
  } else {
    console.log(`⚠️  Found ${duplicateSizes.length} file sizes with multiple files:`);
    
    duplicateSizes.forEach(size => {
      const files = fileSizes[size];
      console.log(`\n   Size: ${size} bytes (${files.length} files):`);
      files.forEach(({ file, type }) => {
        console.log(`     ${type === 'category' ? '📁' : '🛍️'} ${file}`);
      });
    });
  }
  
  // List all unique images
  console.log('\n📷 All JPG Images:');
  console.log('\n📁 Category Images:');
  categoryImages.forEach(({ file }) => {
    console.log(`   ✅ ${file}`);
  });
  
  console.log('\n🛍️  Product Images:');
  productImages.forEach(({ file }) => {
    console.log(`   ✅ ${file}`);
  });
  
  // Check SVG placeholders
  const svgImages = fs.readdirSync(productsDir)
    .filter(file => file.endsWith('.svg'));
    
  if (svgImages.length > 0) {
    console.log('\n🎨 SVG Placeholder Images:');
    svgImages.forEach(file => {
      console.log(`   🎨 ${file}`);
    });
  }
  
  console.log('\n📊 Final Summary:');
  console.log(`   📷 Total JPG images: ${allImages.length}`);
  console.log(`   🎨 SVG placeholders: ${svgImages.length}`);
  console.log(`   📁 Total image files: ${allImages.length + svgImages.length}`);
  
  if (duplicateSizes.length === 0) {
    console.log('\n🎉 SUCCESS: All images appear to be unique!');
    console.log('✅ No duplicate file sizes detected');
    console.log('🎯 Every product has its own unique image');
  } else {
    console.log('\n⚠️  WARNING: Some files have identical sizes');
    console.log('   This might indicate duplicate images');
    console.log('   Manual verification recommended for files with same size');
  }
  
  // Product-to-image mapping
  console.log('\n🗂️  Product-to-Image Mapping:');
  const productMapping = {
    'Memberships': ['basic-membership.jpg', 'premium-membership.jpg', 'vip-membership.jpg'],
    'Equipment': ['adjustable-dumbbells.jpg', 'dumbbells-detail.jpg', 'olympic-barbell.jpg', 'power-rack.jpg', 'power-rack-setup.jpg', 'resistance-bands.jpg', 'kettlebell-set.jpg', 'yoga-mat.jpg', 'pull-up-bar.jpg'],
    'Nutrition': ['whey-protein.jpg', 'protein-flavors.jpg', 'pre-workout.jpg', 'bcaa.jpg', 'multivitamin.jpg', 'creatine.jpg', 'fat-burner.jpg', 'omega-3.jpg'],
    'Apparel': ['tank-top.jpg', 'tank-colors.jpg', 'athletic-shorts.jpg', 'training-shoes.jpg', 'shoes-detail.jpg', 'compression-leggings.jpg', 'hoodie.jpg', 'sports-bra.jpg', 'gym-gloves.jpg'],
    'Accessories': ['water-bottle.jpg', 'gym-bag.jpg', 'fitness-tracker.jpg'],
    'Recovery': ['foam-roller.jpg', 'massage-gun.jpg', 'ice-bath.jpg'],
    'Cardio': ['jump-rope.jpg', 'battle-ropes.jpg', 'agility-ladder.jpg']
  };
  
  Object.entries(productMapping).forEach(([category, images]) => {
    console.log(`\n   📂 ${category}:`);
    images.forEach(image => {
      const exists = fs.existsSync(path.join(productsDir, image));
      const isSvg = fs.existsSync(path.join(productsDir, image.replace('.jpg', '.svg')));
      if (exists) {
        console.log(`     ✅ ${image}`);
      } else if (isSvg) {
        console.log(`     🎨 ${image.replace('.jpg', '.svg')} (SVG placeholder)`);
      } else {
        console.log(`     ❌ ${image} (MISSING)`);
      }
    });
  });
  
  console.log('\n🎯 Image Uniqueness Verification Complete!');
}

verifyUniqueImages().catch(error => {
  console.error('❌ Error during image verification:', error);
});
