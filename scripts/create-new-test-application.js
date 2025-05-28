import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createNewTestApplication() {
  try {
    console.log('🔧 Creating new test trainer application...\n');

    // Create a new test user
    const testUser = await prisma.user.create({
      data: {
        email: 'newtrainer@example.com',
        name: 'John Smith',
        role: 'USER'
      }
    });

    console.log('✅ Created test user:', testUser);

    // Create trainer application
    const application = await prisma.trainerApplications.create({
      data: {
        userId: testUser.id,
        name: 'John Smith',
        email: 'newtrainer@example.com',
        phone: '+1987654321',
        category: 'physical',
        specialty: 'Personal Training',
        experience: '4 years',
        price: '75',
        description: 'Certified personal trainer with 4 years of experience helping clients achieve their fitness goals through customized workout plans.',
        qualifications: 'NASM Certified Personal Trainer, CPR Certified',
        availability: 'Monday-Friday 6AM-8PM, Saturday 8AM-4PM',
        photoUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=400&fit=crop&crop=face',
        status: 'pending'
      }
    });

    console.log('✅ Created trainer application:', {
      id: application.id,
      name: application.name,
      category: application.category,
      specialty: application.specialty,
      status: application.status
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

    console.log('\n🎉 New test application created successfully!');
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
    console.log('3. Try to approve the trainer from the notification modal');
    console.log('4. Check if the trainer appears on the trainers page');

  } catch (error) {
    console.error('❌ Error creating test application:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createNewTestApplication();
