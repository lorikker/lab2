import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Use a stable Stripe API version
const stripe = new Stripe('sk_test_51RRbsi4Dw9UtbL2H6bvWDoSP4XMyReiX09oTOH67ZAMGl2iCSvgtrbXuc9BETb8HbxKMVBsdPuHGdWGwaSYFmeBM00dSFtNmJ3', {
  apiVersion: '2024-04-10', // Changed from '2024-12-18.acacia'
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Store payment intent request received:', body);

    const { amount, cartItems, userId, customerEmail, shippingAddress } = body;

    // Improved amount check: must be a number and > 0
    if (
      typeof amount !== 'number' ||
      amount <= 0 ||
      !cartItems ||
      !Array.isArray(cartItems) ||
      cartItems.length === 0
    ) {
      return NextResponse.json(
        { error: 'Missing or invalid required fields' },
        { status: 400 }
      );
    }

    // Generate unique identifiers
    const invoiceNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const orderNumber = `ORD-STORE-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    console.log('Generated store invoice number:', invoiceNumber);
    console.log('Generated store order number:', orderNumber);

    // Prepare metadata for Stripe
    const metadata: Record<string, string> = {
      type: 'store_order',
      userId: userId || 'guest-user',
      customerEmail: customerEmail || '',
      invoiceNumber,
      orderNumber,
      // Only include minimal cart info to avoid exceeding 500 char limit
      cart: cartItems.map((item: any) => `${item.id}:${item.quantity}`).join(','),
      shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : '',
    };

    // Create Stripe payment intent
    console.log('Creating Stripe payment intent for store order...');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata,
      description: `Store Order - ${orderNumber}`,
      receipt_email: customerEmail || undefined,
    });

    console.log('Store payment intent created:', paymentIntent.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      invoiceNumber,
      orderNumber,
    });

  } catch (error: any) {
    // Improved error logging
    console.error('Error creating store payment intent:', error?.message || error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}