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

    console.log('🔍 Fetching trainer applications from database...');

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    // Build where clause for filtering
    let whereClause: any = {};
    
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    if (category && category !== 'all') {
      whereClause.category = category;
    }

    // Test database connection first
    console.log('🔍 Testing database connection...');
    await db.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');

    // Fetch trainer applications from database
    console.log('🔍 Fetching from TrainerApplications table...');
    const applications = await db.trainerApplications.findMany({
      where: whereClause,
      orderBy: [
        { status: 'asc' }, // Pending first
        { appliedAt: 'desc' } // Most recent first
      ],
      take: limit ? parseInt(limit) : undefined,
      select: {
        id: true,
        userId: true,
        name: true,
        email: true,
        phone: true,
        category: true,
        specialty: true,
        experience: true,
        price: true,
        description: true,
        qualifications: true,
        availability: true,
        photoUrl: true,
        status: true,
        adminNotes: true,
        appliedAt: true,
        reviewedAt: true,
        reviewedBy: true,
      }
    });

    console.log(`✅ Found ${applications.length} trainer applications in database`);

    // Transform the data to match the frontend interface
    const transformedApplications = applications.map(app => ({
      id: app.id,
      userId: app.userId,
      name: app.name,
      email: app.email,
      phone: app.phone || "",
      category: app.category,
      specialty: app.specialty || "",
      experience: app.experience,
      price: app.price,
      description: app.description,
      qualifications: app.qualifications || "",
      availability: app.availability || "",
      photoUrl: app.photoUrl,
      status: app.status,
      adminNotes: app.adminNotes,
      appliedAt: app.appliedAt.toISOString(),
      reviewedAt: app.reviewedAt?.toISOString(),
      reviewedBy: app.reviewedBy,
    }));

    // Calculate statistics
    const stats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
    };

    return NextResponse.json({
      success: true,
      applications: transformedApplications,
      stats: stats,
      count: transformedApplications.length,
      source: 'database',
      note: transformedApplications.length === 0 ? 'No trainer applications found in database' : `Showing ${transformedApplications.length} real applications from database`
    });

  } catch (error) {
    console.error("❌ Error fetching trainer applications:", error);
    console.error("Full error details:", error);
    
    // Return mock data if database is not available
    const mockApplications = [
      {
        id: "1",
        userId: "user1",
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        category: "Physical Training",
        specialty: "Strength Training",
        experience: "5 years",
        price: "$80/session",
        description: "Experienced personal trainer specializing in strength training and muscle building.",
        qualifications: "NASM Certified Personal Trainer, Bachelor's in Exercise Science",
        availability: "Monday-Friday 6AM-8PM",
        photoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        status: "pending",
        adminNotes: null,
        appliedAt: new Date().toISOString(),
        reviewedAt: null,
        reviewedBy: null,
      },
      {
        id: "2",
        userId: "user2",
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+1234567891",
        category: "Diet & Nutrition",
        specialty: "Weight Loss",
        experience: "7 years",
        price: "$90/session",
        description: "Certified nutritionist with expertise in weight management and healthy eating habits.",
        qualifications: "Registered Dietitian, Master's in Nutrition Science",
        availability: "Tuesday-Saturday 9AM-6PM",
        photoUrl: "https://images.unsplash.com/photo-1594824388853-e0c8b8b0b6e5?w=400",
        status: "approved",
        adminNotes: "Excellent qualifications and experience",
        appliedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        reviewedAt: new Date().toISOString(),
        reviewedBy: "admin@example.com",
      },
      {
        id: "3",
        userId: "user3",
        name: "Mike Johnson",
        email: "mike@example.com",
        phone: "+1234567892",
        category: "Online Training",
        specialty: "HIIT Workouts",
        experience: "3 years",
        price: "$60/session",
        description: "Online fitness coach specializing in high-intensity interval training.",
        qualifications: "ACE Certified Personal Trainer",
        availability: "Flexible online hours",
        photoUrl: "https://images.unsplash.com/photo-1567013127542-490d757e51cd?w=400",
        status: "rejected",
        adminNotes: "Insufficient experience for our standards",
        appliedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        reviewedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        reviewedBy: "admin@example.com",
      }
    ];

    return NextResponse.json({
      success: true,
      applications: mockApplications,
      stats: {
        total: mockApplications.length,
        pending: mockApplications.filter(app => app.status === 'pending').length,
        approved: mockApplications.filter(app => app.status === 'approved').length,
        rejected: mockApplications.filter(app => app.status === 'rejected').length,
      },
      count: mockApplications.length,
      source: 'mock',
      note: "⚠️ USING MOCK DATA - Database connection failed. Please check Supabase connection.",
      databaseError: true,
      errorMessage: error.message
    });
  }
}
