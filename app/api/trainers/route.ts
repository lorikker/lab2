import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching trainers from trainers table...');

    // Get all active trainers from the trainers table
    const trainers = await db.trainers.findMany({
      where: {
        isActive: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Found ${trainers.length} active trainers`);

    // Transform the data to match the expected format
    const formattedTrainers = trainers.map(trainer => ({
      id: trainer.id,
      userId: trainer.userId,
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
      category: trainer.category,
      specialty: trainer.specialty,
      experience: trainer.experience,
      rating: trainer.rating,
      totalSessions: trainer.totalSessions,
      price: trainer.price,
      description: trainer.description,
      qualifications: trainer.qualifications,
      availability: trainer.availability,
      photoUrl: trainer.photoUrl,
      isActive: trainer.isActive,
      approvedAt: trainer.approvedAt,
      approvedBy: trainer.approvedBy,
      createdAt: trainer.createdAt,
      updatedAt: trainer.updatedAt,
      user: trainer.user
    }));

    return NextResponse.json({
      success: true,
      trainers: formattedTrainers,
      count: formattedTrainers.length
    });

  } catch (error) {
    console.error('Error fetching trainers:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch trainers',
        trainers: [],
        count: 0
      },
      { status: 500 }
    );
  }
}
