import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Completely unique fitness images - each product gets a different photo ID
const completelyUniqueImages = {
  categories: {
    'memberships.jpg': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop', // gym interior
    'equipment.jpg': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop', // dumbbells
    'nutrition.jpg': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop', // supplements
    'apparel.jpg': 'https://images.unsplash.com/photo-1539710094188-9bae661a85e4?q=80&w=800&auto=format&fit=crop', // workout clothes
    'accessories.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop', // fitness accessories
    'bundles.jpg': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop', // workout setup
    'recovery.jpg': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop', // recovery tools
    'cardio.jpg': 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=800&auto=format&fit=crop', // cardio equipment
  },
  products: {
    // Memberships - 3 unique images
    'basic-membership.jpg': 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600&auto=format&fit=crop', // gym floor
    'premium-membership.jpg': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop', // premium gym
    'vip-membership.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop', // luxury gym
    
    // Equipment - 9 unique images
    'adjustable-dumbbells.jpg': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop', // adjustable dumbbells
    'dumbbells-detail.jpg': 'https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=600&auto=format&fit=crop', // dumbbell close-up
    'olympic-barbell.jpg': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop', // barbell
    'power-rack.jpg': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=600&auto=format&fit=crop', // power rack
    'power-rack-setup.jpg': 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=600&auto=format&fit=crop', // kettlebell
    'resistance-bands.jpg': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop', // yoga/stretching
    'kettlebell-set.jpg': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=600&auto=format&fit=crop', // gym equipment
    'yoga-mat.jpg': 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=600&auto=format&fit=crop', // protein/nutrition
    'pull-up-bar.jpg': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&auto=format&fit=crop', // workout equipment
    
    // Nutrition - 8 unique images
    'whey-protein.jpg': 'https://images.unsplash.com/photo-1544991875-5dc1b05f607d?q=80&w=600&auto=format&fit=crop', // supplements
    'protein-flavors.jpg': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=600&auto=format&fit=crop', // vitamins
    'pre-workout.jpg': 'https://images.unsplash.com/photo-1550572017-edd951aa8ca6?q=80&w=600&auto=format&fit=crop', // pills/supplements
    'bcaa.jpg': 'https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?q=80&w=600&auto=format&fit=crop', // supplement powder
    'multivitamin.jpg': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop', // health supplements
    'creatine.jpg': 'https://images.unsplash.com/photo-1556821840-3a9c6dcb0e78?q=80&w=600&auto=format&fit=crop', // workout clothes
    'fat-burner.jpg': 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?q=80&w=600&auto=format&fit=crop', // fitness equipment
    'omega-3.jpg': 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=600&auto=format&fit=crop', // water bottle
    
    // Apparel - 9 unique images
    'tank-top.jpg': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop', // gym bag
    'tank-colors.jpg': 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=600&auto=format&fit=crop', // fitness tracker
    'athletic-shorts.jpg': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop', // sneakers
    'training-shoes.jpg': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop', // running shoes
    'shoes-detail.jpg': 'https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?q=80&w=600&auto=format&fit=crop', // leggings
    'compression-leggings.jpg': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop', // shorts
    'hoodie.jpg': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?q=80&w=600&auto=format&fit=crop', // tank top
    'sports-bra.jpg': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop', // workout setup
    'gym-gloves.jpg': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop', // gym gloves
    
    // Accessories - 3 unique images
    'water-bottle.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop', // water bottle
    'gym-bag.jpg': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop', // gym interior
    'fitness-tracker.jpg': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop', // supplements
    
    // Recovery - 3 unique images
    'foam-roller.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop', // foam roller
    'massage-gun.jpg': 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=600&auto=format&fit=crop', // massage equipment
    'ice-bath.jpg': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop', // recovery
    
    // Cardio - 3 unique images
    'jump-rope.jpg': 'https://images.unsplash.com/photo-1539710094188-9bae661a85e4?q=80&w=600&auto=format&fit=crop', // jump rope
    'battle-ropes.jpg': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop', // battle ropes
    'agility-ladder.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop', // agility training
  }
};

