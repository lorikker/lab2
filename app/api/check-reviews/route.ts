import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI as string);
    await client.connect();
    console.log("Connected to MongoDB to check reviews");
    
    const mongoDb = client.db("lab2");
    
    // List all collections
    const collections = await mongoDb.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Check if reviews collection exists
    const hasReviewsCollection = collectionNames.includes("reviews");
    
    let reviewsCount = 0;
    let reviews = [];
    
    if (hasReviewsCollection) {
      // Count reviews
      reviewsCount = await mongoDb.collection("reviews").countDocuments();
      
      // Get all reviews
      reviews = await mongoDb.collection("reviews").find().toArray();
    }
    
    await client.close();
    
    return NextResponse.json({
      collections: collectionNames,
      hasReviewsCollection,
      reviewsCount,
      reviews
    });
  } catch (error) {
    console.error("Check Reviews Error:", error);
    return NextResponse.json(
      { message: "Failed to check reviews", error: String(error) },
      { status: 500 }
    );
  }
}