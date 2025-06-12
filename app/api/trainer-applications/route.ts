import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Trainer application received:', body);

    const {
      userId,
      name,
      email,
      phone,
      category,
      specialty,
      experience,
      price,
      description,
      qualifications,
      availability,
      photoUrl
    } = body;

    // Validate required fields
    if (!userId || !name || !email || !phone || !category || !specialty || !experience || !price || !description || !qualifications || !availability) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // For now, skip the existing application check due to Prisma issues
    // TODO: Re-enable this check once Prisma is properly configured
    /*
    const existingApplication = await prisma.trainerApplications.findFirst({
      where: {
        userId: userId,
        status: {
          in: ['pending', 'approved']
        }
      }
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You already have a pending or approved trainer application' },
        { status: 400 }
      );
    }
    */

    // Create trainer application using Prisma
    const application = await db.trainerApplications.create({
      data: {
        userId,
        name,
        email,
        phone,
        category,
        specialty,
        experience,
        price,
        description,
        qualifications,
        availability,
        photoUrl: photoUrl || null,
        status: 'pending'
      }
    });

    console.log('Trainer application created successfully:', {
      applicationId: application.id,
      userId: userId,
      name: name,
      category: category,
      specialty: specialty
    });

    // Create notifications for all admins
    try {
      // Get all admin users
      const adminUsers = await db.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true, email: true, name: true }
      });

      console.log(`Found ${adminUsers.length} admin users:`, adminUsers.map(u => u.email));

      // Create notification for each admin
      for (const admin of adminUsers) {
        const notification = await db.notifications.create({
          data: {
            userId: admin.email, // Use admin email as userId
            type: 'trainer_application',
            title: 'New Trainer Application',
            message: `${name} has submitted a new trainer application for ${specialty}.`,
            data: {
              applicationId: application.id,
              applicantName: name,
              applicantEmail: email,
              category: category,
              specialty: specialty,
              appliedAt: new Date().toISOString()
            },
            isAdmin: true,
            isRead: false
          }
        });

        // Emit real-time notification via WebSocket
        try {
          await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/socket`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'notification',
              userId: admin.email,
              data: notification
            })
          });
        } catch (wsError) {
          console.error('WebSocket notification failed:', wsError);
          // Continue execution even if WebSocket fails
        }
      }

      console.log(`Created notifications for ${adminUsers.length} admins`);
    } catch (notificationError) {
      console.error('Error creating admin notifications:', notificationError);
    }

    // Create notification for user
    try {
      await db.notifications.create({
        data: {
          userId: userId,
          type: 'trainer_application',
          title: 'Application Submitted',
          message: 'Your trainer application has been submitted successfully and is now under review by our admin team.',
          data: {
            applicationId: application.id,
            category: category,
            specialty: specialty,
            submittedAt: new Date().toISOString()
          },
          isAdmin: false,
          isRead: false
        }
      });
    } catch (notificationError) {
      console.error('Error creating user notification:', notificationError);
    }

    // Emit real-time notification for admin dashboard
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/socket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'trainer-application',
          data: {
            id: application.id,
            name: application.name,
            category: application.category,
            specialty: application.specialty
          }
        })
      });
      console.log('WebSocket notification sent for new trainer application');
    } catch (wsError) {
      console.error('WebSocket notification failed:', wsError);
      // Continue execution even if WebSocket fails
    }

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      message: 'Your trainer application has been submitted successfully and is now under review.'
    });

  } catch (error) {
    console.error('Error creating trainer application:', error);
    return NextResponse.json(
      { error: 'Failed to submit trainer application' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch applications (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const userId = searchParams.get('userId');

    // Fetch trainer applications using Prisma
    let whereClause: any = {};

    if (status !== 'all') {
      whereClause.status = status;
    }

    if (userId) {
      whereClause.userId = userId;
    }

    const applications = await db.trainerApplications.findMany({
      where: whereClause,
      orderBy: {
        appliedAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      applications: applications || [],
      count: applications?.length || 0
    });

  } catch (error) {
    console.error('Error fetching trainer applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trainer applications' },
      { status: 500 }
    );
  }
}
