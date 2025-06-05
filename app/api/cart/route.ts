import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({
        id: "guest-cart",
        items: [],
        total: 0,
      });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      console.error("User not found in database:", session.user.id);
      return NextResponse.json({
        id: "guest-cart",
        items: [],
        total: 0,
      });
    }

    let cart = await db.cart.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
            bundle: {
              include: {
                items: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Create cart if it doesn't exist
    if (!cart) {
      try {
        cart = await db.cart.create({
          data: {
            userId: user.id, // Use the verified user ID
          },
          include: {
            items: {
              include: {
                product: {
                  include: {
                    category: true,
                  },
                },
                bundle: {
                  include: {
                    items: {
                      include: {
                        product: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
      } catch (createError) {
        console.error("Error creating cart:", createError);
        // Return empty cart if creation fails
        return NextResponse.json({
          id: "guest-cart",
          items: [],
          total: 0,
        });
      }
    }

    // Calculate total
    let total = 0;

    for (const item of cart.items) {
      if (item.product) {
        const price = item.product.salePrice || item.product.price;
        total += Number(price) * item.quantity;
      } else if (item.bundle) {
        const price = item.bundle.salePrice || item.bundle.price;
        total += Number(price) * item.quantity;
      }
    }

    return NextResponse.json({
      ...cart,
      total,
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user cart" },
      { status: 500 },
    );
  }
}
