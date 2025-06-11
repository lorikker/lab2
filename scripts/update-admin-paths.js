import fs from 'fs';
import path from 'path';

// Function to recursively find all .tsx files in a directory
function findTsxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findTsxFiles(fullPath));
    } else if (item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to update paths in a file
function updatePathsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Update dashboard paths to admin paths
    const replacements = [
      // Breadcrumb updates
      [/{ label: "Dashboard", href: "\/dashboard" }/g, '{ label: "Admin Dashboard", href: "/admin" }'],
      [/{ label: "Shop Management", href: "\/dashboard\/shop" }/g, '{ label: "Shop Management", href: "/admin/shop" }'],
      
      // Link updates
      [/href="\/dashboard\/shop/g, 'href="/admin/shop'],
      
      // Redirect updates
      [/redirect\("\/dashboard\/shop/g, 'redirect("/admin/shop'],
      [/callbackUrl=\/dashboard\/shop/g, 'callbackUrl=/admin/shop'],
      
      // Other dashboard references in shop context
      [/\/dashboard\/shop/g, '/admin/shop'],
    ];
    
    for (const [pattern, replacement] of replacements) {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        content = newContent;
        updated = true;
      }
    }
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    } else {
      console.log(`⏭️  No changes needed: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Main function
function updateAdminPaths() {
  console.log('🔄 Updating admin paths in shop management files...\n');
  
  const adminShopDir = 'app/admin/shop';
  
  if (!fs.existsSync(adminShopDir)) {
    console.error(`❌ Directory ${adminShopDir} does not exist`);
    return;
  }
  
  const files = findTsxFiles(adminShopDir);
  console.log(`📁 Found ${files.length} .tsx files to check\n`);
  
  let updatedCount = 0;
  
  for (const file of files) {
    if (updatePathsInFile(file)) {
      updatedCount++;
    }
  }
  
  console.log(`\n🎉 Update complete!`);
  console.log(`   Updated: ${updatedCount} files`);
  console.log(`   Total checked: ${files.length} files`);
  
  if (updatedCount > 0) {
    console.log('\n📝 Summary of changes:');
    console.log('   ✅ Dashboard breadcrumbs → Admin Dashboard');
    console.log('   ✅ /dashboard/shop/* → /admin/shop/*');
    console.log('   ✅ Redirect paths updated');
    console.log('   ✅ Callback URLs updated');
  }
}

updateAdminPaths();
