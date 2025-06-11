import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Creating test trainer bookings...');

    // Get today's date and create some test bookings
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    // Create test bookings
    const testBookings = [
      {
        userId: 'test-user-1',
        trainerId: 1,
        trainerName: 'Alex Johnson',
        sessionType: 'Personal Training',
        sessionDate: today,
        sessionTime: '09:00',
        sessionDuration: 60,
        totalPrice: 80.00,
        status: 'scheduled',
        notes: 'Focus on upper body strength training'
      },
      {
        userId: 'test-user-2',
        trainerId: 1,
        trainerName: 'Alex Johnson',
        sessionType: 'HIIT Training',
        sessionDate: today,
        sessionTime: '14:00',
        sessionDuration: 45,
        totalPrice: 70.00,
        status: 'scheduled',
        notes: 'High intensity interval training session'
      },
      {
        userId: 'test-user-3',
        trainerId: 2,
        trainerName: 'Sarah Williams',
        sessionType: 'Nutrition Consultation',
        sessionDate: tomorrow,
        sessionTime: '10:30',
        sessionDuration: 90,
        totalPrice: 90.00,
        status: 'scheduled',
        notes: 'Weight loss nutrition plan discussion'
      },
      {
        userId: 'test-user-4',
        trainerId: 1,
        trainerName: 'Alex Johnson',
        sessionType: 'Strength Training',
        sessionDate: tomorrow,
        sessionTime: '16:00',
        sessionDuration: 60,
        totalPrice: 80.00,
        status: 'completed',
        notes: 'Completed full body workout'
      },
      {
        userId: 'test-user-5',
        trainerId: 3,
        trainerName: 'Mike Chen',
        sessionType: 'Online Training',
        sessionDate: dayAfter,
        sessionTime: '11:00',
        sessionDuration: 45,
        totalPrice: 60.00,
        status: 'scheduled',
        notes: 'Virtual cardio session'
      },
      {
        userId: 'test-user-6',
        trainerId: 2,
        trainerName: 'Sarah Williams',
        sessionType: 'Diet Planning',
        sessionDate: dayAfter,
        sessionTime: '15:30',
        sessionDuration: 60,
        totalPrice: 75.00,
        status: 'cancelled',
        notes: 'Client cancelled due to schedule conflict'
      }
    ];

    // Create the bookings
    const createdBookings = await prisma.trainerBookings.createMany({
      data: testBookings,
      skipDuplicates: true
    });

    // Also create some test users if they don't exist
    const testUsers = [
      {
        id: 'test-user-1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'USER'
      },
      {
        id: 'test-user-2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'USER'
      },
      {
        id: 'test-user-3',
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        role: 'USER'
      },
      {
        id: 'test-user-4',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        role: 'USER'
      },
      {
        id: 'test-user-5',
        name: 'Chris Wilson',
        email: 'chris.wilson@example.com',
        role: 'USER'
      },
      {
        id: 'test-user-6',
        name: 'Lisa Brown',
        email: 'lisa.brown@example.com',
        role: 'USER'
      }
    ];

    // Create test users
    for (const user of testUsers) {
      try {
        await prisma.user.upsert({
          where: { id: user.id },
          update: {},
          create: user
        });
      } catch (e) {
        // User might already exist, continue
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Test trainer bookings created successfully!',
      data: {
        bookingsCreated: createdBookings.count,
        totalBookings: testBookings.length
      }
    });

  } catch (error) {
    console.error('Error creating test bookings:', error);
    return NextResponse.json(
      {
        error: 'Failed to create test bookings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
