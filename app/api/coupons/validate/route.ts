import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, cartTotal } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Coupon code is required" },
        { status: 400 }
      );
    }

    if (!cartTotal || cartTotal <= 0) {
      return NextResponse.json(
        { error: "Invalid cart total" },
        { status: 400 }
      );
    }

    // Find the coupon by code
    const coupon = await db.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid coupon code" },
        { status: 404 }
      );
    }

    // Check if coupon is active (within date range)
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

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.isPercent) {
      discountAmount = (cartTotal * Number(coupon.discount)) / 100;
    } else {
      discountAmount = Number(coupon.discount);
    }

    // Ensure discount doesn't exceed cart total
    discountAmount = Math.min(discountAmount, cartTotal);

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount: Number(coupon.discount),
        isPercent: coupon.isPercent,
      },
      discountAmount,
      message: `Coupon applied! You saved ${coupon.isPercent ? `${coupon.discount}%` : `$${coupon.discount}`}`,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json(
      { error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
