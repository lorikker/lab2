import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { auth } from '@/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if membership exists
    const existingMembership = await db.membership.findUnique({
      where: { id: params.id },
    });

    if (!existingMembership) {
      return NextResponse.json(
        { error: "Membership not found" },
        { status: 404 }
      );
    }

    // Delete membership
    await db.membership.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Membership deleted successfully" });
  } catch (error) {
    console.error("Error deleting membership:", error);
    return NextResponse.json(
      { error: "Failed to delete membership" },
      { status: 500 }
    );
  }
}