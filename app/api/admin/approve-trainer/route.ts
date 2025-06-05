
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { db } from "@/db";

const prisma = new PrismaClient();

// GET - Fetch approved trainers
export async function POST(request: NextRequest) {
  try {
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
      const newTrainer = await prisma.trainers.create({
        data: {
          userId: application.userId, // Reference to the user who applied
          applicationId: application.id, // Reference to the original application
          name: application.name,
          email: application.email,
          phone: application.phone,
          category: application.category,
          specialty: application.specialty ?? "N/A",
          experience: application.experience,
          rating: 5.0, // Default rating
          totalSessions: 0, // Default total sessions
          price: application.price,
          description: application.description,
          qualifications: application.qualifications,
          availability: application.availability,
          photoUrl: application.photoUrl,
          isActive: true, // Mark trainer as active
          approvedAt: new Date(), // Set approval date
          approvedBy: adminId, // Admin who approved the trainer
        },
      });

      console.log("New trainer added:", newTrainer);

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

      return NextResponse.json({
        success: true,
        message: "Trainer application rejected successfully",
      });
    }
  } catch (error) {
    console.error("Error approving trainer:", error);
    return NextResponse.json(
      { error: "Failed to approve trainer" },
      { status: 500 }
    );
  }
}