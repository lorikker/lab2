import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { code, discount, isPercent, maxUses, startDate, endDate } = body;

    // Validation
    if (!code || !discount || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (discount <= 0) {
      return NextResponse.json(
        { error: "Discount must be greater than 0" },
        { status: 400 }
      );
    }

    if (isPercent && discount > 100) {
      return NextResponse.json(
        { error: "Percentage discount cannot exceed 100%" },
        { status: 400 }
      );
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      );
    }

    // Check if coupon exists
    const existingCoupon = await db.coupon.findUnique({
      where: { id: params.id },
    });

    if (!existingCoupon) {
      return NextResponse.json(
        { error: "Coupon not found" },
        { status: 404 }
      );
    }

    // Check if code is taken by another coupon
    const codeCheck = await db.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (codeCheck && codeCheck.id !== params.id) {
      return NextResponse.json(
        { error: "Coupon code already exists" },
        { status: 400 }
      );
    }

    // Update coupon
    const updatedCoupon = await db.coupon.update({
      where: { id: params.id },
      data: {
        code: code.toUpperCase(),
        discount,
        isPercent,
        maxUses,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    // Convert Decimal to number for serialization
    const serializedCoupon = {
      ...updatedCoupon,
      discount: Number(updatedCoupon.discount),
    };

    return NextResponse.json(serializedCoupon);
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json(
      { error: "Failed to update coupon" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if coupon exists
    const existingCoupon = await db.coupon.findUnique({
      where: { id: params.id },
    });

    if (!existingCoupon) {
      return NextResponse.json(
        { error: "Coupon not found" },
        { status: 404 }
      );
    }

    // Delete coupon
    await db.coupon.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json(
      { error: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
