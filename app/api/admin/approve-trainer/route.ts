import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Trainer approval request received:', body);

    const {
      applicationId,
      action, // 'approve' or 'reject'
      adminId,
      adminNotes
    } = body;

    console.log('Extracted fields:', {
      applicationId,
      action,
      adminId,
      adminNotes
    });

    // Validate required fields
    if (!applicationId || !action || !adminId) {
      console.log('Validation failed - missing required fields:', {
        hasApplicationId: !!applicationId,
        hasAction: !!action,
        hasAdminId: !!adminId
      });
      return NextResponse.json(
        { error: 'Application ID, action, and admin ID are required' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "approve" or "reject"' },
        { status: 400 }
      );
    }

    // Get the application
    const application = await db.trainerApplications.findUnique({
      where: { id: applicationId }
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    if (application.status !== 'pending') {
      return NextResponse.json(
        { error: 'Application has already been reviewed' },
        { status: 400 }
      );
    }

    // Update application status
    const updatedApplication = await db.trainerApplications.update({
      where: { id: applicationId },
      data: {
        status: action === 'approve' ? 'approved' : 'rejected',
        reviewedAt: new Date(),
        reviewedBy: adminId,
        adminNotes: adminNotes || null
      }
    });

    // Find the user - handle case where userId might be an email
    let user;
    if (application.userId.includes('@')) {
      // If userId looks like an email, find user by email
      user = await db.user.findUnique({
        where: { email: application.userId }
      });
    } else {
      // If userId is a proper UUID, find by ID
      user = await db.user.findUnique({
        where: { id: application.userId }
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found for this application' },
        { status: 404 }
      );
    }

    let approvedTrainer = null;

    // If approved, create approved trainer record
    if (action === 'approve') {
      console.log('Approving trainer application for user:', {
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        currentRole: user.role
      });

      // Check if trainer already exists
      const existingTrainer = await db.trainers.findFirst({
        where: {
          OR: [
            { userId: user.id },
            { email: application.email }
          ]
        }
      });

      if (existingTrainer) {
        console.log('Trainer already exists:', existingTrainer);
        return NextResponse.json(
          { error: 'A trainer with this user ID or email already exists' },
          { status: 400 }
        );
      }

      // Update user role to TRAINER
      await db.user.update({
        where: { id: user.id },
        data: { role: 'TRAINER' }
      });

      console.log('Creating trainer record...');
      // Create trainer record in trainers table
      const trainer = await db.trainers.create({
        data: {
          userId: user.id, // Use the actual user ID
          applicationId: application.id,
          name: application.name,
          email: application.email,
          phone: application.phone,
          category: application.category,
          specialty: application.specialty,
          experience: application.experience,
          price: application.price,
          description: application.description,
          qualifications: application.qualifications,
          availability: application.availability,
          photoUrl: application.photoUrl,
          approvedBy: adminId
        }
      });
      console.log('Trainer record created:', trainer.id);

      // Check if approved trainer already exists
      const existingApprovedTrainer = await db.approvedTrainers.findFirst({
        where: {
          OR: [
            { userId: user.id },
            { email: application.email }
          ]
        }
      });

      if (!existingApprovedTrainer) {
        console.log('Creating approved trainer record...');
        // Also create approved trainer record for backward compatibility
        approvedTrainer = await db.approvedTrainers.create({
          data: {
            userId: user.id, // Use the actual user ID
            applicationId: application.id,
            name: application.name,
            email: application.email,
            phone: application.phone,
            category: application.category,
            specialty: application.specialty,
            experience: application.experience,
            price: application.price,
            description: application.description,
            qualifications: application.qualifications,
            availability: application.availability,
            photoUrl: application.photoUrl,
            rating: 5.0, // Default rating
            isActive: true,
            approvedBy: adminId
          }
        });
        console.log('Approved trainer record created:', approvedTrainer.id);
      } else {
        console.log('Approved trainer already exists, using existing record');
        approvedTrainer = existingApprovedTrainer;
      }

      console.log('Trainer approved and added to approved trainers:', {
        trainerId: approvedTrainer.id,
        name: application.name,
        specialty: application.specialty
      });

      // Create notification for approved trainer
      await db.notifications.create({
        data: {
          userId: user.id, // Use the actual user ID
          type: 'trainer_approved',
          title: 'Trainer Application Approved!',
          message: `Congratulations! Your trainer application has been approved. You are now a certified trainer at SixStar Fitness.`,
          data: {
            applicationId: applicationId,
            trainerId: approvedTrainer.id,
            trainerName: application.name,
            specialty: application.specialty,
            approvedBy: adminId,
            approvedAt: new Date().toISOString()
          },
          isAdmin: false
        }
      });
    } else {
      // Create notification for rejected trainer
      await db.notifications.create({
        data: {
          userId: user.id, // Use the actual user ID
          type: 'trainer_rejected',
          title: 'Trainer Application Update',
          message: `Your trainer application has been reviewed. Unfortunately, we cannot approve your application at this time. ${adminNotes ? `Admin notes: ${adminNotes}` : ''}`,
          data: {
            applicationId: applicationId,
            trainerName: application.name,
            specialty: application.specialty,
            rejectedBy: adminId,
            rejectedAt: new Date().toISOString(),
            adminNotes: adminNotes || null
          },
          isAdmin: false
        }
      });
    }

    // Create notification for admin
    await db.notifications.create({
      data: {
        userId: adminId,
        type: action === 'approve' ? 'trainer_approved' : 'trainer_rejected',
        title: `Trainer Application ${action === 'approve' ? 'Approved' : 'Rejected'}`,
        message: `You have ${action}d the trainer application for ${application.name}.`,
        data: {
          applicationId: applicationId,
          trainerId: approvedTrainer?.id || null,
          trainerName: application.name,
          specialty: application.specialty,
          actionBy: adminId,
          actionAt: new Date().toISOString()
        },
        isAdmin: true
      }
    });

    return NextResponse.json({
      success: true,
      action: action,
      applicationId: applicationId,
      trainerId: approvedTrainer?.id || null,
      message: action === 'approve'
        ? 'Trainer application approved successfully'
        : 'Trainer application rejected'
    });

  } catch (error) {
    console.error('Error processing trainer approval:', error);
    return NextResponse.json(
      { error: 'Failed to process trainer approval' },
      { status: 500 }
    );
  }
}
