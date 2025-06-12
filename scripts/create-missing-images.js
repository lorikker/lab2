import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Alternative URLs for failed downloads
const alternativeImages = {
  'apparel.jpg': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?q=80&w=800&auto=format&fit=crop',
  'tank-top.jpg': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?q=80&w=600&auto=format&fit=crop',
  'tank-colors.jpg': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop',
  'athletic-shorts.jpg': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop',
  'compression-leggings.jpg': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?q=80&w=600&auto=format&fit=crop',
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

async function createMissingImages() {
  console.log('🎨 Creating missing fitness images...\n');
  
  const baseDir = path.join(__dirname, '..', 'public', 'uploads');
  const categoriesDir = path.join(baseDir, 'categories');
  const productsDir = path.join(baseDir, 'products');
  
  // Try to download alternative images first
  console.log('📥 Trying alternative image URLs...');
  
  for (const [filename, url] of Object.entries(alternativeImages)) {
    let filepath;
    
    if (filename === 'apparel.jpg') {
      filepath = path.join(categoriesDir, filename);
    } else {
      filepath = path.join(productsDir, filename);
    }
    
    if (!fs.existsSync(filepath)) {
      const success = await downloadImage(url, filepath);
      if (!success) {
        // Create placeholder if download fails
        const text = filename.replace('.jpg', '').replace('-', ' ').toUpperCase();
        const placeholder = createPlaceholderImage(filename, text);
        const placeholderPath = filepath.replace('.jpg', '.svg');
        fs.writeFileSync(placeholderPath, placeholder);
        console.log(`🎨 Created placeholder: ${path.basename(placeholderPath)}`);
      }
      
      // Add delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // Create any remaining missing placeholders
  console.log('\n🎨 Creating additional placeholders...');
  
  const missingFiles = [
    { dir: categoriesDir, name: 'apparel.jpg', text: 'FITNESS APPAREL' },
    { dir: productsDir, name: 'tank-top.jpg', text: 'PERFORMANCE TANK' },
    { dir: productsDir, name: 'tank-colors.jpg', text: 'TANK COLORS' },
    { dir: productsDir, name: 'athletic-shorts.jpg', text: 'ATHLETIC SHORTS' },
    { dir: productsDir, name: 'compression-leggings.jpg', text: 'COMPRESSION LEGGINGS' },
  ];
  
  missingFiles.forEach(({ dir, name, text }) => {
    const filepath = path.join(dir, name);
    const svgPath = filepath.replace('.jpg', '.svg');
    
    if (!fs.existsSync(filepath) && !fs.existsSync(svgPath)) {
      const placeholder = createPlaceholderImage(name, text);
      fs.writeFileSync(svgPath, placeholder);
      console.log(`🎨 Created placeholder: ${path.basename(svgPath)}`);
    }
  });
  
  console.log('\n✅ Missing images process completed!');
}

createMissingImages().catch(error => {
  console.error('❌ Error creating missing images:', error);
});