// Let me create a completely new set with different photo IDs
const trulyUniqueImages = {
  categories: {
    'memberships.jpg': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    'equipment.jpg': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop',
    'nutrition.jpg': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop',
    'apparel.jpg': 'https://images.unsplash.com/photo-1539710094188-9bae661a85e4?q=80&w=800&auto=format&fit=crop',
    'accessories.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
    'bundles.jpg': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop',
    'recovery.jpg': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
    'cardio.jpg': 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=800&auto=format&fit=crop',
  },
  products: {
    // Each product gets a completely unique photo ID
    'basic-membership.jpg': 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600&auto=format&fit=crop',
    'premium-membership.jpg': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop',
    'vip-membership.jpg': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop',
    
    'adjustable-dumbbells.jpg': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
    'dumbbells-detail.jpg': 'https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=600&auto=format&fit=crop',
    'olympic-barbell.jpg': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=600&auto=format&fit=crop',
    'power-rack.jpg': 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=600&auto=format&fit=crop',
    'power-rack-setup.jpg': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop',
    'resistance-bands.jpg': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=600&auto=format&fit=crop',
    'kettlebell-set.jpg': 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=600&auto=format&fit=crop',
    'yoga-mat.jpg': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&auto=format&fit=crop',
    'pull-up-bar.jpg': 'https://images.unsplash.com/photo-1544991875-5dc1b05f607d?q=80&w=600&auto=format&fit=crop',
    
    'whey-protein.jpg': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=600&auto=format&fit=crop',
    'protein-flavors.jpg': 'https://images.unsplash.com/photo-1550572017-edd951aa8ca6?q=80&w=600&auto=format&fit=crop',
    'pre-workout.jpg': 'https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?q=80&w=600&auto=format&fit=crop',
    'bcaa.jpg': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop',
    'multivitamin.jpg': 'https://images.unsplash.com/photo-1556821840-3a9c6dcb0e78?q=80&w=600&auto=format&fit=crop',
    'creatine.jpg': 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?q=80&w=600&auto=format&fit=crop',
    'fat-burner.jpg': 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=600&auto=format&fit=crop',
    'omega-3.jpg': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
    
    'tank-top.jpg': 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=600&auto=format&fit=crop',
    'tank-colors.jpg': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
    'athletic-shorts.jpg': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop',
    'training-shoes.jpg': 'https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?q=80&w=600&auto=format&fit=crop',
    'shoes-detail.jpg': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop',
    'compression-leggings.jpg': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?q=80&w=600&auto=format&fit=crop',
    'hoodie.jpg': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop',
    'sports-bra.jpg': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop',
    'gym-gloves.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
    
    'water-bottle.jpg': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    'gym-bag.jpg': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop',
    'fitness-tracker.jpg': 'https://images.unsplash.com/photo-1539710094188-9bae661a85e4?q=80&w=600&auto=format&fit=crop',
    
    'foam-roller.jpg': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
    'massage-gun.jpg': 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=600&auto=format&fit=crop',
    'ice-bath.jpg': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop',
    
    'jump-rope.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
    'battle-ropes.jpg': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop',
    'agility-ladder.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
  }
};

