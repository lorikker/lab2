import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Trainer payment intent request received:', body);

    const { amount, trainerId, trainerName, sessionType, date, time, userId, customerEmail } = body;

    if (!amount || !trainerId || !trainerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique identifiers
    const invoiceNumber = `TRN-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const orderNumber = `TRN-ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    console.log('Generated trainer invoice number:', invoiceNumber);
    console.log('Generated trainer order number:', orderNumber);

    // Create Stripe payment intent
    console.log('Creating Stripe payment intent for trainer booking...');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        type: 'trainer_booking',
        trainerId: trainerId.toString(),
        trainerName: trainerName,
        sessionType: sessionType || 'single',
        date: date || '',
        time: time || '',
        userId: userId || 'guest-user',
        customerEmail: customerEmail || '',
        invoiceNumber: invoiceNumber,
        orderNumber: orderNumber,
      },
      description: `Trainer Booking - ${trainerName} (${sessionType === 'package' ? 'Package Deal' : 'Single Session'})`,
    });

    console.log('Trainer payment intent created:', paymentIntent.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      invoiceNumber: invoiceNumber,
      orderNumber: orderNumber,
    });

  } catch (error) {
    console.error('Error creating trainer payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
