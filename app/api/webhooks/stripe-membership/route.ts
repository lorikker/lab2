import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createNewMembership, MembershipType } from '@/lib/new-membership';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    console.log('Stripe webhook event received:', event.type);

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Extract metadata
        const { plan, userId, invoiceNumber, orderNumber, customerName } = paymentIntent.metadata;
        
        if (!plan || !userId) {
          console.error('Missing required metadata in payment intent');
          break;
        }

        try {
          // Create membership and payment record
          const result = await createNewMembership({
            userId,
            membershipType: plan as MembershipType,
            price: paymentIntent.amount / 100, // Convert from cents
            currency: paymentIntent.currency.toUpperCase(),
            paymentMethod: 'stripe',
            paymentIntentId: paymentIntent.id,
            invoiceNumber,
            billingInfo: {
              customerName,
              email: paymentIntent.receipt_email,
              paymentIntentId: paymentIntent.id,
            },
          });

          console.log('Membership created successfully:', {
            membershipId: result.membership.id,
            paidMembershipId: result.paidMembership.id,
            userId,
            plan,
          });

          // Store invoice data for success page
          if (invoiceNumber) {
            // You can store this in a cache or session for the success page
            console.log('Invoice number for success page:', invoiceNumber);
          }

        } catch (error) {
          console.error('Error creating membership:', error);
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', failedPayment.id);
        // Handle failed payment if needed
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
