import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

export async function GET(request: NextRequest) {
  try {
    // Get all memberships with user information
    const memberships = await db.memberships.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Transform the data to include user name directly
    const transformedMemberships = memberships.map(membership => ({
      id: membership.id,
      name: membership.name || membership.user?.name || 'Unknown User',
      userId: membership.userId,
      membershipType: membership.membershipType,
      status: membership.status,
      startDate: membership.startDate.toISOString(),
      endDate: membership.endDate.toISOString(),
      daysActive: membership.daysActive,
      daysRemaining: membership.daysRemaining,
      price: Number(membership.price),
      currency: membership.currency,
      createdAt: membership.createdAt.toISOString(),
      userEmail: membership.user?.email
    }));

    return NextResponse.json({
      memberships: transformedMemberships,
      total: memberships.length
    });

  } catch (error) {
    console.error('Error fetching memberships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memberships' },
      { status: 500 }
    );
  }
}
