import { NextRequest, NextResponse } from 'next/server';
import { createNewMembership, MembershipType } from '@/lib/new-membership';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paymentIntentId, userId, userName, membershipType, amount, customerEmail, billingInfo } = body;

    console.log('Processing membership manually:', {
      paymentIntentId,
      userId,
      userName,
      membershipType,
      amount,
      customerEmail
    });

    if (!paymentIntentId || !userId || !membershipType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create membership and payment record
    const result = await createNewMembership({
      userId,
      userName,
      membershipType: membershipType as MembershipType,
      price: amount,
      currency: 'USD',
      paymentMethod: 'stripe',
      paymentIntentId,
      invoiceNumber: `INV-${Date.now()}`,
      billingInfo: {
        customerName: billingInfo?.firstName && billingInfo?.lastName
          ? `${billingInfo.firstName} ${billingInfo.lastName}`
          : 'Guest User',
        email: customerEmail,
        paymentIntentId,
      },
    });

    console.log('Membership processed successfully:', {
      membershipId: result.membership.id,
      paidMembershipId: result.paidMembership.id,
      userId,
      membershipType,
      isExtension: result.isExtension,
      endDate: result.membership.endDate,
      daysRemaining: result.membership.daysRemaining
    });

    return NextResponse.json({
      success: true,
      membership: result.membership,
      paidMembership: result.paidMembership,
      isExtension: result.isExtension,
      message: result.isExtension
        ? `Membership extended! You now have ${result.membership.daysRemaining} days remaining.`
        : `New membership created! You have ${result.membership.daysRemaining} days of access.`
    });

  } catch (error: any) {
    console.error('Error processing membership:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process membership' },
      { status: 500 }
    );
  }
}
