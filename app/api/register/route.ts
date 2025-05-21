import { NextResponse } from "next/server";
import { db } from "@/db";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";

// Convert callback-based scrypt to Promise-based
const scryptAsync = promisify(scrypt);

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if email is already registered
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    // Hash password
    // Generate a salt
    const salt = randomBytes(16).toString("hex");
    // Hash the password with the salt
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    // Combine the salt and hashed password
    const hashedPassword = `${salt}:${buf.toString("hex")}`;

    // Create user in database
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        userId: user.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 },
    );
  }
}
