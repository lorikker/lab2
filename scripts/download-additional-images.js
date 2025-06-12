import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Additional product images
const additionalProductImages = {
  'kettlebell-set.jpg': 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=600&auto=format&fit=crop',
  'yoga-mat.jpg': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
  'pull-up-bar.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
  'creatine.jpg': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=600&auto=format&fit=crop',
  'fat-burner.jpg': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
  'omega-3.jpg': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=600&auto=format&fit=crop',
  'hoodie.jpg': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop',
  'sports-bra.jpg': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?q=80&w=600&auto=format&fit=crop',
  'gym-gloves.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
  'water-bottle.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
  'gym-bag.jpg': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
  'fitness-tracker.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
  'foam-roller.jpg': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
  'massage-gun.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
  'ice-bath.jpg': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
  'jump-rope.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
  'battle-ropes.jpg': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop',
  'agility-ladder.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
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

async function downloadAdditionalImages() {
  console.log('🖼️  Downloading additional product images...\n');
  
  const baseDir = path.join(__dirname, '..', 'public', 'uploads');
  const productsDir = path.join(baseDir, 'products');
  
  // Ensure directory exists
  if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
  }
  
  let totalDownloaded = 0;
  let totalFailed = 0;
  
  for (const [filename, url] of Object.entries(additionalProductImages)) {
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
  console.log('\n🎉 Additional image download process completed!');
}

downloadAdditionalImages().catch(error => {
  console.error('❌ Error during additional image download process:', error);
});
