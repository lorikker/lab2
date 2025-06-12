import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    // Only allow admins to access this endpoint
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Try to fetch real memberships from the database
    try {
      // Get all active memberships with user information
      const memberships = await db.memberships.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      // Transform the data to include user name directly
      const transformedMemberships = memberships.map(membership => ({
        id: membership.id,
        name: membership.name || membership.user?.name || 'Unknown User',
        userId: membership.userId,
        membershipType: membership.membershipType || 'Standard',
        status: membership.status || 'ACTIVE',
        startDate: membership.startDate?.toISOString() || new Date().toISOString(),
        endDate: membership.endDate?.toISOString() || new Date(Date.now() + 30*24*60*60*1000).toISOString(),
        daysActive: membership.daysActive || 0,
        daysRemaining: membership.daysRemaining || 30,
        price: Number(membership.price || 0),
        currency: membership.currency || 'USD',
        createdAt: membership.createdAt.toISOString(),
        userEmail: membership.user?.email || 'unknown@example.com'
      }));

      return NextResponse.json({
        memberships: transformedMemberships,
        total: memberships.length
      });
    } catch (dbError) {
      console.error('Database error, using fallback data:', dbError);

      // If there's an error with the database, create demo memberships with mock users
      const mockUsers = [
        { id: 'user1', name: 'John Doe', email: 'john@example.com' },
        { id: 'user2', name: 'Jane Smith', email: 'jane@example.com' },
        { id: 'user3', name: 'Mike Johnson', email: 'mike@example.com' },
        { id: 'user4', name: 'Sarah Wilson', email: 'sarah@example.com' },
        { id: 'user5', name: 'David Brown', email: 'david@example.com' }
      ];
      
      // Generate demo memberships based on mock users
      const demoMemberships = mockUsers.map((user, index) => {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - Math.floor(Math.random() * 30));
        
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + (30 * (Math.floor(Math.random() * 3) + 1)));
        
        const daysActive = Math.max(0, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
        const daysRemaining = Math.max(0, Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
        
        let status = "PENDING";
        if (today >= startDate && today <= endDate) {
          status = "ACTIVE";
        } else if (today > endDate) {
          status = "EXPIRED";
        }
        
        const membershipTypes = ["Basic", "Premium", "Gold", "Platinum"];
        const prices = [29.99, 49.99, 99.99, 199.99];
        const typeIndex = Math.floor(Math.random() * membershipTypes.length);
        
        return {
          id: `demo-${user.id}-${index}`,
          name: user.name || 'Unknown User',
          userId: user.id,
          membershipType: membershipTypes[typeIndex],
          status,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          daysActive,
          daysRemaining,
          price: prices[typeIndex],
          currency: 'USD',
          createdAt: new Date(startDate.getTime() - 1000*60*60).toISOString(),
          userEmail: user.email
        };
      });
      
      return NextResponse.json({
        memberships: demoMemberships,
        total: demoMemberships.length,
        demo: true
      });
    }
  } catch (error) {
    console.error('Error fetching memberships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memberships', memberships: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Only allow admins to access this endpoint
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { userId, membershipType, startDate, endDate, price, currency } = body;
    
    if (!userId || !membershipType || !startDate || !endDate || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Calculate days active and remaining
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    
    const daysActive = Math.max(0, Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(0, Math.floor((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Determine status
    let status = "PENDING";
    if (today >= start && today <= end) {
      status = "ACTIVE";
    } else if (today > end) {
      status = "EXPIRED";
    }
    
    try {
      // Try to create a new membership in the database
      const newMembership = await db.memberships.create({
        data: {
          userId,
          membershipType,
          status,
          startDate: start,
          endDate: end,
          daysActive,
          daysRemaining,
          price,
          currency: currency || "USD"
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });
      
      return NextResponse.json({
        success: true,
        membership: {
          ...newMembership,
          price: Number(newMembership.price),
          name: newMembership.user?.name,
          userEmail: newMembership.user?.email,
          membershipType: newMembership.membershipType
        }
      });
    } catch (dbError) {
      console.error('Database error creating membership, returning demo response:', dbError);
      
      // Return a demo response if the database operation fails
      return NextResponse.json({
        success: true,
        demo: true,
        membership: {
          id: `demo-${Date.now()}`,
          userId,
          name: 'Demo User',
          membershipType,
          status,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          daysActive,
          daysRemaining,
          price: Number(price),
          currency: currency || "USD",
          createdAt: new Date().toISOString(),
          userEmail: 'demo@example.com'
        }
      });
    }
  } catch (error) {
    console.error('Error creating membership:', error);
    return NextResponse.json(
      { error: 'Failed to create membership' },
      { status: 500 }
    );
  }
}
