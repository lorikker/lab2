import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestBookings() {
  try {
    console.log('🔄 Creating test trainer bookings...');

    // First, let's check if we have any users and trainers
    const users = await prisma.user.findMany({
      take: 5,
      select: { id: true, name: true, email: true }
    });

    const trainers = await prisma.trainers.findMany({
      take: 5,
      select: { id: true, name: true, email: true, category: true }
    });

    console.log(`Found ${users.length} users and ${trainers.length} trainers`);

    if (users.length === 0) {
      console.log('❌ No users found. Creating test users first...');
      
      // Create test users
      const testUsers = await prisma.user.createMany({
        data: [
          {
            id: 'test-user-1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'USER'
          },
          {
            id: 'test-user-2', 
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: 'USER'
          },
          {
            id: 'test-user-3',
            name: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            role: 'USER'
          }
        ],
        skipDuplicates: true
      });
      
      console.log(`✅ Created ${testUsers.count} test users`);
    }

    if (trainers.length === 0) {
      console.log('❌ No trainers found. Creating test trainers first...');
      
      // Create test trainer users
      const trainerUsers = await prisma.user.createMany({
        data: [
          {
            id: 'trainer-user-1',
            name: 'Alex Fitness',
            email: 'alex@trainer.com',
            role: 'TRAINER'
          },
          {
            id: 'trainer-user-2',
            name: 'Sarah Strong',
            email: 'sarah@trainer.com', 
            role: 'TRAINER'
          }
        ],
        skipDuplicates: true
      });

      // Create trainer profiles
      const testTrainers = await prisma.trainers.createMany({
        data: [
          {
            id: 'trainer-1',
            userId: 'trainer-user-1',
            applicationId: 'app-1',
            name: 'Alex Fitness',
            email: 'alex@trainer.com',
            category: 'Physical Training',
            specialty: 'Strength Training',
            experience: '5 years',
            price: '$80/session',
            description: 'Expert in strength training and muscle building',
            approvedBy: 'admin'
          },
          {
            id: 'trainer-2', 
            userId: 'trainer-user-2',
            applicationId: 'app-2',
            name: 'Sarah Strong',
            email: 'sarah@trainer.com',
            category: 'Diet & Nutrition',
            specialty: 'Weight Loss',
            experience: '7 years',
            price: '$60/session',
            description: 'Nutrition specialist and diet planning expert',
            approvedBy: 'admin'
          }
        ],
        skipDuplicates: true
      });

      console.log(`✅ Created ${testTrainers.count} test trainers`);
    }

    // Get current date and create bookings for this month
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Create test bookings for various dates this month
    const testBookings = [
      {
        userId: users[0]?.id || 'test-user-1',
        trainerId: 'trainer-1',
        trainerName: 'Alex Fitness',
        sessionType: 'Personal Training',
        bookingDate: new Date(currentYear, currentMonth, today.getDate()).toISOString().split('T')[0],
        bookingTime: '09:00',
        amount: 80.00,
        currency: 'USD',
        status: 'confirmed',
        customerEmail: users[0]?.email || 'john.doe@example.com',
        notes: 'Focus on upper body strength training',
        invoiceNumber: `INV-${Date.now()}-1`,
        orderNumber: `ORD-${Date.now()}-1`
      },
      {
        userId: users[1]?.id || 'test-user-2',
        trainerId: 'trainer-2',
        trainerName: 'Sarah Strong',
        sessionType: 'Nutrition Consultation',
        bookingDate: new Date(currentYear, currentMonth, today.getDate() + 1).toISOString().split('T')[0],
        bookingTime: '14:00',
        amount: 60.00,
        currency: 'USD',
        status: 'confirmed',
        customerEmail: users[1]?.email || 'jane.smith@example.com',
        notes: 'Meal planning and diet consultation',
        invoiceNumber: `INV-${Date.now()}-2`,
        orderNumber: `ORD-${Date.now()}-2`
      },
      {
        userId: users[2]?.id || 'test-user-3',
        trainerId: 'trainer-1',
        trainerName: 'Alex Fitness',
        sessionType: 'HIIT Training',
        bookingDate: new Date(currentYear, currentMonth, today.getDate() + 2).toISOString().split('T')[0],
        bookingTime: '10:30',
        amount: 80.00,
        currency: 'USD',
        status: 'completed',
        customerEmail: users[2]?.email || 'mike.johnson@example.com',
        notes: 'High intensity interval training session',
        invoiceNumber: `INV-${Date.now()}-3`,
        orderNumber: `ORD-${Date.now()}-3`
      },
      {
        userId: users[0]?.id || 'test-user-1',
        trainerId: 'trainer-2',
        trainerName: 'Sarah Strong',
        sessionType: 'Diet Planning',
        bookingDate: new Date(currentYear, currentMonth, today.getDate() + 5).toISOString().split('T')[0],
        bookingTime: '16:00',
        amount: 60.00,
        currency: 'USD',
        status: 'confirmed',
        customerEmail: users[0]?.email || 'john.doe@example.com',
        notes: 'Custom diet plan creation',
        invoiceNumber: `INV-${Date.now()}-4`,
        orderNumber: `ORD-${Date.now()}-4`
      }
    ];

    // Create the bookings
    const createdBookings = await prisma.trainerBookings.createMany({
      data: testBookings,
      skipDuplicates: true
    });

    console.log(`✅ Created ${createdBookings.count} test trainer bookings`);

    // Verify the bookings were created
    const allBookings = await prisma.trainerBookings.findMany({
      orderBy: { bookingDate: 'asc' }
    });

    console.log('\n📋 All trainer bookings:');
    allBookings.forEach(booking => {
      console.log(`  - ${booking.bookingDate} ${booking.bookingTime}: ${booking.trainerName} with ${booking.userId} (${booking.status})`);
    });

    console.log('\n🎉 Test data created successfully!');
    console.log('You can now view the trainer bookings calendar at: http://localhost:3001/admin/manage-trainers');

  } catch (error) {
    console.error('❌ Error creating test bookings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestBookings();
