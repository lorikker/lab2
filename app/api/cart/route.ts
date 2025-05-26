import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      // For non-logged in users, return an empty cart
      return NextResponse.json({
        id: "guest-cart",
        items: [],
        total: 0,
      });
    }

    // For logged-in users, fetch from database
    let cart = await prisma.cart.findUnique({
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
      cart = await prisma.cart.create({
        data: {
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
      { status: 500 }
    );
  }
}
