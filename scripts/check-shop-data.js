import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkShopData() {
  try {
    console.log('🔍 Checking shop data...\n');

    // Check products
    const products = await prisma.product.findMany({
      take: 5,
      include: {
        category: true
      }
    });

    console.log(`📦 Products in database: ${products.length}`);
    if (products.length > 0) {
      console.log('Sample products:');
      products.forEach(product => {
        console.log(`  - ${product.name} ($${product.price}) - Category: ${product.category?.name || 'None'}`);
      });
    } else {
      console.log('❌ No products found! You need to add products first.');
    }

    console.log('\n');

    // Check categories
    const categories = await prisma.category.findMany();
    console.log(`📂 Categories in database: ${categories.length}`);
    if (categories.length > 0) {
      console.log('Categories:');
      categories.forEach(category => {
        console.log(`  - ${category.name}`);
      });
    }

    console.log('\n');

    // Check if user has a cart
    const carts = await prisma.cart.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    console.log(`🛒 Carts in database: ${carts.length}`);
    carts.forEach(cart => {
      console.log(`  Cart ${cart.id}: ${cart.items.length} items`);
      cart.items.forEach(item => {
        console.log(`    - ${item.product?.name || 'Unknown'} (qty: ${item.quantity})`);
      });
    });

    console.log('\n');

    // Check orders
    const orders = await prisma.order.findMany({
      take: 3,
      include: {
        items: true
      }
    });

    console.log(`📋 Orders in database: ${orders.length}`);
    if (orders.length > 0) {
      console.log('Recent orders:');
      orders.forEach(order => {
        console.log(`  - Order ${order.orderNumber}: $${order.total} (${order.status})`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking shop data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkShopData();
