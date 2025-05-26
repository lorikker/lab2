import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      salePrice,
      images,
      featured,
      slug,
      items,
    } = body;

    // Validation
    if (!name || !description || !price || !slug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: "Price must be greater than 0" },
        { status: 400 },
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Bundle must contain at least one item" },
        { status: 400 },
      );
    }

    // Check if bundle exists
    const existingBundle = await db.bundle.findUnique({
      where: { id: params.id },
    });

    if (!existingBundle) {
      return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
    }

    // Check if slug is taken by another bundle
    const slugCheck = await db.bundle.findUnique({
      where: { slug },
    });

    if (slugCheck && slugCheck.id !== params.id) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 },
      );
    }

    // Validate that all products exist
    const productIds = items.map((item: any) => item.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more products not found" },
        { status: 400 },
      );
    }

    // Update bundle with items (delete old items and create new ones)
    const updatedBundle = await db.bundle.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price,
        salePrice,
        images: images || [],
        featured: featured || false,
        slug,
        items: {
          deleteMany: {}, // Delete all existing items
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
              },
            },
          },
        },
      },
    });

    // Convert Decimal to number for serialization
    const serializedBundle = {
      ...updatedBundle,
      price: Number(updatedBundle.price),
      salePrice: updatedBundle.salePrice
        ? Number(updatedBundle.salePrice)
        : null,
      items: updatedBundle.items.map((item) => ({
        ...item,
        product: item.product
          ? {
              ...item.product,
              price: Number(item.product.price),
            }
          : null,
      })),
    };

    return NextResponse.json(serializedBundle);
  } catch (error) {
    console.error("Error updating bundle:", error);
    return NextResponse.json(
      { error: "Failed to update bundle" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if bundle exists
    const existingBundle = await db.bundle.findUnique({
      where: { id: params.id },
    });

    if (!existingBundle) {
      return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
    }

    // Delete bundle (items will be deleted automatically due to cascade)
    await db.bundle.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Bundle deleted successfully" });
  } catch (error) {
    console.error("Error deleting bundle:", error);
    return NextResponse.json(
      { error: "Failed to delete bundle" },
      { status: 500 },
    );
  }
}
