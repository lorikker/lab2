import { NextRequest, NextResponse } from 'next/server';
import { createNewMembership, MembershipType } from '@/lib/new-membership';

export async function POST(req: NextRequest) {
  try {
    const { userId, membershipType, price } = await req.json();

    console.log('Creating test membership:', { userId, membershipType, price });

    // Create membership and payment record
    const result = await createNewMembership({
      userId: userId || 'test-user-id',
      membershipType: membershipType as MembershipType || 'premium',
      price: price || 49.99,
      currency: 'USD',
      paymentMethod: 'stripe',
      paymentIntentId: 'pi_test_' + Date.now(),
      invoiceNumber: 'INV-TEST-' + Date.now(),
      billingInfo: {
        customerName: 'Test User',
        email: 'test@example.com',
      },
    });

    console.log('Test membership created successfully:', {
      membershipId: result.membership.id,
      paidMembershipId: result.paidMembership.id,
    });

    return NextResponse.json({
      success: true,
      membership: result.membership,
      paidMembership: result.paidMembership,
    });
  } catch (error: any) {
    console.error('Error creating test membership:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
