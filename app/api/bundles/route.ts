import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";

export async function GET() {
  try {
    const bundles = await db.bundle.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert Decimal to number for serialization
    const serializedBundles = bundles.map((bundle) => ({
      ...bundle,
      price: Number(bundle.price),
      salePrice: bundle.salePrice ? Number(bundle.salePrice) : null,
      items: bundle.items.map((item) => ({
        ...item,
        product: item.product
          ? {
              ...item.product,
              price: Number(item.product.price),
            }
          : null,
      })),
    }));

    return NextResponse.json(serializedBundles);
  } catch (error) {
    console.error("Error fetching bundles:", error);
    return NextResponse.json(
      { error: "Failed to fetch bundles" },
      { status: 500 },
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

    // Check if slug already exists
    const existingBundle = await db.bundle.findUnique({
      where: { slug },
    });

    if (existingBundle) {
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

    // Create bundle with items
    const bundle = await db.bundle.create({
      data: {
        name,
        description,
        price,
        salePrice,
        images: images || [],
        featured: featured || false,
        slug,
        items: {
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
      ...bundle,
      price: Number(bundle.price),
      salePrice: bundle.salePrice ? Number(bundle.salePrice) : null,
      items: bundle.items.map((item) => ({
        ...item,
        product: item.product
          ? {
              ...item.product,
              price: Number(item.product.price),
            }
          : null,
      })),
    };

    return NextResponse.json(serializedBundle, { status: 201 });
  } catch (error) {
    console.error("Error creating bundle:", error);
    return NextResponse.json(
      { error: "Failed to create bundle" },
      { status: 500 },
    );
  }
}
