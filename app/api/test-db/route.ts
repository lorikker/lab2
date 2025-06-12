import { NextRequest, NextResponse } from "next/server";
import { db } from '@/db';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const result = await db.$queryRaw`SELECT 1 as test`;
    console.log('Database connection successful:', result);
    
    // Test if tables exist
    const tables = await db.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'memberships', 'paidmemberships')
    `;
    console.log('Tables found:', tables);
    
    // Count records in each table
    const userCount = await db.user.count();
    console.log('User count:', userCount);
    
    let membershipCount = 0;
    let paidMembershipCount = 0;
    
    try {
      membershipCount = await db.memberships.count();
      console.log('Membership count:', membershipCount);
    } catch (error) {
      console.log('Memberships table error:', error.message);
    }
    
    try {
      paidMembershipCount = await db.paidMemberships.count();
      console.log('Paid membership count:', paidMembershipCount);
    } catch (error) {
      console.log('PaidMemberships table error:', error.message);
    }
    
    // Get some sample data
    const sampleUsers = await db.user.findMany({ take: 3 });
    console.log('Sample users:', sampleUsers);
    
    return NextResponse.json({
      success: true,
      connection: 'working',
      tables: tables,
      counts: {
        users: userCount,
        memberships: membershipCount,
        paidMemberships: paidMembershipCount
      },
      sampleUsers: sampleUsers.map(u => ({ id: u.id, name: u.name, email: u.email }))
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      connection: 'failed'
    }, { status: 500 });
  }
}
