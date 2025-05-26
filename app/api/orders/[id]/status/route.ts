import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    // Validate status values
    const validOrderStatuses = [
      "PENDING",
      "PROCESSING",
      "COMPLETED",
      "CANCELLED",
    ];

    if (!status || !validOrderStatuses.includes(status.toUpperCase())) {
      return NextResponse.json(
        { error: "Invalid order status" },
        { status: 400 },
      );
    }

    // Check if order exists
    const existingOrder = await db.order.findUnique({
      where: { id: params.id },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order status
    const updatedOrder = await db.order.update({
      where: { id: params.id },
      data: {
        status: status.toUpperCase(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: true,
      },
    });

    // Convert Decimal to number for serialization
    const serializedOrder = {
      ...updatedOrder,
      total: Number(updatedOrder.total),
      items: updatedOrder.items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    };

    return NextResponse.json(serializedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 },
    );
  }
}
