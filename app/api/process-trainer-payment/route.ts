import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51RRbsi4Dw9UtbL2H6bvWDoSP4XMyReiX09oTOH67ZAMGl2iCSvgtrbXuc9BETb8HbxKMVBsdPuHGdWGwaSYFmeBM00dSFtNmJ3');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Processing trainer payment:', body);

    const { paymentIntentId, cardData, billingDetails } = body;

    if (!paymentIntentId || !cardData || !billingDetails) {
      return NextResponse.json(
        { error: 'Missing required payment data' },
        { status: 400 }
      );
    }

    // Validate card data
    if (!cardData.number || !cardData.exp_month || !cardData.exp_year || !cardData.cvc) {
      return NextResponse.json(
        { error: 'Incomplete card information' },
        { status: 400 }
      );
    }

    // Create payment method on server side
    console.log('Creating payment method...');
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: cardData.number,
        exp_month: cardData.exp_month,
        exp_year: cardData.exp_year,
        cvc: cardData.cvc,
      },
      billing_details: {
        name: billingDetails.name,
        email: billingDetails.email,
        address: {
          line1: billingDetails.address.line1,
          city: billingDetails.address.city,
          postal_code: billingDetails.address.postal_code,
          country: billingDetails.address.country,
        },
      },
    });

    console.log('Payment method created:', paymentMethod.id);

    // Confirm the payment intent with the payment method
    console.log('Confirming payment intent...');
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethod.id,
    });

    console.log('Payment intent confirmed:', paymentIntent.status);

    if (paymentIntent.status === 'succeeded') {
      return NextResponse.json({
        success: true,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      });
    } else if (paymentIntent.status === 'requires_action') {
      // Handle 3D Secure or other authentication
      return NextResponse.json({
        success: false,
        error: 'Payment requires additional authentication',
        requires_action: true,
        client_secret: paymentIntent.client_secret,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: `Payment failed with status: ${paymentIntent.status}`,
      });
    }

  } catch (error: any) {
    console.error('Error processing trainer payment:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return NextResponse.json(
        { 
          success: false,
          error: error.message || 'Your card was declined'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Payment processing failed'
      },
      { status: 500 }
    );
  }
}
