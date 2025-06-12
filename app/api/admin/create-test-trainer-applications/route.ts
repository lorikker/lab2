import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/auth';
import { db } from '@/db';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log('🧪 Creating test trainer applications...');

    // Test database connection first
    await db.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');

    // Create test trainer applications
    const testApplications = [
      {
        userId: session.user.id || 'test-user-1',
        name: 'John Fitness',
        email: 'john.fitness@example.com',
        phone: '+1234567890',
        category: 'Physical Training',
        specialty: 'Strength Training',
        experience: '5 years',
        price: '$80/session',
        description: 'Experienced personal trainer specializing in strength training and muscle building. I help clients achieve their fitness goals through personalized workout plans.',
        qualifications: 'NASM Certified Personal Trainer, Bachelor\'s in Exercise Science',
        availability: 'Monday-Friday 6AM-8PM',
        photoUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        status: 'pending',
        appliedAt: new Date(),
      },
      {
        userId: session.user.id || 'test-user-2',
        name: 'Sarah Nutrition',
        email: 'sarah.nutrition@example.com',
        phone: '+1234567891',
        category: 'Diet & Nutrition',
        specialty: 'Weight Loss',
        experience: '7 years',
        price: '$90/session',
        description: 'Certified nutritionist with expertise in weight management and healthy eating habits. I create personalized meal plans for sustainable results.',
        qualifications: 'Registered Dietitian, Master\'s in Nutrition Science',
        availability: 'Tuesday-Saturday 9AM-6PM',
        photoUrl: 'https://images.unsplash.com/photo-1594824388853-e0c8b8b0b6e5?w=400',
        status: 'approved',
        appliedAt: new Date(Date.now() - 86400000), // Yesterday
        reviewedAt: new Date(),
        reviewedBy: session.user.email,
        adminNotes: 'Excellent qualifications and experience',
      },
      {
        userId: session.user.id || 'test-user-3',
        name: 'Mike Online',
        email: 'mike.online@example.com',
        phone: '+1234567892',
        category: 'Online Training',
        specialty: 'HIIT Workouts',
        experience: '3 years',
        price: '$60/session',
        description: 'Online fitness coach specializing in high-intensity interval training. I offer virtual sessions and custom workout programs.',
        qualifications: 'ACE Certified Personal Trainer',
        availability: 'Flexible online hours',
        photoUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51cd?w=400',
        status: 'pending',
        appliedAt: new Date(Date.now() - 172800000), // 2 days ago
      },
      {
        userId: session.user.id || 'test-user-4',
        name: 'Lisa Programs',
        email: 'lisa.programs@example.com',
        phone: '+1234567893',
        category: 'Workout Programs',
        specialty: 'Full Body Workouts',
        experience: '4 years',
        price: '$70/session',
        description: 'Fitness expert creating comprehensive workout programs for all fitness levels. Specializing in full-body transformations.',
        qualifications: 'ACSM Certified Exercise Physiologist',
        availability: 'Monday-Sunday 7AM-9PM',
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
        status: 'rejected',
        appliedAt: new Date(Date.now() - 259200000), // 3 days ago
        reviewedAt: new Date(Date.now() - 86400000), // Yesterday
        reviewedBy: session.user.email,
        adminNotes: 'Need more specialized certifications',
      }
    ];

    const createdApplications = [];

    for (const appData of testApplications) {
      try {
        const application = await db.trainerApplications.create({
          data: appData
        });
        createdApplications.push(application);
        console.log(`✅ Created application for ${appData.name}`);
      } catch (error) {
        console.error(`❌ Failed to create application for ${appData.name}:`, error);
      }
    }

    console.log(`✅ Successfully created ${createdApplications.length} test trainer applications`);

    return NextResponse.json({
      success: true,
      message: `Created ${createdApplications.length} test trainer applications`,
      applications: createdApplications.map(app => ({
        id: app.id,
        name: app.name,
        email: app.email,
        category: app.category,
        status: app.status,
        appliedAt: app.appliedAt
      }))
    });

  } catch (error) {
    console.error('❌ Error creating test trainer applications:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.stack
    }, { status: 500 });
  }
}
