import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fresh set of completely unique fitness images - each with different photo ID
const freshUniqueImages = {
  categories: {
    'memberships.jpg': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'equipment.jpg': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'nutrition.jpg': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'apparel.jpg': 'https://images.unsplash.com/photo-1539710094188-9bae661a85e4?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'accessories.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'bundles.jpg': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'recovery.jpg': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'cardio.jpg': 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  products: {
    // Memberships - 3 completely different images
    'basic-membership.jpg': 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'premium-membership.jpg': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'vip-membership.jpg': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    
    // Equipment - 9 completely different images
    'adjustable-dumbbells.jpg': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'dumbbells-detail.jpg': 'https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'olympic-barbell.jpg': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'power-rack.jpg': 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'power-rack-setup.jpg': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'resistance-bands.jpg': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'kettlebell-set.jpg': 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'yoga-mat.jpg': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'pull-up-bar.jpg': 'https://images.unsplash.com/photo-1544991875-5dc1b05f607d?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    
    // Nutrition - 8 completely different images
    'whey-protein.jpg': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'protein-flavors.jpg': 'https://images.unsplash.com/photo-1550572017-edd951aa8ca6?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'pre-workout.jpg': 'https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'bcaa.jpg': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'multivitamin.jpg': 'https://images.unsplash.com/photo-1556821840-3a9c6dcb0e78?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'creatine.jpg': 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'fat-burner.jpg': 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'omega-3.jpg': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    
    // Apparel - 9 completely different images
    'tank-top.jpg': 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'tank-colors.jpg': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'athletic-shorts.jpg': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'training-shoes.jpg': 'https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'shoes-detail.jpg': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'compression-leggings.jpg': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'hoodie.jpg': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'sports-bra.jpg': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'gym-gloves.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    
    // Accessories - 3 completely different images
    'water-bottle.jpg': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'gym-bag.jpg': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'fitness-tracker.jpg': 'https://images.unsplash.com/photo-1539710094188-9bae661a85e4?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    
    // Recovery - 3 completely different images
    'foam-roller.jpg': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'massage-gun.jpg': 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'ice-bath.jpg': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    
    // Cardio - 3 completely different images
    'jump-rope.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'battle-ropes.jpg': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'agility-ladder.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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

async function downloadFreshUniqueImages() {
  console.log('🖼️  Downloading fresh unique fitness images (replacing duplicates)...\n');
  
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
  let totalReplaced = 0;
  
  // Download category images
  console.log('📁 Downloading category images...');
  for (const [filename, url] of Object.entries(freshUniqueImages.categories)) {
    const filepath = path.join(categoriesDir, filename);
    
    // Remove existing file if it exists
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      totalReplaced++;
      console.log(`🔄 Replaced existing: ${filename}`);
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
  for (const [filename, url] of Object.entries(freshUniqueImages.products)) {
    const filepath = path.join(productsDir, filename);
    
    // Remove existing file if it exists
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      totalReplaced++;
      console.log(`🔄 Replaced existing: ${filename}`);
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
  console.log(`🔄 Files replaced: ${totalReplaced} images`);
  console.log(`❌ Failed downloads: ${totalFailed} images`);
  console.log(`📷 Total unique images: ${Object.keys(freshUniqueImages.categories).length + Object.keys(freshUniqueImages.products).length}`);
  console.log('\n🎉 Fresh unique image download process completed!');
  
  // Verify no duplicates by checking photo IDs
  const allUrls = [
    ...Object.values(freshUniqueImages.categories),
    ...Object.values(freshUniqueImages.products)
  ];
  
  // Extract photo IDs from URLs
  const photoIds = allUrls.map(url => {
    const match = url.match(/photo-([a-zA-Z0-9_-]+)/);
    return match ? match[1] : url;
  });
  
  const uniquePhotoIds = new Set(photoIds);
  if (photoIds.length === uniquePhotoIds.size) {
    console.log('✅ Verified: All images have unique photo IDs (zero duplicates)');
  } else {
    console.log(`⚠️  Warning: Found ${photoIds.length - uniquePhotoIds.size} duplicate photo IDs`);
    
    // Show duplicates
    const idCounts = {};
    photoIds.forEach(id => {
      idCounts[id] = (idCounts[id] || 0) + 1;
    });
    
    console.log('\n🔍 Duplicate photo IDs found:');
    Object.entries(idCounts).forEach(([id, count]) => {
      if (count > 1) {
        console.log(`   ${count}x: ${id}`);
      }
    });
  }
}

downloadFreshUniqueImages().catch(error => {
  console.error('❌ Error during fresh unique image download process:', error);
});
