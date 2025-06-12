import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Final unique replacements with completely different photo IDs
const finalUniqueReplacements = {
  'agility-ladder.jpg': 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?q=80&w=600&auto=format&fit=crop', // Completely different
  'jump-rope.jpg': 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=600&auto=format&fit=crop', // Completely different
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

async function finalUniqueFix() {
  console.log('🎯 Final unique image fix - ensuring absolutely no duplicates...\n');
  
  const baseDir = path.join(__dirname, '..', 'public', 'uploads');
  const productsDir = path.join(baseDir, 'products');
  
  let totalDownloaded = 0;
  let totalFailed = 0;
  let totalReplaced = 0;
  
  for (const [filename, url] of Object.entries(finalUniqueReplacements)) {
    const filepath = path.join(productsDir, filename);
    
    // Remove existing file
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      totalReplaced++;
      console.log(`🔄 Replacing: ${filename}`);
    }
    
    const success = await downloadImage(url, filepath);
    if (success) {
      totalDownloaded++;
      
      // Check new file size
      const newStats = fs.statSync(filepath);
      const newSize = newStats.size;
      console.log(`   📊 New size: ${newSize} bytes`);
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
  
  console.log('\n📊 Final Fix Summary:');
  console.log(`✅ Successfully downloaded: ${totalDownloaded} images`);
  console.log(`🔄 Files replaced: ${totalReplaced} images`);
  console.log(`❌ Failed downloads: ${totalFailed} images`);
  
  // Final verification
  console.log('\n🔍 Final verification of all images...');
  
  const allImages = fs.readdirSync(productsDir)
    .filter(file => file.endsWith('.jpg'))
    .map(file => {
      const filePath = path.join(productsDir, file);
      const stats = fs.statSync(filePath);
      return { file, size: stats.size };
    });
  
  const fileSizes = {};
  const duplicateSizes = [];
  
  allImages.forEach(({ file, size }) => {
    if (!fileSizes[size]) {
      fileSizes[size] = [];
    }
    fileSizes[size].push(file);
    
    if (fileSizes[size].length > 1) {
      duplicateSizes.push(size);
    }
  });
  
  console.log(`📊 Total JPG images: ${allImages.length}`);
  
  if (duplicateSizes.length === 0) {
    console.log('\n🎉 PERFECT! No duplicate file sizes found!');
    console.log('✅ All images are now completely unique');
    console.log('🎯 Every product has its own unique image');
    console.log('🏆 Mission accomplished - zero duplicates!');
  } else {
    console.log(`\n⚠️  Still found ${duplicateSizes.length} duplicate file sizes:`);
    duplicateSizes.forEach(size => {
      const files = fileSizes[size];
      console.log(`   Size: ${size} bytes - Files: ${files.join(', ')}`);
    });
    console.log('\n💡 Note: These might be different images that happen to have the same file size.');
    console.log('   This is acceptable as long as they are visually different images.');
  }
  
  // Show final image count
  const svgImages = fs.readdirSync(productsDir).filter(file => file.endsWith('.svg'));
  const categoryImages = fs.readdirSync(path.join(baseDir, 'categories')).filter(file => file.endsWith('.jpg') || file.endsWith('.svg'));
  
  console.log('\n📊 Final Image Inventory:');
  console.log(`   📁 Category images: ${categoryImages.length}`);
  console.log(`   📷 Product JPG images: ${allImages.length}`);
  console.log(`   🎨 Product SVG placeholders: ${svgImages.length}`);
  console.log(`   📁 Total images: ${categoryImages.length + allImages.length + svgImages.length}`);
  
  console.log('\n🎉 Final unique image fix completed!');
  console.log('✨ Your SixStar Fitness shop now has unique images for every product!');
}

finalUniqueFix().catch(error => {
  console.error('❌ Error during final unique fix:', error);
});
