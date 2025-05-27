import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { generateOrderNumber } from '@/lib/new-membership';

// Inicializimi i Stripe me secret key
const stripe = new Stripe('sk_test_51RRbsi4Dw9UtbL2H6bvWDoSP4XMyReiX09oTOH67ZAMGl2iCSvgtrbXuc9BETb8HbxKMVBsdPuHGdWGwaSYFmeBM00dSFtNmJ3', {
  apiVersion: '2023-10-16',
});

// Generate unique invoice number
function generateInvoiceNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `INV-${timestamp}-${random}`;
}

export async function POST(req: NextRequest) {
  try {
    // Marrja e të dhënave nga kërkesa
    const { amount, currency = 'usd', customerName, customerEmail, plan, userId, billingInfo } = await req.json();

    console.log('Payment intent request received:', { amount, plan, userId, customerEmail });

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Shuma e pavlefshme' },
        { status: 400 }
      );
    }

    if (!plan || !['basic', 'premium', 'elite'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid membership plan' },
        { status: 400 }
      );
    }

    if (!userId) {
      console.error('User ID is missing');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Generate invoice number and order number
    const invoiceNumber = generateInvoiceNumber();
    const orderNumber = generateOrderNumber();
    console.log('Generated invoice number:', invoiceNumber);
    console.log('Generated order number:', orderNumber);

    // Krijimi i payment intent
    console.log('Creating Stripe payment intent...');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Konvertimi në cent
      currency,
      payment_method_types: ['card'],
      metadata: {
        plan,
        customerName,
        userId,
        invoiceNumber,
        orderNumber,
      },
      receipt_email: customerEmail,
      description: `${plan} Membership Plan - Invoice ${invoiceNumber}`,
    });
    console.log('Payment intent created:', paymentIntent.id);

    // Kthimi i client secret tek klienti
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      invoiceNumber,
      orderNumber,
    });
  } catch (error: any) {
    console.error('Gabim gjatë krijimit të payment intent:', error);
    return NextResponse.json(
      { error: error.message || 'Gabim gjatë krijimit të payment intent' },
      { status: 500 }
    );
  }
}
