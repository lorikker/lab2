import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function displayBundlesSummary() {
  console.log('🎁 SixStar Fitness Bundles Summary');
  console.log('==================================\n');

  const bundles = [
    {
      name: "Complete Home Gym Starter",
      description: "Everything you need to start your fitness journey at home",
      originalPrice: 419.96,
      bundlePrice: 379.99,
      savings: 39.97,
      featured: true,
      products: ["Adjustable Dumbbell Set", "Resistance Band Set", "Yoga Mat Premium", "Whey Protein Isolate"],
      image: "home-gym-starter.jpg"
    },
    {
      name: "Strength Training Power Pack", 
      description: "Serious strength training bundle for dedicated lifters",
      originalPrice: 1139.98,
      bundlePrice: 999.99,
      savings: 139.99,
      featured: true,
      products: ["Olympic Barbell", "Power Rack System", "Creatine Monohydrate (2x)"],
      image: "strength-training-pack.jpg"
    },
    {
      name: "Nutrition Essentials Bundle",
      description: "Complete nutrition support for your fitness goals",
      originalPrice: 129.96,
      bundlePrice: 109.99,
      savings: 19.97,
      featured: false,
      products: ["Whey Protein Isolate", "Pre-Workout Energy", "BCAA Recovery", "Multivitamin Complex"],
      image: "nutrition-essentials.jpg"
    },
    {
      name: "Cardio Warrior Kit",
      description: "High-intensity cardio training bundle",
      originalPrice: 134.97,
      bundlePrice: 119.99,
      savings: 14.98,
      featured: false,
      products: ["Battle Ropes", "Jump Rope Speed", "Agility Ladder"],
      image: "cardio-warrior-kit.jpg"
    },
    {
      name: "Recovery & Wellness Package",
      description: "Complete recovery solution for serious athletes",
      originalPrice: 249.97,
      bundlePrice: 219.99,
      savings: 29.98,
      featured: false,
      products: ["Massage Gun", "Foam Roller", "Omega-3 Fish Oil (2x)"],
      image: "recovery-wellness.svg"
    },
    {
      name: "Fitness Apparel Starter Set",
      description: "Complete workout wardrobe essentials",
      originalPrice: 209.96,
      bundlePrice: 179.99,
      savings: 29.97,
      featured: false,
      products: ["Performance Tank Top (2x)", "Athletic Shorts", "Training Shoes", "Gym Gloves"],
      image: "apparel-starter-set.svg"
    },
    {
      name: "Functional Fitness Bundle",
      description: "Versatile equipment for functional training",
      originalPrice: 289.97,
      bundlePrice: 259.99,
      savings: 29.98,
      featured: true,
      products: ["Kettlebell Set", "Resistance Band Set", "Pull-Up Bar", "Pre-Workout Energy"],
      image: "functional-fitness.jpg"
    },
    {
      name: "Gym Essentials Kit",
      description: "Everything you need for gym sessions",
      originalPrice: 148.97,
      bundlePrice: 129.99,
      savings: 18.98,
      featured: false,
      products: ["Water Bottle Insulated", "Gym Bag Large", "Fitness Tracker", "Sports Bra"],
      image: "gym-essentials-kit.jpg"
    }
  ];

  // Display each bundle
  bundles.forEach((bundle, index) => {
    const savingsPercent = ((bundle.savings / bundle.originalPrice) * 100).toFixed(0);
    const featuredIcon = bundle.featured ? '⭐' : '  ';
    
    console.log(`${featuredIcon} ${index + 1}. ${bundle.name}`);
    console.log(`   📝 ${bundle.description}`);
    console.log(`   💰 Bundle Price: $${bundle.bundlePrice}`);
    console.log(`   🏷️  Original Total: $${bundle.originalPrice}`);
    console.log(`   💸 You Save: $${bundle.savings} (${savingsPercent}% off)`);
    console.log(`   📦 Products (${bundle.products.length}):`);
    bundle.products.forEach(product => {
      console.log(`      • ${product}`);
    });
    console.log(`   🖼️  Image: ${bundle.image}`);
    console.log('');
  });

  // Calculate totals
  const totalBundles = bundles.length;
  const featuredBundles = bundles.filter(b => b.featured).length;
  const totalSavings = bundles.reduce((sum, b) => sum + b.savings, 0);
  const averageSavings = totalSavings / totalBundles;
  const priceRange = {
    min: Math.min(...bundles.map(b => b.bundlePrice)),
    max: Math.max(...bundles.map(b => b.bundlePrice))
  };

  console.log('📊 Bundle Statistics:');
  console.log(`   🎁 Total Bundles: ${totalBundles}`);
  console.log(`   ⭐ Featured Bundles: ${featuredBundles}`);
  console.log(`   💰 Price Range: $${priceRange.min} - $${priceRange.max}`);
  console.log(`   💸 Total Savings Available: $${totalSavings.toFixed(2)}`);
  console.log(`   📈 Average Savings per Bundle: $${averageSavings.toFixed(2)}`);

  console.log('\n🖼️  Bundle Images Status:');
  const bundlesDir = path.join(__dirname, '..', 'public', 'uploads', 'bundles');
  
  if (fs.existsSync(bundlesDir)) {
    bundles.forEach(bundle => {
      const imagePath = path.join(bundlesDir, bundle.image);
      const exists = fs.existsSync(imagePath);
      const status = exists ? '✅' : '❌';
      const type = bundle.image.endsWith('.svg') ? '🎨 SVG' : '📷 JPG';
      console.log(`   ${status} ${type} ${bundle.image}`);
    });
  } else {
    console.log('   📁 Bundles directory not found');
  }

  console.log('\n🎯 Bundle Categories:');
  const categories = {
    'Home Gym': ['Complete Home Gym Starter', 'Functional Fitness Bundle'],
    'Strength Training': ['Strength Training Power Pack'],
    'Nutrition': ['Nutrition Essentials Bundle'],
    'Cardio': ['Cardio Warrior Kit'],
    'Recovery': ['Recovery & Wellness Package'],
    'Apparel': ['Fitness Apparel Starter Set'],
    'Accessories': ['Gym Essentials Kit']
  };

  Object.entries(categories).forEach(([category, bundleNames]) => {
    console.log(`   🏷️  ${category}: ${bundleNames.length} bundle${bundleNames.length > 1 ? 's' : ''}`);
    bundleNames.forEach(name => {
      console.log(`      • ${name}`);
    });
  });

  console.log('\n🚀 To Create Bundles in Database:');
  console.log('   1. Ensure database connection is available');
  console.log('   2. Run: node scripts/create-fitness-bundles.js');
  console.log('   3. Bundles will be created with all product associations');
  console.log('   4. Images are already downloaded and ready');

  console.log('\n✨ Your SixStar Fitness bundles are ready to boost sales!');
}

displayBundlesSummary();
