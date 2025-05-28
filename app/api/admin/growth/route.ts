import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

export async function GET(request: NextRequest) {
  try {
    // Get current date and 30 days ago
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

    // Get current month counts
    const currentUsers = await db.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    const currentTrainers = await db.trainers.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    const currentMemberships = await db.memberships.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    // Get previous month counts for comparison
    const previousUsers = await db.user.count({
      where: {
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo
        }
      }
    });

    const previousTrainers = await db.trainers.count({
      where: {
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo
        }
      }
    });

    const previousMemberships = await db.memberships.count({
      where: {
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo
        }
      }
    });

    // Calculate growth percentages
    const calculateGrowth = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100 * 10) / 10;
    };

    const userGrowth = calculateGrowth(currentUsers, previousUsers);
    const trainerGrowth = calculateGrowth(currentTrainers, previousTrainers);
    const membershipGrowth = calculateGrowth(currentMemberships, previousMemberships);

    // Calculate revenue growth
    const currentRevenue = await db.memberships.aggregate({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      _sum: {
        price: true
      }
    });

    const previousRevenue = await db.memberships.aggregate({
      where: {
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo
        }
      },
      _sum: {
        price: true
      }
    });

    const revenueGrowth = calculateGrowth(
      Number(currentRevenue._sum.price) || 0,
      Number(previousRevenue._sum.price) || 0
    );

    return NextResponse.json({
      userGrowth,
      trainerGrowth,
      membershipGrowth,
      revenueGrowth,
      currentPeriod: {
        users: currentUsers,
        trainers: currentTrainers,
        memberships: currentMemberships,
        revenue: Number(currentRevenue._sum.price) || 0
      },
      previousPeriod: {
        users: previousUsers,
        trainers: previousTrainers,
        memberships: previousMemberships,
        revenue: Number(previousRevenue._sum.price) || 0
      }
    });

  } catch (error) {
    console.error('Error fetching growth data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch growth data' },
      { status: 500 }
    );
  }
}
