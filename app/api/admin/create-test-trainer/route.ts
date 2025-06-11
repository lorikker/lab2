import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Creating test trainer user...');

    // Create a test trainer user
    const trainerUser = await prisma.user.upsert({
      where: { email: 'trainer@sixstarfitness.com' },
      update: {
        role: 'TRAINER'
      },
      create: {
        id: 'trainer-test-user',
        name: 'Alex Johnson',
        email: 'trainer@sixstarfitness.com',
        role: 'TRAINER',
        password: '$2a$10$K7L1OJ45/4Y2nIvL0DXU/.N3Q3Z9DuYbqBC9A0CQC3F5XpEOmFrOn' // password123
      }
    });

    // Create trainer profile
    const trainer = await prisma.trainers.upsert({
      where: { userId: trainerUser.id },
      update: {},
      create: {
        userId: trainerUser.id,
        applicationId: 'app-trainer-1',
        name: 'Alex Johnson',
        email: 'trainer@sixstarfitness.com',
        phone: '+1234567890',
        category: 'Physical Training',
        specialty: 'Strength & Conditioning',
        experience: '5 years',
        price: '80',
        description: 'Experienced strength trainer specializing in muscle building and athletic performance.',
        photoUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        isActive: true
      }
    });

    // Create some bookings for this trainer
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const trainerBookings = [
      {
        userId: 'test-user-1',
        trainerId: parseInt(trainer.id),
        trainerName: trainer.name,
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
        trainerId: parseInt(trainer.id),
        trainerName: trainer.name,
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
        trainerId: parseInt(trainer.id),
        trainerName: trainer.name,
        sessionType: 'Strength Training',
        sessionDate: tomorrow,
        sessionTime: '10:30',
        sessionDuration: 60,
        totalPrice: 80.00,
        status: 'completed',
        notes: 'Completed full body workout session'
      }
    ];

    await prisma.trainerBookings.createMany({
      data: trainerBookings,
      skipDuplicates: true
    });

    return NextResponse.json({
      success: true,
      message: 'Test trainer created successfully!',
      data: {
        trainer: {
          id: trainer.id,
          name: trainer.name,
          email: trainer.email,
          userId: trainer.userId
        },
        user: {
          id: trainerUser.id,
          email: trainerUser.email,
          role: trainerUser.role
        },
        loginCredentials: {
          email: 'trainer@sixstarfitness.com',
          password: 'password123'
        }
      }
    });

  } catch (error) {
    console.error('Error creating test trainer:', error);
    return NextResponse.json(
      {
        error: 'Failed to create test trainer',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
