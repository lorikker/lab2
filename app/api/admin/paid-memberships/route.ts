import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/auth';
import { db } from '@/db';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.log('🔍 Attempting to connect to database...');

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const membershipType = searchParams.get('membershipType');
    const limit = searchParams.get('limit');

    // Build where clause for filtering
    let whereClause: any = {};
    
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    if (membershipType && membershipType !== 'all') {
      whereClause.membershipType = membershipType;
    }

    // Test database connection first
    console.log('🔍 Testing database connection...');
    await db.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');

    // Check if tables exist
    console.log('🔍 Checking if paidMemberships table exists...');
    const tableExists = await db.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'paidmemberships'
      );
    `;
    console.log('📊 Table exists check:', tableExists);

    // Fetch paid memberships from database
    console.log('🔍 Fetching paid memberships...');
    const paidMemberships = await db.paidMemberships.findMany({
      where: whereClause,
      orderBy: [
        { paymentDate: 'desc' } // Most recent payments first
      ],
      take: limit ? parseInt(limit) : undefined,
      select: {
        id: true,
        name: true,
        userId: true,
        orderNumber: true,
        membershipType: true,
        status: true,
        amount: true,
        currency: true,
        paymentMethod: true,
        paymentIntentId: true,
        invoiceNumber: true,
        paymentDate: true,
        membershipStartDate: true,
        membershipEndDate: true,
        createdAt: true,
        user: {
          select: {
            email: true
          }
        }
      }
    });

    console.log(`✅ Found ${paidMemberships.length} paid memberships in database`);

    // Transform the data to match the frontend interface
    const transformedPaidMemberships = paidMemberships.map(membership => ({
      id: membership.id,
      name: membership.name,
      userId: membership.userId,
      orderNumber: membership.orderNumber,
      membershipType: membership.membershipType,
      status: membership.status,
      amount: membership.amount,
      currency: membership.currency || "USD",
      paymentMethod: membership.paymentMethod,
      paymentIntentId: membership.paymentIntentId,
      invoiceNumber: membership.invoiceNumber,
      paymentDate: membership.paymentDate.toISOString(),
      membershipStartDate: membership.membershipStartDate?.toISOString(),
      membershipEndDate: membership.membershipEndDate?.toISOString(),
      userEmail: membership.user?.email || 'unknown@example.com',
      createdAt: membership.createdAt.toISOString(),
    }));

    // Calculate statistics
    const stats = {
      total: paidMemberships.length,
      thisMonth: paidMemberships.filter(membership => {
        const paymentDate = new Date(membership.paymentDate);
        const now = new Date();
        return paymentDate.getMonth() === now.getMonth() && 
               paymentDate.getFullYear() === now.getFullYear();
      }).length,
      totalRevenue: paidMemberships.reduce((sum, membership) => sum + membership.amount, 0),
      averageAmount: paidMemberships.length > 0 
        ? paidMemberships.reduce((sum, membership) => sum + membership.amount, 0) / paidMemberships.length 
        : 0,
    };

    return NextResponse.json({
      success: true,
      paidMemberships: transformedPaidMemberships,
      stats: stats,
      count: transformedPaidMemberships.length
    });

  } catch (error) {
    console.error("Error fetching paid memberships:", error);
    console.error("Full error details:", error);

    // Return comprehensive mock data if database is not available
    const mockPaidMemberships = [
      {
        id: "1",
        name: "John Doe",
        userId: "user1",
        orderNumber: "ORD-2024-001",
        membershipType: "Premium",
        status: "completed",
        amount: 99.99,
        currency: "USD",
        paymentMethod: "stripe",
        paymentIntentId: "pi_3QK1234567890",
        invoiceNumber: "INV-2024-001",
        paymentDate: new Date().toISOString(),
        membershipStartDate: new Date().toISOString(),
        membershipEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        userEmail: "john@example.com",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Jane Smith",
        userId: "user2",
        orderNumber: "ORD-2024-002",
        membershipType: "Basic",
        status: "completed",
        amount: 49.99,
        currency: "USD",
        paymentMethod: "stripe",
        paymentIntentId: "pi_3QK0987654321",
        invoiceNumber: "INV-2024-002",
        paymentDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        membershipStartDate: new Date(Date.now() - 86400000).toISOString(),
        membershipEndDate: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(),
        userEmail: "jane@example.com",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "3",
        name: "Mike Johnson",
        userId: "user3",
        orderNumber: "ORD-2024-003",
        membershipType: "Elite",
        status: "completed",
        amount: 199.99,
        currency: "USD",
        paymentMethod: "stripe",
        paymentIntentId: "pi_3QK1122334455",
        invoiceNumber: "INV-2024-003",
        paymentDate: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
        membershipStartDate: new Date(Date.now() - 2 * 86400000).toISOString(),
        membershipEndDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
        userEmail: "mike@example.com",
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: "4",
        name: "Sarah Wilson",
        userId: "user4",
        orderNumber: "ORD-2024-004",
        membershipType: "Premium",
        status: "completed",
        amount: 99.99,
        currency: "USD",
        paymentMethod: "stripe",
        paymentIntentId: "pi_3QK5566778899",
        invoiceNumber: "INV-2024-004",
        paymentDate: new Date(Date.now() - 7 * 86400000).toISOString(), // 1 week ago
        membershipStartDate: new Date(Date.now() - 7 * 86400000).toISOString(),
        membershipEndDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
        userEmail: "sarah@example.com",
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      },
      {
        id: "5",
        name: "David Brown",
        userId: "user5",
        orderNumber: "ORD-2024-005",
        membershipType: "Basic",
        status: "completed",
        amount: 49.99,
        currency: "USD",
        paymentMethod: "stripe",
        paymentIntentId: "pi_3QK9988776655",
        invoiceNumber: "INV-2024-005",
        paymentDate: new Date(Date.now() - 14 * 86400000).toISOString(), // 2 weeks ago
        membershipStartDate: new Date(Date.now() - 14 * 86400000).toISOString(),
        membershipEndDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
        userEmail: "david@example.com",
        createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      },
      {
        id: "6",
        name: "Emily Davis",
        userId: "user6",
        orderNumber: "ORD-2024-006",
        membershipType: "Elite",
        status: "completed",
        amount: 199.99,
        currency: "USD",
        paymentMethod: "stripe",
        paymentIntentId: "pi_3QK4433221100",
        invoiceNumber: "INV-2024-006",
        paymentDate: new Date(Date.now() - 21 * 86400000).toISOString(), // 3 weeks ago
        membershipStartDate: new Date(Date.now() - 21 * 86400000).toISOString(),
        membershipEndDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
        userEmail: "emily@example.com",
        createdAt: new Date(Date.now() - 21 * 86400000).toISOString(),
      }
    ];

    return NextResponse.json({
      success: true,
      paidMemberships: mockPaidMemberships,
      stats: {
        total: mockPaidMemberships.length,
        thisMonth: mockPaidMemberships.filter(membership => {
          const paymentDate = new Date(membership.paymentDate);
          const now = new Date();
          return paymentDate.getMonth() === now.getMonth() &&
                 paymentDate.getFullYear() === now.getFullYear();
        }).length,
        totalRevenue: mockPaidMemberships.reduce((sum, membership) => sum + membership.amount, 0),
        averageAmount: mockPaidMemberships.reduce((sum, membership) => sum + membership.amount, 0) / mockPaidMemberships.length,
      },
      count: mockPaidMemberships.length,
      note: "⚠️ USING MOCK DATA - Database connection failed. Please check Supabase connection.",
      databaseError: true
    });
  }
}
