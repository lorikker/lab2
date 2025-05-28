import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestApplication() {
  try {
    console.log('🔧 Creating test trainer application...\n');

    // First, create a test user
    const testUser = await prisma.user.create({
      data: {
        email: 'testtrainer2@example.com',
        name: 'Maria Rodriguez',
        role: 'USER'
      }
    });

    console.log('✅ Created test user:', testUser);

    // Create trainer application
    const application = await prisma.trainerApplications.create({
      data: {
        userId: testUser.id,
        name: 'Maria Rodriguez',
        email: 'testtrainer2@example.com',
        phone: '+1234567890',
        category: 'diet',
        specialty: 'Weight Loss Nutrition',
        experience: '3 years',
        price: '65',
        description: 'Experienced nutritionist specializing in sustainable weight loss through balanced meal planning and lifestyle coaching.',
        qualifications: 'Certified Nutritionist, Bachelor in Nutrition Science, Weight Management Specialist',
        availability: 'Monday-Friday 9AM-5PM, Saturday 10AM-2PM',
        photoUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop&crop=face',
        status: 'pending'
      }
    });

    console.log('✅ Created trainer application:', {
      id: application.id,
      name: application.name,
      category: application.category,
      specialty: application.specialty
    });

    // Create notification for admin
    const notification = await prisma.notifications.create({
      data: {
        userId: 'lorik@gmail.com',
        type: 'trainer_application',
        title: 'New Trainer Application',
        message: `${application.name} has submitted a new trainer application for ${application.specialty}.`,
        data: {
          applicationId: application.id,
          applicantName: application.name,
          applicantEmail: application.email,
          category: application.category,
          specialty: application.specialty,
          appliedAt: new Date().toISOString()
        },
        isAdmin: true,
        isRead: false
      }
    });

    console.log('✅ Created admin notification:', notification.id);

    // Create notification for user
    const userNotification = await prisma.notifications.create({
      data: {
        userId: testUser.id,
        type: 'trainer_application',
        title: 'Application Submitted',
        message: 'Your trainer application has been submitted successfully and is now under review by our admin team.',
        data: {
          applicationId: application.id,
          category: application.category,
          specialty: application.specialty,
          submittedAt: new Date().toISOString()
        },
        isAdmin: false,
        isRead: false
      }
    });

    console.log('✅ Created user notification:', userNotification.id);

    console.log('\n🎉 Test application created successfully!');
    console.log('📋 Application Details:');
    console.log(`   - Application ID: ${application.id}`);
    console.log(`   - User ID: ${testUser.id}`);
    console.log(`   - Name: ${application.name}`);
    console.log(`   - Email: ${application.email}`);
    console.log(`   - Category: ${application.category}`);
    console.log(`   - Specialty: ${application.specialty}`);
    console.log(`   - Status: ${application.status}`);
    
    console.log('\n📝 Next steps:');
    console.log('1. Login as admin (lorik@gmail.com) in the dashboard');
    console.log('2. Check notifications for the new trainer application');
    console.log('3. Approve the trainer from the notification modal');
    console.log('4. Verify the trainer appears on the trainers page');

  } catch (error) {
    console.error('❌ Error creating test application:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestApplication();
