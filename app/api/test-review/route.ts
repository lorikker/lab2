import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI as string);
    await client.connect();
    console.log("Connected to MongoDB for test review");
    
    const mongoDb = client.db("lab2");
    
    // Create a test review
    const testReview = {
      id: crypto.randomUUID(),
      productId: "test-product-id",
      userId: "test-user-id",
      rating: 5,
      comment: "This is a test review",
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: "test-user-id",
        name: "Test User",
      },
      product: {
        id: "test-product-id",
        name: "Test Product",
        slug: "test-product",
      },
    };
    
    // Insert test review
    const result = await mongoDb.collection("reviews").insertOne(testReview);
    console.log("Test review insertion result:", result);
    
    // Retrieve all reviews
    const reviews = await mongoDb.collection("reviews").find().toArray();
    
    await client.close();
    
    return NextResponse.json({
      message: "Test review created",
      insertResult: result,
      allReviews: reviews,
      reviewCount: reviews.length
    });
  } catch (error) {
    console.error("Test Review Error:", error);
    return NextResponse.json(
      { message: "Test review failed", error: String(error) },
      { status: 500 }
    );
  }
}