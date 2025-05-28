import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get('specialty');
    const isActive = searchParams.get('active');

    let whereClause: any = {};

    if (specialty) {
      whereClause.specialty = specialty;
    }

    if (isActive !== null) {
      whereClause.isActive = isActive === 'true';
    } else {
      // By default, only show active trainers
      whereClause.isActive = true;
    }

    const trainers = await prisma.approvedTrainers.findMany({
      where: whereClause,
      orderBy: [
        { rating: 'desc' },
        { approvedAt: 'desc' }
      ]
    });

    // Transform data to match the expected format
    const formattedTrainers = trainers.map(trainer => ({
      id: trainer.id,
      name: trainer.name,
      category: trainer.category,
      specialty: trainer.specialty,
      experience: trainer.experience,
      rating: trainer.rating,
      price: trainer.price,
      image: trainer.photoUrl || `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face`,
      description: trainer.description,
      qualifications: trainer.qualifications,
      availability: trainer.availability,
      email: trainer.email,
      phone: trainer.phone,
      isActive: trainer.isActive,
      approvedAt: trainer.approvedAt
    }));

    return NextResponse.json({
      success: true,
      trainers: formattedTrainers,
      count: formattedTrainers.length
    });

  } catch (error) {
    console.error('Error fetching approved trainers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch approved trainers' },
      { status: 500 }
    );
  }
}
