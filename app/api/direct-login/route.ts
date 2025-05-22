import { NextResponse } from "next/server";
import { db } from "@/db";
import { scrypt } from "crypto";
import { promisify } from "util";

// Convert callback-based scrypt to Promise-based
const scryptAsync = promisify(scrypt);

// Verify password against stored hash
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const [salt, key] = hash.split(":");
    const derivedKey = await scryptAsync(password, salt, 64) as Buffer;
    return key === derivedKey.toString("hex");
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    
    console.log("Attempting login for:", email);
    
    // Find user in database
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
      },
    });
    
    // Log user details (excluding password)
    console.log("User found:", user ? {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      hasPassword: !!user.password
    } : "No user found");
    
    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    
    // Verify password
    const passwordValid = await verifyPassword(password, user.password);
    console.log("Password valid:", passwordValid);
    
    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    
    // Return user info (excluding password)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role || "USER", // Default to USER if role is null
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
