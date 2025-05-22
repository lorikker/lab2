import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicializimi i Stripe me secret key
const stripe = new Stripe('sk_test_51RRbsi4Dw9UtbL2H6bvWDoSP4XMyReiX09oTOH67ZAMGl2iCSvgtrbXuc9BETb8HbxKMVBsdPuHGdWGwaSYFmeBM00dSFtNmJ3', {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    // Marrja e të dhënave nga kërkesa
    const { amount, currency = 'usd', customerName, customerEmail, plan } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Shuma e pavlefshme' },
        { status: 400 }
      );
    }

    // Krijimi i payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Konvertimi në cent
      currency,
      payment_method_types: ['card'],
      metadata: {
        plan,
        customerName,
      },
      receipt_email: customerEmail,
      description: `${plan} Membership Plan`,
    });

    // Kthimi i client secret tek klienti
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error: any) {
    console.error('Gabim gjatë krijimit të payment intent:', error);
    return NextResponse.json(
      { error: error.message || 'Gabim gjatë krijimit të payment intent' },
      { status: 500 }
    );
  }
}
