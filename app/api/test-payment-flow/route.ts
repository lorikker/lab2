import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/auth';
import { createNewMembership, MembershipType } from '@/lib/new-membership';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log('🧪 Testing payment flow...');

    // Test creating a membership directly
    const testUserId = session.user.id || session.user.email || 'test-user';
    const testUserName = session.user.name || 'Test User';

    console.log('Creating test membership for:', { testUserId, testUserName });

    const result = await createNewMembership({
      userId: testUserId,
      userName: testUserName,
      membershipType: 'premium' as MembershipType,
      price: 49.99,
      currency: 'USD',
      paymentMethod: 'stripe',
      paymentIntentId: `pi_test_${Date.now()}`,
      invoiceNumber: `INV-TEST-${Date.now()}`,
      billingInfo: {
        customerName: testUserName,
        email: session.user.email,
        paymentIntentId: `pi_test_${Date.now()}`,
      },
    });

    console.log('✅ Test membership created successfully:', {
      membershipId: result.membership.id,
      paidMembershipId: result.paidMembership.id,
      isExtension: result.isExtension,
    });

    return NextResponse.json({
      success: true,
      message: 'Test membership created successfully',
      data: {
        membership: {
          id: result.membership.id,
          membershipType: result.membership.membershipType,
          status: result.membership.status,
          startDate: result.membership.startDate,
          endDate: result.membership.endDate,
          daysRemaining: result.membership.daysRemaining,
        },
        paidMembership: {
          id: result.paidMembership.id,
          orderNumber: result.paidMembership.orderNumber,
          amount: result.paidMembership.amount,
          paymentDate: result.paidMembership.paymentDate,
        },
        isExtension: result.isExtension,
      }
    });

  } catch (error) {
    console.error('❌ Test payment flow error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.stack
    }, { status: 500 });
  }
}
