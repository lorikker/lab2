import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { couponId } = body;

    if (!couponId) {
      return NextResponse.json(
        { error: "Coupon ID is required" },
        { status: 400 }
      );
    }

    // Find the coupon
    const coupon = await db.coupon.findUnique({
      where: { id: couponId },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: "Coupon not found" },
        { status: 404 }
      );
    }

    // Check if coupon is still valid
    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      return NextResponse.json(
        { error: "Coupon has expired or is not yet active" },
        { status: 400 }
      );
    }

    // Check if coupon has reached maximum uses
    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return NextResponse.json(
        { error: "Coupon has reached its usage limit" },
        { status: 400 }
      );
    }

    // Increment the usage count
    const updatedCoupon = await db.coupon.update({
      where: { id: couponId },
      data: {
        currentUses: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Coupon usage recorded",
      currentUses: updatedCoupon.currentUses,
    });
  } catch (error) {
    console.error("Error recording coupon usage:", error);
    return NextResponse.json(
      { error: "Failed to record coupon usage" },
      { status: 500 }
    );
  }
}
