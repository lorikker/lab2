import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTestData() {
  try {
    console.log('🌱 Seeding test data...');

    // Create some test trainer applications
    const trainerApplications = await prisma.trainerApplications.createMany({
      data: [
        {
          userId: 'test-user-1',
          name: 'John Trainer',
          email: 'john.trainer@example.com',
          phone: '+1234567890',
          category: 'Physical Training',
          specialty: 'Strength Training',
          experience: '5 years',
          price: '80',
          description: 'Experienced strength trainer',
          status: 'pending'
        },
        {
          userId: 'test-user-2',
          name: 'Sarah Fitness',
          email: 'sarah.fitness@example.com',
          phone: '+1234567891',
          category: 'Diet & Nutrition',
          specialty: 'Weight Loss',
          experience: '3 years',
          price: '70',
          description: 'Nutrition specialist',
          status: 'pending'
        },
        {
          userId: 'test-user-3',
          name: 'Mike Cardio',
          email: 'mike.cardio@example.com',
          phone: '+1234567892',
          category: 'Online Training',
          specialty: 'HIIT',
          experience: '4 years',
          price: '60',
          description: 'Online HIIT specialist',
          status: 'approved'
        }
      ],
      skipDuplicates: true
    });

    // Create some approved trainers
    const trainers = await prisma.trainers.createMany({
      data: [
        {
          userId: 'test-user-3',
          applicationId: 'app-1',
          name: 'Mike Cardio',
          email: 'mike.cardio@example.com',
          phone: '+1234567892',
          category: 'Online Training',
          specialty: 'HIIT',
          experience: '4 years',
          price: '60',
          description: 'Online HIIT specialist',
          photoUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51cd?w=400',
          isActive: true
        },
        {
          userId: 'test-user-4',
          applicationId: 'app-2',
          name: 'Lisa Yoga',
          email: 'lisa.yoga@example.com',
          phone: '+1234567893',
          category: 'Workout Programs',
          specialty: 'Yoga',
          experience: '6 years',
          price: '75',
          description: 'Certified yoga instructor',
          photoUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
          isActive: true
        }
      ],
      skipDuplicates: true
    });

    // Create some admin notifications
    const notifications = await prisma.notifications.createMany({
      data: [
        {
          userId: 'admin-user',
          type: 'trainer_application',
          title: 'New Trainer Application',
          message: 'John Trainer has applied to become a trainer',
          isAdmin: true,
          isRead: false
        },
        {
          userId: 'admin-user',
          type: 'trainer_application',
          title: 'New Trainer Application',
          message: 'Sarah Fitness has applied to become a trainer',
          isAdmin: true,
          isRead: false
        },
        {
          userId: 'admin-user',
          type: 'trainer_approved',
          title: 'Trainer Approved',
          message: 'Mike Cardio has been approved as a trainer',
          isAdmin: true,
          isRead: true
        }
      ],
      skipDuplicates: true
    });

    // Create some test memberships
    const memberships = await prisma.memberships.createMany({
      data: [
        {
          name: 'John Doe',
          userId: 'user-1',
          membershipType: 'basic',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          remainingDays: 30
        },
        {
          name: 'Jane Smith',
          userId: 'user-2',
          membershipType: 'premium',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
          remainingDays: 60
        },
        {
          name: 'Bob Wilson',
          userId: 'user-3',
          membershipType: 'elite',
          status: 'expired',
          startDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), // 40 days ago
          endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
          remainingDays: 0
        }
      ],
      skipDuplicates: true
    });

    console.log('✅ Test data seeded successfully!');
    console.log(`📊 Created:`);
    console.log(`   - ${trainerApplications.count} trainer applications`);
    console.log(`   - ${trainers.count} trainers`);
    console.log(`   - ${notifications.count} notifications`);
    console.log(`   - ${memberships.count} memberships`);

  } catch (error) {
    console.error('❌ Error seeding test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedTestData();
