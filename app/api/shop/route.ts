import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get query parameters
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy") || "name";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build where clause for products
    const productWhere: any = {};

    if (search) {
      productWhere.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      productWhere.category = { slug: category };
    }

    if (minPrice || maxPrice) {
      productWhere.price = {};
      if (minPrice) productWhere.price.gte = parseFloat(minPrice);
      if (maxPrice) productWhere.price.lte = parseFloat(maxPrice);
    }

    // Build where clause for bundles (bundles don't have categories)
    const bundleWhere: any = {};

    if (search) {
      bundleWhere.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (minPrice || maxPrice) {
      bundleWhere.price = {};
      if (minPrice) bundleWhere.price.gte = parseFloat(minPrice);
      if (maxPrice) bundleWhere.price.lte = parseFloat(maxPrice);
    }

    // Skip bundles if category filter is applied (bundles don't have categories)
    const shouldFetchBundles = !category;

    // Build order by clause
    let productOrderBy: any;
    let bundleOrderBy: any;

    switch (sortBy) {
      case "price-low":
        productOrderBy = { price: "asc" };
        bundleOrderBy = { price: "asc" };
        break;
      case "price-high":
        productOrderBy = { price: "desc" };
        bundleOrderBy = { price: "desc" };
        break;
      case "newest":
        productOrderBy = { createdAt: "desc" };
        bundleOrderBy = { createdAt: "desc" };
        break;
      case "featured":
        productOrderBy = [{ featured: "desc" }, { name: "asc" }];
        bundleOrderBy = [{ featured: "desc" }, { name: "asc" }];
        break;
      default:
        productOrderBy = { name: "asc" };
        bundleOrderBy = { name: "asc" };
    }

    // Fetch products and bundles (conditionally fetch bundles)
    const fetchPromises = [
      db.product.findMany({
        where: productWhere,
        orderBy: productOrderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      db.product.count({ where: productWhere }),
    ];

    // Only fetch bundles if no category filter is applied
    if (shouldFetchBundles) {
      fetchPromises.push(
        db.bundle.findMany({
          where: bundleWhere,
          orderBy: bundleOrderBy,
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
        }),
        db.bundle.count({ where: bundleWhere }),
      );
    }

    const results = await Promise.all(fetchPromises);
    const products = results[0] as any[];
    const totalProducts = results[1] as number;
    const bundles = shouldFetchBundles ? (results[2] as any[]) : [];
    const totalBundles = shouldFetchBundles ? (results[3] as number) : 0;

    // Convert Decimal objects to numbers for products
    const serializedProducts = products.map((product) => ({
      ...product,
      type: "product" as const,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
    }));

    // Convert Decimal objects to numbers for bundles
    const serializedBundles = bundles.map((bundle) => ({
      ...bundle,
      type: "bundle" as const,
      price: Number(bundle.price),
      salePrice: bundle.salePrice ? Number(bundle.salePrice) : null,
      items: bundle.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          price: Number(item.product.price),
        },
      })),
    }));

    // Combine items with bundles first, then products
    const bundlesWithType = serializedBundles.map((bundle) => ({
      ...bundle,
      type: "bundle" as const,
    }));
    const productsWithType = serializedProducts.map((product) => ({
      ...product,
      type: "product" as const,
    }));

    // Combine with bundles first
    const allItems = [...bundlesWithType, ...productsWithType];

    // Sort combined items while maintaining bundles-first priority
    allItems.sort((a, b) => {
      // Always prioritize bundles over products
      if (a.type === "bundle" && b.type === "product") return -1;
      if (a.type === "product" && b.type === "bundle") return 1;

      // If both are the same type, apply the requested sorting
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "featured":
          if (a.featured !== b.featured) {
            return b.featured ? 1 : -1;
          }
          return a.name.localeCompare(b.name);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    // Apply pagination to combined results
    const paginatedItems = allItems.slice(offset, offset + limit);
    const total = totalProducts + totalBundles;

    return NextResponse.json({
      items: paginatedItems,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    });
  } catch (error) {
    console.error("Error fetching shop items:", error);
    return NextResponse.json(
      { error: "Failed to fetch shop items" },
      { status: 500 },
    );
  }
}
