import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fitness images from Unsplash (free to use)
const fitnessImages = {
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
    'basic-membership.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
    'premium-membership.jpg': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    'vip-membership.jpg': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop',
    'adjustable-dumbbells.jpg': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop',
    'dumbbells-detail.jpg': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
    'olympic-barbell.jpg': 'https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=600&auto=format&fit=crop',
    'power-rack.jpg': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop',
    'power-rack-setup.jpg': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    'resistance-bands.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
    'whey-protein.jpg': 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=600&auto=format&fit=crop',
    'protein-flavors.jpg': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop',
    'pre-workout.jpg': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
    'bcaa.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
    'multivitamin.jpg': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=600&auto=format&fit=crop',
    'tank-top.jpg': 'https://images.unsplash.com/photo-1539710094188-9bae661a85e4?q=80&w=600&auto=format&fit=crop',
    'tank-colors.jpg': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?q=80&w=600&auto=format&fit=crop',
    'athletic-shorts.jpg': 'https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?q=80&w=600&auto=format&fit=crop',
    'training-shoes.jpg': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
    'shoes-detail.jpg': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop',
    'compression-leggings.jpg': 'https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?q=80&w=600&auto=format&fit=crop',
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

async function downloadAllImages() {
  console.log('🖼️  Starting fitness image downloads...\n');
  
  const baseDir = path.join(__dirname, '..', 'public', 'uploads');
  
  // Ensure directories exist
  const categoriesDir = path.join(baseDir, 'categories');
  const productsDir = path.join(baseDir, 'products');
  
  if (!fs.existsSync(categoriesDir)) {
    fs.mkdirSync(categoriesDir, { recursive: true });
  }
  
  if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
  }
  
  let totalDownloaded = 0;
  let totalFailed = 0;
  
  // Download category images
  console.log('📁 Downloading category images...');
  for (const [filename, url] of Object.entries(fitnessImages.categories)) {
    const filepath = path.join(categoriesDir, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`⚠️  File already exists: ${filename}`);
      continue;
    }
    
    const success = await downloadImage(url, filepath);
    if (success) {
      totalDownloaded++;
    } else {
      totalFailed++;
    }
    
    // Add small delay to be respectful to the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n🛍️  Downloading product images...');
  for (const [filename, url] of Object.entries(fitnessImages.products)) {
    const filepath = path.join(productsDir, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`⚠️  File already exists: ${filename}`);
      continue;
    }
    
    const success = await downloadImage(url, filepath);
    if (success) {
      totalDownloaded++;
    } else {
      totalFailed++;
    }
    
    // Add small delay to be respectful to the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 Download Summary:');
  console.log(`✅ Successfully downloaded: ${totalDownloaded} images`);
  console.log(`❌ Failed downloads: ${totalFailed} images`);
  console.log('\n🎉 Image download process completed!');
}

// Create placeholder images if download fails
function createPlaceholderImages() {
  console.log('🎨 Creating placeholder images...');
  
  const baseDir = path.join(__dirname, '..', 'public', 'uploads');
  const categoriesDir = path.join(baseDir, 'categories');
  const productsDir = path.join(baseDir, 'products');
  
  // Simple SVG placeholder
  const createPlaceholder = (text, width = 400, height = 300) => {
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#666" text-anchor="middle" dy=".3em">${text}</text>
    </svg>`;
  };
  
  // Create category placeholders
  Object.keys(fitnessImages.categories).forEach(filename => {
    const filepath = path.join(categoriesDir, filename.replace('.jpg', '.svg'));
    if (!fs.existsSync(filepath)) {
      const categoryName = filename.replace('.jpg', '').replace('-', ' ');
      fs.writeFileSync(filepath, createPlaceholder(categoryName.toUpperCase()));
    }
  });
  
  // Create product placeholders
  Object.keys(fitnessImages.products).forEach(filename => {
    const filepath = path.join(productsDir, filename.replace('.jpg', '.svg'));
    if (!fs.existsSync(filepath)) {
      const productName = filename.replace('.jpg', '').replace('-', ' ');
      fs.writeFileSync(filepath, createPlaceholder(productName.toUpperCase()));
    }
  });
  
  console.log('✅ Placeholder images created!');
}

// Run the download process
downloadAllImages().catch(error => {
  console.error('❌ Error during download process:', error);
  createPlaceholderImages();
});
