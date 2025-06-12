
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { applicationId, action, adminId, adminNotes } = body;

    if (!applicationId || !adminId) {
      return NextResponse.json(
        { error: "Application ID and Admin ID are required" },
        { status: 400 }
      );
    }

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Valid action (approve or reject) is required" },
        { status: 400 }
      );
    }

    // Fetch the application details
    const application = await db.trainerApplications.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Trainer application not found" },
        { status: 404 }
      );
    }

    if (action === "approve") {
      // Populate the trainers table
      const newTrainer = await db.trainers.create({
        data: {
          userId: application.userId,
          applicationId: application.id,
          name: application.name,
          email: application.email,
          phone: application.phone,
          category: application.category,
          specialty: application.specialty ?? "N/A",
          experience: application.experience,
          rating: 5.0,
          totalSessions: 0,
          price: application.price,
          description: application.description,
          qualifications: application.qualifications,
          availability: application.availability,
          photoUrl: application.photoUrl,
          isActive: true,
          approvedAt: new Date(),
          approvedBy: adminId,
        },
      });

      console.log("New trainer added:", newTrainer);

      // Update user role to TRAINER
      try {
        await db.user.update({
          where: { id: application.userId },
          data: { role: "TRAINER" },
        });
        console.log(`Updated user ${application.userId} role to TRAINER`);
      } catch (userUpdateError) {
        console.error("Error updating user role:", userUpdateError);
        // Continue with the process even if user role update fails
      }

      // Update the application status to approved
      await db.trainerApplications.update({
        where: { id: applicationId },
        data: {
          status: "approved",
          reviewedAt: new Date(),
          reviewedBy: adminId,
          adminNotes: adminNotes || null,
        },
      });

      // Create notification for the user
      try {
        await db.notifications.create({
          data: {
            userId: application.userId,
            type: "trainer_approved",
            title: "Trainer Application Approved",
            message: "Congratulations! Your trainer application has been approved.",
            data: {
              applicationId: application.id,
              approvedAt: new Date().toISOString(),
              approvedBy: adminId,
            },
            isAdmin: false,
            isRead: false,
          },
        });
      } catch (notificationError) {
        console.error("Error creating notification:", notificationError);
      }

      return NextResponse.json({
        success: true,
        message: "Trainer approved successfully",
        trainer: newTrainer,
      });
    } else if (action === "reject") {
      // Update the application status to rejected
      await db.trainerApplications.update({
        where: { id: applicationId },
        data: {
          status: "rejected",
          reviewedAt: new Date(),
          reviewedBy: adminId,
          adminNotes: adminNotes || null,
        },
      });

      // Create notification for the user
      try {
        await db.notifications.create({
          data: {
            userId: application.userId,
            type: "trainer_rejected",
            title: "Trainer Application Rejected",
            message: "Your trainer application has been reviewed and was not approved at this time.",
            data: {
              applicationId: application.id,
              rejectedAt: new Date().toISOString(),
              rejectedBy: adminId,
              notes: adminNotes || "No additional information provided.",
            },
            isAdmin: false,
            isRead: false,
          },
        });
      } catch (notificationError) {
        console.error("Error creating notification:", notificationError);
      }

      return NextResponse.json({
        success: true,
        message: "Trainer application rejected",
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error processing trainer application:", error);
    return NextResponse.json(
      { error: "Failed to process trainer application" },
      { status: 500 }
    );
  }
}
