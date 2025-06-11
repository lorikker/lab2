import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkOrders() {
  try {
    console.log('📦 Checking orders in database...\n');
    
    // Get all orders
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10 // Get last 10 orders
    });
    
    console.log(`📋 Found ${orders.length} orders:\n`);
    
    if (orders.length === 0) {
      console.log('❌ No orders found in database');
      
      // Check if the orders table exists
      try {
        const tableInfo = await prisma.$queryRaw`
          SELECT column_name, data_type, is_nullable 
          FROM information_schema.columns 
          WHERE table_name = 'orders' 
          ORDER BY ordinal_position;
        `;
        
        console.log('\n📊 Orders table structure:');
        tableInfo.forEach(col => {
          console.log(`   ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
        });
        
      } catch (error) {
        console.log('❌ Error checking orders table structure:', error.message);
      }
      
    } else {
      orders.forEach((order, index) => {
        console.log(`${index + 1}. Order ID: ${order.id}`);
        console.log(`   Order Number: ${order.orderNumber}`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Total: $${Number(order.total)}`);
        console.log(`   Payment Status: ${order.paymentStatus}`);
        console.log(`   Payment Intent: ${order.paymentIntent}`);
        console.log(`   User: ${order.user?.name || 'Guest'} (${order.user?.email || 'No email'})`);
        console.log(`   Items: ${order.items.length} items`);
        order.items.forEach((item, itemIndex) => {
          console.log(`     ${itemIndex + 1}. ${item.name} x${item.quantity} - $${Number(item.price)}`);
        });
        console.log(`   Created: ${order.createdAt}`);
        console.log('');
      });
    }
    
    // Also check order items
    console.log('\n📦 Checking order items...');
    const orderItems = await prisma.orderItem.findMany({
      take: 5,
      orderBy: { id: 'desc' }
    });
    
    console.log(`Found ${orderItems.length} order items`);
    
  } catch (error) {
    console.error('❌ Error checking orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrders();
