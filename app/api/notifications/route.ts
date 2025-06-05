import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

// GET - Fetch notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const isAdmin = searchParams.get('isAdmin') === 'true';
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    // Fetch notifications using Prisma
    let whereClause: any = {};

    if (isAdmin) {
      whereClause.isAdmin = true;
    } else if (userId) {
      whereClause.userId = userId;
      whereClause.isAdmin = false;
    }

    if (unreadOnly) {
      whereClause.isRead = false;
    }

    const notifications = await db.notifications.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to 50 notifications
    });

    return NextResponse.json({
      success: true,
      notifications: notifications || [],
      count: notifications?.length || 0
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST - Create notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Creating notification:', body);

    const {
      userId,
      type,
      title,
      message,
      data,
      isAdmin = false
    } = body;

    // Validate required fields
    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: 'userId, type, title, and message are required' },
        { status: 400 }
      );
    }

    // Create notification using Prisma
    const notification = await db.notifications.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data || null,
        isAdmin,
        isRead: false
      }
    });

    console.log('Notification created:', {
      notificationId: notification.id,
      userId: userId,
      type: type,
      isAdmin: isAdmin
    });

    return NextResponse.json({
      success: true,
      notificationId: notification.id,
      message: 'Notification created successfully'
    });

  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

// PATCH - Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationIds, userId, markAllAsRead = false } = body;

    if (markAllAsRead && userId) {
      // Mark all notifications as read for a user using Prisma
      await db.notifications.updateMany({
        where: {
          userId: userId,
          isRead: false
        },
        data: {
          isRead: true
        }
      });
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read using Prisma
      await db.notifications.updateMany({
        where: {
          id: {
            in: notificationIds
          }
        },
        data: {
          isRead: true
        }
      });
    } else {
      return NextResponse.json(
        { error: 'Either notificationIds array or markAllAsRead with userId is required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications marked as read'
    });

  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}
