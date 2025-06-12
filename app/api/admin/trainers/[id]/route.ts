import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const trainerId = params.id;

    // First, get the trainer to find the associated user
    const trainer = await prisma.trainers.findUnique({
      where: { id: trainerId },
      select: { userId: true, name: true }
    });

    if (!trainer) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
    }

    // Delete the trainer record
    await prisma.trainers.delete({
      where: { id: trainerId }
    });

    // Update the user's role back to USER
    await prisma.user.update({
      where: { id: trainer.userId },
      data: { role: "USER" }
    });

    return NextResponse.json({ 
      message: "Trainer deleted successfully",
      trainerId: trainerId,
      trainerName: trainer.name
    });

  } catch (error) {
    console.error("Error deleting trainer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin or the trainer themselves
    if (session.user.role !== "ADMIN" && session.user.role !== "TRAINER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const trainerId = params.id;

    const trainer = await prisma.trainers.findUnique({
      where: { id: trainerId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
          }
        }
      }
    });

    if (!trainer) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
    }

    // If user is a trainer, only allow them to see their own profile
    if (session.user.role === "TRAINER" && trainer.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(trainer);

  } catch (error) {
    console.error("Error fetching trainer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
