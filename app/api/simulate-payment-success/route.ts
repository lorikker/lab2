import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51RRbsi4Dw9UtbL2H6bvWDoSP4XMyReiX09oTOH67ZAMGl2iCSvgtrbXuc9BETb8HbxKMVBsdPuHGdWGwaSYFmeBM00dSFtNmJ3');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentIntentId } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    console.log('Simulating payment success for:', paymentIntentId);

    // In test mode, we can confirm the payment intent with a test payment method
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: 'pm_card_visa', // Test payment method
        return_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/trainers/payment`,
      });

      console.log('Payment simulation result:', paymentIntent.status);

      return NextResponse.json({
        success: true,
        status: paymentIntent.status,
        paymentIntentId: paymentIntent.id,
      });
    } catch (stripeError: any) {
      console.log('Stripe simulation error (expected in some cases):', stripeError.message);

      // Even if simulation fails, return success for testing
      return NextResponse.json({
        success: true,
        status: 'simulated_success',
        paymentIntentId: paymentIntentId,
        note: 'Payment simulated for testing purposes'
      });
    }

  } catch (error) {
    console.error('Error simulating payment:', error);
    return NextResponse.json(
      { error: 'Failed to simulate payment' },
      { status: 500 }
    );
  }
}
