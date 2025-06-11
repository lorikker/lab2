import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI as string);
    await client.connect();
    console.log("Connected to MongoDB for test");
    
    const mongoDb = client.db("lab2");
    
    // Create a test document
    const testDoc = {
      id: crypto.randomUUID(),
      test: true,
      createdAt: new Date()
    };
    
    // Insert test document
    const result = await mongoDb.collection("test").insertOne(testDoc);
    console.log("Test insertion result:", result);
    
    // Retrieve all test documents
    const testDocs = await mongoDb.collection("test").find().toArray();
    
    await client.close();
    
    return NextResponse.json({
      message: "MongoDB test completed",
      insertResult: result,
      documents: testDocs
    });
  } catch (error) {
    console.error("MongoDB Test Error:", error);
    return NextResponse.json(
      { message: "MongoDB test failed", error: String(error) },
      { status: 500 }
    );
  }
}