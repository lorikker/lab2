import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Creating test notifications...');

    // Create test notifications
    const testNotifications = [
      {
        userId: 'admin-user',
        type: 'trainer_application',
        title: 'New Trainer Application',
        message: 'John Doe has applied to become a Physical Training specialist',
        isAdmin: true,
        isRead: false,
        data: JSON.stringify({
          applicantName: 'John Doe',
          applicantEmail: 'john.doe@example.com',
          category: 'Physical Training',
          specialty: 'Strength Training'
        })
      },
      {
        userId: 'admin-user',
        type: 'trainer_application',
        title: 'New Trainer Application',
        message: 'Sarah Smith has applied to become a Diet & Nutrition specialist',
        isAdmin: true,
        isRead: false,
        data: JSON.stringify({
          applicantName: 'Sarah Smith',
          applicantEmail: 'sarah.smith@example.com',
          category: 'Diet & Nutrition',
          specialty: 'Weight Loss'
        })
      },
      {
        userId: 'admin-user',
        type: 'booking_confirmed',
        title: 'New Booking Confirmed',
        message: 'Jane Wilson booked a session with Alex Johnson for tomorrow at 10:00 AM',
        isAdmin: true,
        isRead: false,
        data: JSON.stringify({
          clientName: 'Jane Wilson',
          trainerName: 'Alex Johnson',
          sessionDate: '2024-01-21',
          sessionTime: '10:00',
          sessionType: 'Personal Training'
        })
      },
      {
        userId: 'admin-user',
        type: 'trainer_approved',
        title: 'Trainer Approved',
        message: 'Mike Chen has been approved as an Online Training specialist',
        isAdmin: true,
        isRead: true,
        data: JSON.stringify({
          trainerName: 'Mike Chen',
          trainerEmail: 'mike.chen@example.com',
          category: 'Online Training',
          approvedAt: new Date().toISOString()
        })
      },
      {
        userId: 'admin-user',
        type: 'membership_purchased',
        title: 'New Membership Purchase',
        message: 'Emily Davis purchased a Premium membership plan',
        isAdmin: true,
        isRead: false,
        data: JSON.stringify({
          customerName: 'Emily Davis',
          membershipType: 'Premium',
          amount: 99.99,
          duration: '3 months'
        })
      },
      {
        userId: 'admin-user',
        type: 'system_alert',
        title: 'System Update',
        message: 'Trainer booking system has been updated with new features',
        isAdmin: true,
        isRead: true,
        data: JSON.stringify({
          updateType: 'feature_release',
          version: '2.1.0',
          features: ['Dynamic calendar', 'Real-time updates', 'Enhanced notifications']
        })
      }
    ];

    // Create the notifications
    const createdNotifications = await prisma.notifications.createMany({
      data: testNotifications,
      skipDuplicates: true
    });

    console.log(`✅ Created ${createdNotifications.count} test notifications`);

    return NextResponse.json({
      success: true,
      message: 'Test notifications created successfully!',
      data: {
        notificationsCreated: createdNotifications.count,
        totalNotifications: testNotifications.length
      }
    });

  } catch (error) {
    console.error('Error creating test notifications:', error);
    return NextResponse.json(
      {
        error: 'Failed to create test notifications',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
