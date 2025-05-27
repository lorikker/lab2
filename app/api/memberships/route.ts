import { NextRequest, NextResponse } from 'next/server';
import {
  getUserActiveMembership,
  getUserMembershipHistory,
  getUserPaymentHistory
} from '@/lib/new-membership';

export async function GET(req: NextRequest) {
  try {
    // For testing, use test-user-id if no session
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'test-user-id';

    const type = searchParams.get('type') || 'active';
    console.log('Fetching memberships for userId:', userId, 'type:', type);

    switch (type) {
      case 'active':
        // Get user's active membership
        const activeMembership = await getUserActiveMembership(userId);
        return NextResponse.json({ membership: activeMembership });

      case 'history':
        // Get user's membership history
        const membershipHistory = await getUserMembershipHistory(userId);
        return NextResponse.json({ memberships: membershipHistory });

      case 'payments':
        // Get user's payment history
        const paymentHistory = await getUserPaymentHistory(userId);
        return NextResponse.json({ payments: paymentHistory });

      default:
        return NextResponse.json(
          { error: 'Invalid type parameter' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Error fetching memberships:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
