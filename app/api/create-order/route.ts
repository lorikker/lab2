import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Creating order with data:', body);

    const { paymentIntentId, email } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    // Retrieve payment intent from Stripe to get order details
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Extract metadata from payment intent
    const metadata = paymentIntent.metadata;
    const {
      type,
      userId,
      customerEmail,
      orderNumber,
      cart,
      shippingAddress
    } = metadata;

    // Verify this is a store order
    if (type !== 'store_order') {
      return NextResponse.json(
        { error: 'Invalid order type' },
        { status: 400 }
      );
    }

    // Parse cart items from metadata
    let cartItems = [];
    if (cart) {
      try {
        // Cart is stored as "id:quantity,id:quantity"
        cartItems = cart.split(',').map(item => {
          const [id, quantity] = item.split(':');
          return { id, quantity: parseInt(quantity) };
        });
      } catch (error) {
        console.error('Error parsing cart items:', error);
      }
    }

    // Parse shipping address
    let parsedShippingAddress = null;
    if (shippingAddress) {
      try {
        parsedShippingAddress = JSON.parse(shippingAddress);
      } catch (error) {
        console.error('Error parsing shipping address:', error);
      }
    }

    // Create order in database
    const order = await db.order.create({
      data: {
        orderNumber: orderNumber || `ORD-${Date.now()}`,
        status: 'completed',
        total: paymentIntent.amount / 100, // Convert from cents
        paymentIntent: paymentIntentId,
        paymentStatus: 'paid',
        shippingInfo: parsedShippingAddress,
        billingInfo: {
          email: customerEmail || email,
          paymentIntentId: paymentIntentId,
        },
        userId: userId !== 'guest-user' ? userId : null,
      }
    });

    console.log('Order created successfully:', order.id);

    // Create order items if we have cart data
    if (cartItems.length > 0) {
      console.log('Creating order items for cart:', cartItems);

      for (const cartItem of cartItems) {
        try {
          // Get product details
          const product = await db.product.findUnique({
            where: { id: cartItem.id }
          });

          if (product) {
            await db.orderItem.create({
              data: {
                orderId: order.id,
                productId: product.id,
                name: product.name,
                price: product.salePrice || product.price,
                quantity: cartItem.quantity,
              }
            });
          } else {
            console.log(`Product not found: ${cartItem.id}`);
          }
        } catch (error) {
          console.error('Error creating order item:', error);
        }
      }
    }

    // Create admin notification for new order
    try {
      const customerName = parsedShippingAddress?.name || customerEmail || 'Guest Customer';
      const orderTotal = (paymentIntent.amount / 100).toFixed(2);

      await db.notifications.create({
        data: {
          userId: 'admin-user',
          type: 'order_created',
          title: 'New Shop Order',
          message: `${customerName} placed a new order for $${orderTotal}`,
          isAdmin: true,
          isRead: false,
          data: JSON.stringify({
            orderId: order.id,
            orderNumber: order.orderNumber,
            customerName,
            customerEmail: customerEmail || email,
            total: orderTotal,
            paymentIntentId: paymentIntentId
          })
        }
      });

      console.log('Admin notification created for new order');
    } catch (notificationError) {
      console.error('Error creating admin notification:', notificationError);
      // Don't fail the order if notification creation fails
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      success: true
    });

  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}