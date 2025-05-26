import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

// Initialize Prisma client
const prisma = new PrismaClient();

// Schema for review creation
const ReviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

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

    // For now, just return success with a mock review
    // In a real implementation, we would check if the product exists and create/update the review

    // When database is ready, use this:
    // // Check if product exists
    // const product = await prisma.product.findUnique({
    //   where: { id: productId },
    // });

    // if (!product) {
    //   return NextResponse.json(
    //     { message: "Product not found" },
    //     { status: 404 },
    //   );
    // }

    // // Check if user has already reviewed this product
    // const existingReview = await prisma.review.findUnique({
    //   where: {
    //     productId_userId: {
    //       productId,
    //       userId: session.user.id,
    //     },
    //   },
    // });

    // if (existingReview) {
    //   // Update existing review
    //   const updatedReview = await prisma.review.update({
    //     where: {
    //       id: existingReview.id,
    //     },
    //     data: {
    //       rating,
    //       comment,
    //     },
    //   });
    //
    //   return NextResponse.json(
    //     { message: "Review updated successfully", review: updatedReview },
    //     { status: 200 },
    //   );
    // }

    // // Create new review
    // const newReview = await prisma.review.create({
    //   data: {
    //     productId,
    //     userId: session.user.id,
    //     rating,
    //     comment,
    //   },
    // });

    // Mock review for now
    const newReview = {
      id: "mock-review-id",
      productId,
      userId: session.user.id,
      rating,
      comment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

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
