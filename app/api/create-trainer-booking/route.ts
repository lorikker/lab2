import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Creating trainer booking:', body);

    const {
      userId,
      trainerId,
      trainerName,
      sessionType,
      sessionDate,
      sessionTime,
      sessionDuration,
      totalPrice,
      customerEmail,
      customerName,
      paymentIntentId,
      invoiceNumber,
      orderNumber,
      status = 'scheduled'
    } = body;

    // Validate required fields
    if (!trainerId || !trainerName || !sessionDate || !sessionTime) {
      return NextResponse.json(
        { error: 'Missing required booking information' },
        { status: 400 }
      );
    }

    // Create the booking
    const booking = await prisma.trainerBookings.create({
      data: {
        userId: userId || 'guest-user',
        trainerId: parseInt(trainerId),
        trainerName: trainerName,
        sessionType: sessionType || 'single',
        sessionDate: new Date(sessionDate),
        sessionTime: sessionTime,
        sessionDuration: sessionDuration || 60,
        totalPrice: parseFloat(totalPrice) || 0,
        customerEmail: customerEmail || '',
        paymentIntentId: paymentIntentId || '',
        invoiceNumber: invoiceNumber || '',
        orderNumber: orderNumber || '',
        status: status,
        notes: `Booking for ${customerName || 'Customer'} - ${sessionType === 'package' ? 'Package Deal' : 'Single Session'}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('Trainer booking created successfully:', booking.id);

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        trainerId: booking.trainerId,
        trainerName: booking.trainerName,
        sessionDate: booking.sessionDate,
        sessionTime: booking.sessionTime,
        sessionType: booking.sessionType,
        totalPrice: booking.totalPrice,
        status: booking.status,
        invoiceNumber: booking.invoiceNumber,
        orderNumber: booking.orderNumber
      }
    });

  } catch (error) {
    console.error('Error creating trainer booking:', error);
    
    // Check if it's a database connection issue
    if (error instanceof Error && error.message.includes('connect')) {
      return NextResponse.json(
        { 
          error: 'Database connection failed. Using demo mode.',
          demo: true,
          booking: {
            id: `demo-${Date.now()}`,
            trainerId: parseInt(request.url.split('trainerId=')[1]) || 1,
            trainerName: 'Demo Trainer',
            sessionDate: new Date(),
            sessionTime: '10:00',
            sessionType: 'single',
            totalPrice: 80,
            status: 'scheduled',
            invoiceNumber: `DEMO-${Date.now()}`,
            orderNumber: `DEMO-ORD-${Date.now()}`
          }
        },
        { status: 200 } // Return 200 for demo mode
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to create trainer booking',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
