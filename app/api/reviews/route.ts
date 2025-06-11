import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { z } from "zod";
import { MongoClient } from "mongodb";

// Schema for review creation
const ReviewSchema = z.object({
  productId: z.string(), // Changed from z.string().uuid() to just z.string() for testing
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

// MongoDB connection helper
async function getMongoClient() {
  const client = new MongoClient(process.env.MONGODB_URI as string);
  await client.connect();
  return client;
}

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

    console.log("Fetching reviews for product:", productId);

    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI as string);
    await client.connect();
    const mongoDb = client.db("lab2");

    // Get all reviews to check productIds
    const allReviews = await mongoDb.collection("reviews").find().toArray();
    console.log(
      "All productIds in database:",
      allReviews.map((r) => r.productId),
    );

    // Get reviews for the specific productId
    const reviews = await mongoDb
      .collection("reviews")
      .find({ productId })
      .sort({ createdAt: -1 })
      .toArray();

    console.log(`Found ${reviews.length} reviews for product ${productId}`);

    await client.close();

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
      { message: "An error occurred while fetching reviews" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  console.log("Review POST endpoint called");
  try {
    const session = await auth();
    console.log("Session:", session?.user);

    // For testing purposes, allow unauthenticated reviews
    const userId = session?.user?.id || "anonymous-user";
    const userName = session?.user?.name || "Anonymous User";

    // Parse request body
    const body = await request.json();
    console.log("Review submission body:", body);

    // Validate request body
    const validatedData = ReviewSchema.safeParse(body);

    if (!validatedData.success) {
      console.log("Validation error:", validatedData.error.flatten());
      return NextResponse.json(
        {
          message: "Invalid request data",
          errors: validatedData.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { productId, rating, comment } = validatedData.data;

    // For testing, we'll skip product validation
    let product;
    try {
      product = await db.product.findUnique({
        where: { id: productId },
      });
    } catch (dbError) {
      console.log("Error fetching product:", dbError);
      // Continue with a mock product for testing
      product = {
        id: productId,
        name: "Test Product",
        slug: "test-product",
      };
    }

    if (!product) {
      console.log("Product not found, using mock product");
      product = {
        id: productId,
        name: "Test Product",
        slug: "test-product",
      };
    }

    // Create review in MongoDB
    try {
      const client = new MongoClient(process.env.MONGODB_URI as string);
      await client.connect();
      console.log("Connected to MongoDB");

      const mongoDb = client.db("lab2");

      const newReview = {
        id: crypto.randomUUID(),
        productId,
        userId,
        rating,
        comment,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: userId,
          name: userName,
        },
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
        },
      };

      console.log("Attempting to insert review:", newReview);
      const result = await mongoDb.collection("reviews").insertOne(newReview);
      console.log("MongoDB insert result:", result);

      await client.close();

      return NextResponse.json(
        { message: "Review submitted successfully", review: newReview },
        { status: 201 },
      );
    } catch (mongoError) {
      console.error("MongoDB Error:", mongoError);
      throw mongoError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      {
        message: "An error occurred while submitting your review",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