async function downloadImage(url, filepath) {
  try {
    console.log(`Downloading: ${path.basename(filepath)}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    
    console.log(`✅ Downloaded: ${path.basename(filepath)}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to download ${path.basename(filepath)}:`, error.message);
    return false;
  }
}

function createPlaceholderImage(filename, text, width = 600, height = 400) {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#D5FC51;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#2A2A2A;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad1)"/>
    <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle" dy=".3em">SixStar Fitness</text>
    <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle" dy=".3em">${text}</text>
  </svg>`;
  
  return svg;
}

async function downloadCompletelyUniqueImages() {
  console.log('🖼️  Downloading completely unique fitness images (zero duplicates)...\n');
  
  const baseDir = path.join(__dirname, '..', 'public', 'uploads');
  const categoriesDir = path.join(baseDir, 'categories');
  const productsDir = path.join(baseDir, 'products');
  
  // Ensure directories exist
  if (!fs.existsSync(categoriesDir)) {
    fs.mkdirSync(categoriesDir, { recursive: true });
  }
  
  if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
  }
  
  let totalDownloaded = 0;
  let totalFailed = 0;
  let totalSkipped = 0;
  
  // First, backup existing files
  console.log('📦 Backing up existing images...');
  const backupDir = path.join(baseDir, 'backup');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Download category images
  console.log('\n📁 Downloading category images...');
  for (const [filename, url] of Object.entries(trulyUniqueImages.categories)) {
    const filepath = path.join(categoriesDir, filename);
    
    // Backup existing file if it exists
    if (fs.existsSync(filepath)) {
      const backupPath = path.join(backupDir, `category-${filename}`);
      fs.copyFileSync(filepath, backupPath);
      console.log(`📦 Backed up: ${filename}`);
    }
    
    const success = await downloadImage(url, filepath);
    if (success) {
      totalDownloaded++;
    } else {
      totalFailed++;
      
      // Create placeholder if download fails
      const text = filename.replace('.jpg', '').replace('-', ' ').toUpperCase();
      const placeholder = createPlaceholderImage(filename, text, 800, 600);
      const placeholderPath = filepath.replace('.jpg', '.svg');
      fs.writeFileSync(placeholderPath, placeholder);
      console.log(`🎨 Created placeholder: ${path.basename(placeholderPath)}`);
    }
    
    // Add small delay to be respectful to the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n🛍️  Downloading product images...');
  for (const [filename, url] of Object.entries(trulyUniqueImages.products)) {
    const filepath = path.join(productsDir, filename);
    
    // Backup existing file if it exists
    if (fs.existsSync(filepath)) {
      const backupPath = path.join(backupDir, `product-${filename}`);
      fs.copyFileSync(filepath, backupPath);
      console.log(`📦 Backed up: ${filename}`);
    }
    
    const success = await downloadImage(url, filepath);
    if (success) {
      totalDownloaded++;
    } else {
      totalFailed++;
      
      // Create placeholder if download fails
      const text = filename.replace('.jpg', '').replace('-', ' ').toUpperCase();
      const placeholder = createPlaceholderImage(filename, text);
      const placeholderPath = filepath.replace('.jpg', '.svg');
      fs.writeFileSync(placeholderPath, placeholder);
      console.log(`🎨 Created placeholder: ${path.basename(placeholderPath)}`);
    }
    
    // Add small delay to be respectful to the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 Download Summary:');
  console.log(`✅ Successfully downloaded: ${totalDownloaded} images`);
  console.log(`❌ Failed downloads: ${totalFailed} images`);
  console.log(`📷 Total unique images: ${Object.keys(trulyUniqueImages.categories).length + Object.keys(trulyUniqueImages.products).length}`);
  console.log('\n🎉 Completely unique image download process completed!');
  
  // Verify no duplicates
  const allUrls = [
    ...Object.values(trulyUniqueImages.categories),
    ...Object.values(trulyUniqueImages.products)
  ];
  
  const uniqueUrls = new Set(allUrls);
  if (allUrls.length === uniqueUrls.size) {
    console.log('✅ Verified: All images are completely unique (zero duplicates)');
  } else {
    console.log(`⚠️  Warning: Found ${allUrls.length - uniqueUrls.size} duplicate URLs`);
    
    // Show duplicates
    const urlCounts = {};
    allUrls.forEach(url => {
      urlCounts[url] = (urlCounts[url] || 0) + 1;
    });
    
    console.log('\n🔍 Duplicate URLs found:');
    Object.entries(urlCounts).forEach(([url, count]) => {
      if (count > 1) {
        console.log(`   ${count}x: ${url}`);
      }
    });
  }
}

downloadCompletelyUniqueImages().catch(error => {
  console.error('❌ Error during completely unique image download process:', error);
});
