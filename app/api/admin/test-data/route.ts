import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/auth';
import { db } from '@/db';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all users first
    const users = await db.user.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    if (users.length === 0) {
      return NextResponse.json({ 
        error: "No users found in database. Please create some users first." 
      }, { status: 400 });
    }

    // Create some test memberships
    const testMemberships = [];
    const testPaidMemberships = [];

    for (let i = 0; i < Math.min(3, users.length); i++) {
      const user = users[i];
      const membershipTypes = ["Basic", "Premium", "Elite"];
      const prices = [49.99, 99.99, 199.99];
      
      const membershipType = membershipTypes[i % membershipTypes.length];
      const price = prices[i % prices.length];
      
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 30);
      
      const daysRemaining = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      // Create active membership
      const membership = await db.memberships.create({
        data: {
          name: user.name,
          userId: user.id,
          membershipType,
          status: "active",
          startDate,
          endDate,
          daysActive: 0,
          daysRemaining,
          price,
          currency: "USD",
          paymentMethod: "stripe"
        }
      });

      testMemberships.push(membership);

      // Create paid membership record
      const paidMembership = await db.paidMemberships.create({
        data: {
          name: user.name,
          userId: user.id,
          orderNumber: `ORD-${Date.now()}-${i}`,
          membershipType,
          status: "completed",
          amount: price,
          currency: "USD",
          paymentMethod: "stripe",
          paymentIntentId: `pi_test_${Date.now()}_${i}`,
          invoiceNumber: `INV-${Date.now()}-${i}`,
          paymentDate: new Date(),
          membershipStartDate: startDate,
          membershipEndDate: endDate
        }
      });

      testPaidMemberships.push(paidMembership);
    }

    return NextResponse.json({
      success: true,
      message: `Created ${testMemberships.length} test memberships and ${testPaidMemberships.length} paid membership records`,
      memberships: testMemberships.length,
      paidMemberships: testPaidMemberships.length,
      users: users.length
    });

  } catch (error) {
    console.error("Error creating test data:", error);
    return NextResponse.json({
      error: "Failed to create test data",
      details: error.message
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check what's in the database
    const users = await db.user.count();
    const memberships = await db.memberships.count();
    const paidMemberships = await db.paidMemberships.count();

    return NextResponse.json({
      success: true,
      counts: {
        users,
        memberships,
        paidMemberships
      }
    });

  } catch (error) {
    console.error("Error checking database:", error);
    return NextResponse.json({
      error: "Failed to check database",
      details: error.message
    }, { status: 500 });
  }
}
