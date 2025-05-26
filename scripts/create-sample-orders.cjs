// This script creates sample orders for testing
// Run with: node scripts/create-sample-orders.cjs your-email@example.com

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSampleOrders() {
  const email = process.argv[2];
  
  if (!email) {
    console.error('Please provide a user email');
    console.error('Usage: node scripts/create-sample-orders.cjs user@example.com');
    process.exit(1);
  }
  
  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }
    
    // Find some products to use in the orders
    const products = await prisma.product.findMany({
      take: 5,
    });
    
    if (products.length === 0) {
      console.error('No products found in the database');
      console.error('Please run scripts/create-sample-products.js first');
      process.exit(1);
    }
    
    // Create a few sample orders
    const orderStatuses = ['pending', 'processing', 'completed'];
    const paymentStatuses = ['pending', 'paid'];
    
    for (let i = 0; i < 3; i++) {
      // Generate a random order number
      const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Select random status
      const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
      
      // Create order items (2-3 random products)
      const numItems = Math.floor(Math.random() * 2) + 2; // 2-3 items
      const orderItems = [];
      let total = 0;
      
      for (let j = 0; j < numItems; j++) {
        // Select a random product
        const product = products[Math.floor(Math.random() * products.length)];
        
        // Random quantity between 1 and 3
        const quantity = Math.floor(Math.random() * 3) + 1;
        
        // Use sale price if available, otherwise regular price
        const price = product.salePrice || product.price;
        
        // Add to total
        total += Number(price) * quantity;
        
        // Create order item
        orderItems.push({
          name: product.name,
          price: price,
          quantity: quantity,
          productId: product.id,
        });
      }
      
      // Create shipping and billing info
      const shippingInfo = {
        name: user.name,
        address: '123 Main Street',
        city: 'Pristina',
        state: '',
        zipCode: '10000',
        country: 'Kosovo',
      };
      
      // Create the order
      const order = await prisma.order.create({
        data: {
          orderNumber,
          status,
          total,
          paymentStatus,
          shippingInfo,
          billingInfo: shippingInfo, // Same as shipping for this example
          userId: user.id,
          items: {
            create: orderItems,
          },
        },
      });
      
      console.log(`Created order #${orderNumber} with ${numItems} items, total: $${total.toFixed(2)}`);
    }
    
    console.log('Sample orders created successfully!');
  } catch (error) {
    console.error('Error creating sample orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleOrders();
