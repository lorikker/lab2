import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Bundle images from Unsplash - each bundle gets a unique image
const bundleImages = {
  'home-gym-starter.jpg': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop', // Home gym setup
  'strength-training-pack.jpg': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop', // Barbell/power rack
  'nutrition-essentials.jpg': 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=800&auto=format&fit=crop', // Supplements
  'cardio-warrior-kit.jpg': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800&auto=format&fit=crop', // Cardio equipment
  'recovery-wellness.jpg': 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?q=80&w=800&auto=format&fit=crop', // Recovery tools
  'apparel-starter-set.jpg': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?q=80&w=800&auto=format&fit=crop', // Fitness apparel
  'functional-fitness.jpg': 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=800&auto=format&fit=crop', // Kettlebells
  'gym-essentials-kit.jpg': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop', // Gym bag/accessories
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

function createPlaceholderImage(filename, text, width = 800, height = 600) {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#D5FC51;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#2A2A2A;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad1)"/>
    <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle" dy=".3em">SixStar Fitness</text>
    <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dy=".3em">FITNESS BUNDLE</text>
    <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle" dy=".3em">${text}</text>
  </svg>`;
  
  return svg;
}

async function downloadBundleImages() {
  console.log('🎁 Downloading fitness bundle images...\n');
  
  const baseDir = path.join(__dirname, '..', 'public', 'uploads');
  const bundlesDir = path.join(baseDir, 'bundles');
  
  // Ensure bundles directory exists
  if (!fs.existsSync(bundlesDir)) {
    fs.mkdirSync(bundlesDir, { recursive: true });
    console.log('📁 Created bundles directory');
  }
  
  let totalDownloaded = 0;
  let totalFailed = 0;
  let totalSkipped = 0;
  
  for (const [filename, url] of Object.entries(bundleImages)) {
    const filepath = path.join(bundlesDir, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`⚠️  File already exists: ${filename}`);
      totalSkipped++;
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
  
  console.log('\n📊 Bundle Images Download Summary:');
  console.log(`✅ Successfully downloaded: ${totalDownloaded} images`);
  console.log(`⚠️  Files already existed: ${totalSkipped} images`);
  console.log(`❌ Failed downloads: ${totalFailed} images`);
  console.log(`🎁 Total bundle images: ${Object.keys(bundleImages).length}`);
  
  // List all bundle images
  console.log('\n🖼️  Bundle Images Created:');
  Object.keys(bundleImages).forEach(filename => {
    const filepath = path.join(bundlesDir, filename);
    const svgPath = filepath.replace('.jpg', '.svg');
    
    if (fs.existsSync(filepath)) {
      console.log(`   📷 ${filename}`);
    } else if (fs.existsSync(svgPath)) {
      console.log(`   🎨 ${filename.replace('.jpg', '.svg')} (SVG placeholder)`);
    } else {
      console.log(`   ❌ ${filename} (MISSING)`);
    }
  });
  
  console.log('\n🎉 Bundle image download process completed!');
}

downloadBundleImages().catch(error => {
  console.error('❌ Error during bundle image download process:', error);
});
