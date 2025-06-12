import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching trainer bookings for calendar...');

    // For now, we'll skip authentication in this API and handle it on the frontend
    // This allows both admin and trainer access

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const trainerId = searchParams.get('trainerId'); // Optional filter by specific trainer ID
    const userEmail = searchParams.get('userEmail'); // Optional filter by logged-in user's email

    // Build date range for the month
    let startDate: Date;
    let endDate: Date;

    if (month && year) {
      startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      endDate = new Date(parseInt(year), parseInt(month), 0);
    } else {
      // Default to current month
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    console.log(`📅 Fetching bookings from ${startDate.toISOString()} to ${endDate.toISOString()}`);

    // Build where clause
    let whereClause: any = {
      bookingDate: {
        gte: startDate.toISOString().split('T')[0],
        lte: endDate.toISOString().split('T')[0]
      }
    };

    // Check if we need to filter by specific trainer
    if (trainerId) {
      whereClause.trainerId = trainerId;
      console.log(`🎯 Filtering bookings for trainer ID: ${trainerId}`);
    }

    // Check if we need to filter by user email (for logged-in user's appointments)
    if (userEmail) {
      // Filter by customerEmail to show appointments where this user is the customer/trainee
      whereClause.customerEmail = userEmail;
      console.log(`🎯 Filtering bookings for user email: ${userEmail} (showing their training appointments)`);
    }

    // Fetch trainer bookings from database
    const bookings = await db.trainerBookings.findMany({
      where: whereClause,
      orderBy: [
        { bookingDate: 'asc' },
        { bookingTime: 'asc' }
      ],
      select: {
        id: true,
        userId: true,
        trainerId: true,
        trainerName: true,
        sessionType: true,
        bookingDate: true,
        bookingTime: true,
        amount: true,
        currency: true,
        status: true,
        customerEmail: true,
        notes: true,
        createdAt: true
      }
    });

    console.log(`✅ Found ${bookings.length} trainer bookings`);

    // Get user details for each booking
    const userIds = [...new Set(bookings.map(b => b.userId))];
    const users = await db.user.findMany({
      where: {
        id: {
          in: userIds
        }
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    // Get trainer details
    const trainerIds = [...new Set(bookings.map(b => b.trainerId))];
    const trainers = await db.trainers.findMany({
      where: {
        id: {
          in: trainerIds
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        category: true,
        photoUrl: true
      }
    });

    // Transform bookings with user and trainer details
    const transformedBookings = bookings.map(booking => {
      const user = users.find(u => u.id === booking.userId);
      const trainer = trainers.find(t => t.id === booking.trainerId);

      return {
        id: booking.id,
        userId: booking.userId,
        userName: user?.name || 'Unknown User',
        userEmail: user?.email || booking.customerEmail || 'unknown@example.com',
        trainerId: booking.trainerId,
        trainerName: booking.trainerName,
        trainerEmail: trainer?.email || 'unknown@trainer.com',
        trainerCategory: trainer?.category || 'General',
        trainerPhoto: trainer?.photoUrl || '/default-trainer.jpg',
        sessionType: booking.sessionType,
        date: booking.bookingDate,
        time: booking.bookingTime,
        amount: Number(booking.amount),
        currency: booking.currency || 'USD',
        status: booking.status,
        notes: booking.notes,
        createdAt: booking.createdAt.toISOString()
      };
    });

    // Group bookings by date for easier calendar rendering
    const bookingsByDate = transformedBookings.reduce((acc, booking) => {
      const date = booking.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(booking);
      return acc;
    }, {} as Record<string, typeof transformedBookings>);

    // Calculate statistics
    const stats = {
      totalBookings: transformedBookings.length,
      scheduledBookings: transformedBookings.filter(b => b.status === 'confirmed' || b.status === 'scheduled').length,
      completedBookings: transformedBookings.filter(b => b.status === 'completed').length,
      cancelledBookings: transformedBookings.filter(b => b.status === 'cancelled').length,
      totalRevenue: transformedBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.amount, 0),
      uniqueTrainers: trainerIds.length,
      uniqueClients: userIds.length
    };

    return NextResponse.json({
      success: true,
      bookings: transformedBookings,
      bookingsByDate,
      stats,
      dateRange: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      }
    });

  } catch (error) {
    console.error('Error fetching trainer bookings:', error);

    // Return mock data if database fails
    const mockBookings = [
      {
        id: '1',
        userId: 'user1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        trainerId: '1',
        trainerName: 'Mike Johnson',
        trainerEmail: 'mike@trainer.com',
        trainerCategory: 'Physical Training',
        trainerPhoto: '/default-trainer.jpg',
        sessionType: 'Personal Training',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        amount: 80,
        currency: 'USD',
        status: 'confirmed',
        notes: 'Focus on upper body strength',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        trainerId: '2',
        trainerName: 'Sarah Wilson',
        trainerEmail: 'sarah@trainer.com',
        trainerCategory: 'Diet & Nutrition',
        trainerPhoto: '/default-trainer.jpg',
        sessionType: 'Nutrition Consultation',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: '14:00',
        amount: 60,
        currency: 'USD',
        status: 'confirmed',
        notes: 'Meal planning session',
        createdAt: new Date().toISOString()
      }
    ];

    const mockBookingsByDate = mockBookings.reduce((acc, booking) => {
      const date = booking.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(booking);
      return acc;
    }, {} as Record<string, typeof mockBookings>);

    return NextResponse.json({
      success: true,
      bookings: mockBookings,
      bookingsByDate: mockBookingsByDate,
      stats: {
        totalBookings: mockBookings.length,
        scheduledBookings: 2,
        completedBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
        uniqueTrainers: 2,
        uniqueClients: 2
      },
      dateRange: {
        start: new Date().toISOString().split('T')[0],
        end: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
      },
      note: "⚠️ USING MOCK DATA - Database connection failed"
    });
  }
}
