import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');
    const userRole = searchParams.get('userRole');
    const trainerId = searchParams.get('trainerId'); // For filtering specific trainer

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    // Get user info
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true, role: true, name: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let whereClause: any = {};

    // If user is a trainer, only show their sessions
    if (user.role === 'TRAINER') {
      // Get trainer info
      const trainer = await prisma.trainers.findUnique({
        where: { userId: user.id },
        select: { id: true, name: true }
      });

      if (!trainer) {
        return NextResponse.json(
          { error: 'Trainer profile not found' },
          { status: 404 }
        );
      }

      whereClause.trainerId = parseInt(trainer.id);
    } else if (user.role === 'ADMIN') {
      // Admin can see all sessions, optionally filtered by trainer
      if (trainerId) {
        whereClause.trainerId = parseInt(trainerId);
      }
    } else {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get trainer bookings/sessions
    const sessions = await prisma.trainerBookings.findMany({
      where: whereClause,
      orderBy: [
        { sessionDate: 'asc' },
        { sessionTime: 'asc' }
      ],
      include: {
        // Get user info for the client
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Transform data for frontend
    const transformedSessions = sessions.map(session => ({
      id: session.id,
      userId: session.userId,
      userName: session.user?.name || 'Unknown User',
      userEmail: session.user?.email || '',
      trainerId: session.trainerId,
      trainerName: session.trainerName,
      date: session.sessionDate.toISOString().split('T')[0], // YYYY-MM-DD format
      time: session.sessionTime,
      duration: `${session.sessionDuration || 60} min`,
      type: session.sessionType || 'Personal Training',
      status: session.status || 'scheduled',
      price: session.totalPrice ? `$${session.totalPrice}` : '$80',
      notes: session.notes || '',
      createdAt: session.createdAt.toISOString()
    }));

    // Calculate stats
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = transformedSessions.filter(s => s.date === today).length;
    const upcomingSessions = transformedSessions.filter(s => 
      s.status === 'scheduled' && s.date >= today
    ).length;
    const completedSessions = transformedSessions.filter(s => 
      s.status === 'completed'
    ).length;

    const stats = {
      totalSessions: transformedSessions.length,
      todaySessions,
      upcomingSessions,
      completedSessions
    };

    return NextResponse.json({
      success: true,
      sessions: transformedSessions,
      stats,
      userRole: user.role,
      userName: user.name
    });

  } catch (error) {
    console.error('Error fetching trainer sessions:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch trainer sessions',
        sessions: [],
        stats: {
          totalSessions: 0,
          todaySessions: 0,
          upcomingSessions: 0,
          completedSessions: 0
        }
      },
      { status: 500 }
    );
  }
}
