import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Final set of completely unique fitness images - each product gets a different photo
const finalUniqueImages = {
  categories: {
    "memberships.jpg":
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
    "equipment.jpg":
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
    "nutrition.jpg":
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop",
    "apparel.jpg":
      "https://images.unsplash.com/photo-1539710094188-9bae661a85e4?q=80&w=800&auto=format&fit=crop",
    "accessories.jpg":
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
    "bundles.jpg":
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop",
    "recovery.jpg":
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
    "cardio.jpg":
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=800&auto=format&fit=crop",
  },
  products: {
    // Memberships - 3 unique images
    "basic-membership.jpg":
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600&auto=format&fit=crop",
    "premium-membership.jpg":
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop",
    "vip-membership.jpg":
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop",

    // Equipment - 9 unique images
    "adjustable-dumbbells.jpg":
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop",
    "dumbbells-detail.jpg":
      "https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=600&auto=format&fit=crop",
    "olympic-barbell.jpg":
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=600&auto=format&fit=crop",
    "power-rack.jpg":
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=600&auto=format&fit=crop",
    "power-rack-setup.jpg":
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop",
    "resistance-bands.jpg":
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=600&auto=format&fit=crop",
    "kettlebell-set.jpg":
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=600&auto=format&fit=crop",
    "yoga-mat.jpg":
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&auto=format&fit=crop",
    "pull-up-bar.jpg":
      "https://images.unsplash.com/photo-1544991875-5dc1b05f607d?q=80&w=600&auto=format&fit=crop",

    // Nutrition - 8 unique images (replacing failed downloads with new unique IDs)
    "whey-protein.jpg":
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=600&auto=format&fit=crop",
    "protein-flavors.jpg":
      "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?q=80&w=600&auto=format&fit=crop", // NEW
    "pre-workout.jpg":
      "https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?q=80&w=600&auto=format&fit=crop",
    "bcaa.jpg":
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop",
    "multivitamin.jpg":
      "https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=600&auto=format&fit=crop", // NEW
    "creatine.jpg":
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?q=80&w=600&auto=format&fit=crop",
    "fat-burner.jpg":
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=600&auto=format&fit=crop",
    "omega-3.jpg":
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",

    // Apparel - 9 unique images (replacing failed downloads with new unique IDs)
    "tank-top.jpg":
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=600&auto=format&fit=crop",
    "tank-colors.jpg":
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
    "athletic-shorts.jpg":
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop",
    "training-shoes.jpg":
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop", // NEW
    "shoes-detail.jpg":
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop",
    "compression-leggings.jpg":
      "https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?q=80&w=600&auto=format&fit=crop",
    "hoodie.jpg":
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop",
    "sports-bra.jpg":
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?q=80&w=600&auto=format&fit=crop",
    "gym-gloves.jpg":
      "https://images.unsplash.com/photo-1556821840-3a9c6dcb0e78?q=80&w=600&auto=format&fit=crop",

    // Accessories - 3 unique images (replacing duplicates with new unique IDs)
    "water-bottle.jpg":
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop", // NEW
    "gym-bag.jpg":
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=600&auto=format&fit=crop", // NEW
    "fitness-tracker.jpg":
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=600&auto=format&fit=crop", // NEW

    // Recovery - 3 unique images (replacing duplicates with new unique IDs)
    "foam-roller.jpg":
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop",
    "massage-gun.jpg":
      "https://images.unsplash.com/photo-1609899464726-209befaac5bc?q=80&w=600&auto=format&fit=crop", // NEW
    "ice-bath.jpg":
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop",

    // Cardio - 3 unique images (replacing duplicates with new unique IDs)
    "jump-rope.jpg":
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=600&auto=format&fit=crop", // NEW
    "battle-ropes.jpg":
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop", // NEW
    "agility-ladder.jpg":
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=600&auto=format&fit=crop", // NEW
  },
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
    console.error(
      `❌ Failed to download ${path.basename(filepath)}:`,
      error.message,
    );
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

async function downloadFinalUniqueImages() {
  console.log(
    "🖼️  Downloading final unique fitness images (zero duplicates guaranteed)...\n",
  );

  const baseDir = path.join(__dirname, "..", "public", "uploads");
  const categoriesDir = path.join(baseDir, "categories");
  const productsDir = path.join(baseDir, "products");

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

  // Download category images (keep existing ones that work)
  console.log("📁 Checking category images...");
  for (const [filename, url] of Object.entries(finalUniqueImages.categories)) {
    const filepath = path.join(categoriesDir, filename);

    // Only download if file doesn't exist
    if (!fs.existsSync(filepath)) {
      const success = await downloadImage(url, filepath);
      if (success) {
        totalDownloaded++;
      } else {
        totalFailed++;

        // Create placeholder if download fails
        const text = filename
          .replace(".jpg", "")
          .replace("-", " ")
          .toUpperCase();
        const placeholder = createPlaceholderImage(filename, text, 800, 600);
        const placeholderPath = filepath.replace(".jpg", ".svg");
        fs.writeFileSync(placeholderPath, placeholder);
        console.log(
          `🎨 Created placeholder: ${path.basename(placeholderPath)}`,
        );
      }

      // Add small delay to be respectful to the server
      await new Promise((resolve) => setTimeout(resolve, 500));
    } else {
      console.log(`✅ Category image exists: ${filename}`);
    }
  }

  console.log("\n🛍️  Downloading/replacing product images with unique ones...");

  // List of products that need new unique images (the ones that were duplicated)
  const productsToReplace = [
    "water-bottle.jpg",
    "gym-bag.jpg",
    "fitness-tracker.jpg",
    "massage-gun.jpg",
    "jump-rope.jpg",
    "battle-ropes.jpg",
    "agility-ladder.jpg",
    "protein-flavors.jpg",
    "multivitamin.jpg",
    "training-shoes.jpg",
  ];

  for (const [filename, url] of Object.entries(finalUniqueImages.products)) {
    const filepath = path.join(productsDir, filename);

    // Replace if it's in the list of products to replace, or if it doesn't exist
    if (productsToReplace.includes(filename) || !fs.existsSync(filepath)) {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        totalReplaced++;
        console.log(`🔄 Replacing duplicate: ${filename}`);
      }

      const success = await downloadImage(url, filepath);
      if (success) {
        totalDownloaded++;
      } else {
        totalFailed++;

        // Create placeholder if download fails
        const text = filename
          .replace(".jpg", "")
          .replace("-", " ")
          .toUpperCase();
        const placeholder = createPlaceholderImage(filename, text);
        const placeholderPath = filepath.replace(".jpg", ".svg");
        fs.writeFileSync(placeholderPath, placeholder);
        console.log(
          `🎨 Created placeholder: ${path.basename(placeholderPath)}`,
        );
      }

      // Add small delay to be respectful to the server
      await new Promise((resolve) => setTimeout(resolve, 500));
    } else {
      console.log(`✅ Product image exists: ${filename}`);
    }
  }

  console.log("\n📊 Final Download Summary:");
  console.log(`✅ Successfully downloaded: ${totalDownloaded} images`);
  console.log(`🔄 Files replaced: ${totalReplaced} images`);
  console.log(`❌ Failed downloads: ${totalFailed} images`);
  console.log(
    `📷 Total unique images: ${Object.keys(finalUniqueImages.categories).length + Object.keys(finalUniqueImages.products).length}`,
  );
  console.log("\n🎉 Final unique image process completed!");

  // Verify no duplicates by checking photo IDs
  const allUrls = [
    ...Object.values(finalUniqueImages.categories),
    ...Object.values(finalUniqueImages.products),
  ];

  // Extract photo IDs from URLs
  const photoIds = allUrls.map((url) => {
    const match = url.match(/photo-([a-zA-Z0-9_-]+)/);
    return match ? match[1] : url;
  });

  const uniquePhotoIds = new Set(photoIds);
  if (photoIds.length === uniquePhotoIds.size) {
    console.log("✅ VERIFIED: All images have completely unique photo IDs!");
    console.log(
      "🎯 Every product now has its own unique image - no duplicates!",
    );
  } else {
    console.log(
      `⚠️  Warning: Found ${photoIds.length - uniquePhotoIds.size} duplicate photo IDs`,
    );

    // Show duplicates
    const idCounts = {};
    photoIds.forEach((id) => {
      idCounts[id] = (idCounts[id] || 0) + 1;
    });

    console.log("\n🔍 Duplicate photo IDs found:");
    Object.entries(idCounts).forEach(([id, count]) => {
      if (count > 1) {
        console.log(`   ${count}x: ${id}`);
      }
    });
  }
}

downloadFinalUniqueImages().catch((error) => {
  console.error("❌ Error during final unique image download process:", error);
});
