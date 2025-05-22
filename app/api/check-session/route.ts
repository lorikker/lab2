import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ 
      authenticated: false,
      message: "Not authenticated" 
    }, { status: 401 });
  }
  
  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
    }
  });
}
