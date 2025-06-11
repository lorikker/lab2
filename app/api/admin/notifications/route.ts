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

    // Return demo notifications if database fails
    const demoNotifications = [
      {
        id: "demo-1",
        type: "trainer_application",
        title: "New Trainer Application",
        message: "John Doe has applied to become a Physical Training specialist",
        createdAt: new Date().toISOString(),
        isAdmin: true,
        isRead: false,
        data: JSON.stringify({
          applicantName: "John Doe",
          applicantEmail: "john.doe@example.com",
          category: "Physical Training"
        })
      },
      {
        id: "demo-2",
        type: "trainer_approved",
        title: "Trainer Approved",
        message: "Sarah Smith has been approved as a Diet & Nutrition specialist",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        isAdmin: true,
        isRead: false,
        data: JSON.stringify({
          trainerName: "Sarah Smith",
          category: "Diet & Nutrition"
        })
      },
      {
        id: "demo-3",
        type: "booking_confirmed",
        title: "New Booking Confirmed",
        message: "Jane Wilson booked a session with Alex Johnson",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        isAdmin: true,
        isRead: true,
        data: JSON.stringify({
          clientName: "Jane Wilson",
          trainerName: "Alex Johnson"
        })
      },
      {
        id: "demo-4",
        type: "membership_purchased",
        title: "New Membership Purchase",
        message: "Emily Davis purchased a Premium membership plan",
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        isAdmin: true,
        isRead: false,
        data: JSON.stringify({
          customerName: "Emily Davis",
          membershipType: "Premium"
        })
      }
    ];

    return NextResponse.json({
      success: false,
      notifications: demoNotifications,
      notificationCounts: [
        { type: 'trainer_application', _count: { id: 1 } },
        { type: 'trainer_approved', _count: { id: 1 } },
        { type: 'booking_confirmed', _count: { id: 1 } },
        { type: 'membership_purchased', _count: { id: 1 } }
      ],
      recentActivity: demoNotifications.slice(0, 3),
      total: demoNotifications.length,
      error: 'Using demo data - database connection failed'
    });
  }
}
