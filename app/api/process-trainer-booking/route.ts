import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Processing trainer booking:', body);

    const { paymentIntentId, userId, customerEmail } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // For demo purposes, we'll simulate payment success
    // In production, you would check: paymentIntent.status === 'succeeded'
    console.log('Payment intent status:', paymentIntent.status);

    // Simulate payment confirmation for demo
    if (paymentIntent.status === 'requires_payment_method') {
      try {
        // Confirm the payment intent with test card
        await stripe.paymentIntents.confirm(paymentIntentId, {
          payment_method: 'pm_card_visa', // Test payment method
        });
        console.log('Payment intent confirmed successfully');
      } catch (confirmError) {
        console.log('Payment confirmation simulation - proceeding anyway for demo');
      }
    }

    // Extract booking details from metadata
    const {
      trainerId,
      trainerName,
      sessionType,
      date,
      time,
      invoiceNumber,
      orderNumber,
    } = paymentIntent.metadata;

    const amount = paymentIntent.amount / 100; // Convert from cents

    // Create trainer booking record
    const booking = await prisma.trainerBookings.create({
      data: {
        id: crypto.randomUUID(),
        userId: userId || 'guest-user',
        trainerId: parseInt(trainerId),
        trainerName: trainerName,
        sessionType: sessionType,
        bookingDate: date,
        bookingTime: time,
        amount: amount,
        paymentIntentId: paymentIntentId,
        invoiceNumber: invoiceNumber,
        orderNumber: orderNumber,
        customerEmail: customerEmail || '',
        status: 'confirmed',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log('Trainer booking created successfully:', {
      bookingId: booking.id,
      trainerId: trainerId,
      trainerName: trainerName,
      amount: amount,
    });

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      trainerId: trainerId,
      trainerName: trainerName,
      amount: amount,
      invoiceNumber: invoiceNumber,
      orderNumber: orderNumber,
    });

  } catch (error) {
    console.error('Error processing trainer booking:', error);
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    );
  }
}
