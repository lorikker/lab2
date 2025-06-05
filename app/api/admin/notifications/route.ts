import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get recent admin notifications
    const notifications = await prisma.notifications.findMany({
      where: {
        isAdmin: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    // Get notification counts by type
    const notificationCounts = await prisma.notifications.groupBy({
      by: ['type'],
      where: {
        isAdmin: true,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      _count: {
        id: true
      }
    });

    // Get recent activity (last 24 hours)
    const recentActivity = await prisma.notifications.findMany({
      where: {
        isAdmin: true,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    return NextResponse.json({
      success: true,
      notifications,
      notificationCounts,
      recentActivity,
      total: notifications.length
    });

  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch notifications',
        notifications: [],
        notificationCounts: [],
        recentActivity: [],
        total: 0
      },
      { status: 500 }
    );
  }
}
