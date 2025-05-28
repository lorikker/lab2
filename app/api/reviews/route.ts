import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { z } from "zod";

// Schema for review creation
const ReviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

// GET /api/reviews - Get reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 },
      );
    }

    const reviews = await db.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate average rating
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return NextResponse.json({
      reviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "You must be logged in to submit a review" },
        { status: 401 },
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate request body
    const validatedData = ReviewSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          message: "Invalid request data",
          errors: validatedData.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { productId, rating, comment } = validatedData.data;

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    // Check if user has already reviewed this product
    const existingReview = await db.review.findUnique({
      where: {
        productId_userId: {
          productId,
          userId: session.user.id,
        },
      },
    });

    if (existingReview) {
      // Update existing review
      const updatedReview = await db.review.update({
        where: {
          id: existingReview.id,
        },
        data: {
          rating,
          comment,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      return NextResponse.json(
        { message: "Review updated successfully", review: updatedReview },
        { status: 200 },
      );
    }

    // Create new review
    const newReview = await db.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Review submitted successfully", review: newReview },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { message: "An error occurred while submitting your review" },
      { status: 500 },
    );
  }
}
