import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Update session status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const body = await request.json();
    const { status, notes, userEmail } = body;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    // Verify user has permission
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true, role: true }
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'TRAINER')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // If user is trainer, verify they own this session
    if (user.role === 'TRAINER') {
      const trainer = await prisma.trainers.findUnique({
        where: { userId: user.id },
        select: { id: true }
      });

      if (!trainer) {
        return NextResponse.json(
          { error: 'Trainer profile not found' },
          { status: 404 }
        );
      }

      const session = await prisma.trainerBookings.findUnique({
        where: { id: sessionId },
        select: { trainerId: true }
      });

      if (!session || session.trainerId !== parseInt(trainer.id)) {
        return NextResponse.json(
          { error: 'Session not found or unauthorized' },
          { status: 404 }
        );
      }
    }

    // Update session
    const updatedSession = await prisma.trainerBookings.update({
      where: { id: sessionId },
      data: {
        status: status || undefined,
        notes: notes || undefined,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      session: {
        id: updatedSession.id,
        userId: updatedSession.userId,
        userName: updatedSession.user?.name || 'Unknown User',
        userEmail: updatedSession.user?.email || '',
        trainerId: updatedSession.trainerId,
        trainerName: updatedSession.trainerName,
        date: updatedSession.sessionDate.toISOString().split('T')[0],
        time: updatedSession.sessionTime,
        duration: `${updatedSession.sessionDuration || 60} min`,
        type: updatedSession.sessionType || 'Personal Training',
        status: updatedSession.status || 'scheduled',
        price: updatedSession.totalPrice ? `$${updatedSession.totalPrice}` : '$80',
        notes: updatedSession.notes || '',
        createdAt: updatedSession.createdAt.toISOString()
      }
    });

  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

// Delete session
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    // Verify user has permission (only admin can delete)
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true, role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Delete session
    await prisma.trainerBookings.delete({
      where: { id: sessionId }
    });

    return NextResponse.json({
      success: true,
      message: 'Session deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}
