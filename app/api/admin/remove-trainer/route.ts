import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Trainer removal request:', body);

    const {
      trainerId,
      adminId,
      reason
    } = body;

    // Validate required fields
    if (!trainerId || !adminId) {
      return NextResponse.json(
        { error: 'Trainer ID and admin ID are required' },
        { status: 400 }
      );
    }

    // Get the trainer details before removal
    const trainer = await prisma.approvedTrainers.findUnique({
      where: { id: parseInt(trainerId) }
    });

    if (!trainer) {
      return NextResponse.json(
        { error: 'Trainer not found' },
        { status: 404 }
      );
    }

    // Find the user - handle case where userId might be an email
    let user;
    if (trainer.userId.includes('@')) {
      user = await prisma.user.findUnique({
        where: { email: trainer.userId }
      });
    } else {
      user = await prisma.user.findUnique({
        where: { id: trainer.userId }
      });
    }

    if (user) {
      // Change user role back to USER
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'USER' }
      });
    }

    // Remove trainer from trainers table
    await prisma.trainers.deleteMany({
      where: { userId: user?.id || trainer.userId }
    });

    // Remove trainer from approved trainers
    await prisma.approvedTrainers.delete({
      where: { id: parseInt(trainerId) }
    });

    // Create notification for the removed trainer
    if (user) {
      await prisma.notifications.create({
        data: {
          userId: user.id, // Use the actual user ID
          type: 'trainer_removed',
          title: 'Trainer Status Removed',
          message: `Your trainer status has been removed from SixStar Fitness and you have been converted back to a regular user. ${reason ? `Reason: ${reason}` : ''}`,
          data: {
            trainerId: trainerId,
            trainerName: trainer.name,
            removedBy: adminId,
            reason: reason || null,
            removedAt: new Date().toISOString()
          },
          isAdmin: false
        }
      });
    }

    // Create notification for admin
    await prisma.notifications.create({
      data: {
        userId: adminId,
        type: 'trainer_removed',
        title: 'Trainer Removed',
        message: `Trainer ${trainer.name} has been successfully removed from the platform.`,
        data: {
          trainerId: trainerId,
          trainerName: trainer.name,
          removedBy: adminId,
          reason: reason || null,
          removedAt: new Date().toISOString()
        },
        isAdmin: true
      }
    });

    console.log('Trainer removed successfully:', {
      trainerId: trainerId,
      trainerName: trainer.name,
      removedBy: adminId
    });

    return NextResponse.json({
      success: true,
      trainerId: trainerId,
      trainerName: trainer.name,
      message: 'Trainer removed successfully'
    });

  } catch (error) {
    console.error('Error removing trainer:', error);
    return NextResponse.json(
      { error: 'Failed to remove trainer' },
      { status: 500 }
    );
  }
}
