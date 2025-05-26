import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const coupons = await db.coupon.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert Decimal to number for serialization
    const serializedCoupons = coupons.map((coupon) => ({
      ...coupon,
      discount: Number(coupon.discount),
    }));

    return NextResponse.json(serializedCoupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Check if coupon code already exists
    const existingCoupon = await db.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existingCoupon) {
      return NextResponse.json(
        { error: "Coupon code already exists" },
        { status: 400 }
      );
    }

    // Create coupon
    const coupon = await db.coupon.create({
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
      ...coupon,
      discount: Number(coupon.discount),
    };

    return NextResponse.json(serializedCoupon, { status: 201 });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return NextResponse.json(
      { error: "Failed to create coupon" },
      { status: 500 }
    );
  }
}
