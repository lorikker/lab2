import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createArtiTrainer() {
  try {
    console.log('🔧 Creating trainer record for arti@gmail.com...\n');

    // Get the user record
    const user = await prisma.user.findUnique({
      where: { email: 'arti@gmail.com' },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) {
      console.log('❌ User arti@gmail.com not found');
      return;
    }

    console.log('✅ User found:', user);

    // Check if trainer record already exists
    const existingTrainer = await prisma.trainers.findUnique({
      where: { email: 'arti@gmail.com' }
    });

    if (existingTrainer) {
      console.log('⚠️ Trainer record already exists for arti@gmail.com');
      return;
    }

    // Create trainer record
    const trainer = await prisma.trainers.create({
      data: {
        userId: user.id,
        applicationId: 'manual-creation-arti',
        name: user.name || 'Arti Trainer',
        email: user.email,
        phone: '+355 69 123 4567',
        category: 'Physical Training',
        specialty: 'Strength Training & Fitness',
        experience: '3 years',
        rating: 4.8,
        totalSessions: 0,
        price: '$75/session',
        description: 'Experienced fitness trainer specializing in strength training and overall fitness improvement.',
        qualifications: 'Certified Personal Trainer, Strength & Conditioning Specialist',
        availability: 'Monday-Friday 8AM-6PM, Saturday 9AM-3PM',
        photoUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face',
        isActive: true,
        approvedBy: 'system-admin'
      }
    });

    console.log('\n✅ Trainer record created successfully:');
    console.log(`   - Trainer ID: ${trainer.id}`);
    console.log(`   - Name: ${trainer.name}`);
    console.log(`   - Email: ${trainer.email}`);
    console.log(`   - Category: ${trainer.category}`);
    console.log(`   - Specialty: ${trainer.specialty}`);

    // Now create some test bookings where arti@gmail.com is the TRAINER
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-based

    const testBookings = [
      {
        userId: 'customer-1',
        trainerId: trainer.id,
        trainerName: trainer.name,
        sessionType: 'Personal Training',
        bookingDate: new Date(currentYear, currentMonth, today.getDate() + 1).toISOString().split('T')[0],
        bookingTime: '10:00',
        amount: 75.00,
        currency: 'USD',
        status: 'confirmed',
        customerEmail: 'customer1@example.com',
        notes: 'Strength training session',
        invoiceNumber: `INV-ARTI-${Date.now()}-1`,
        orderNumber: `ORD-ARTI-${Date.now()}-1`
      },
      {
        userId: 'customer-2',
        trainerId: trainer.id,
        trainerName: trainer.name,
        sessionType: 'Fitness Assessment',
        bookingDate: new Date(currentYear, currentMonth, today.getDate() + 3).toISOString().split('T')[0],
        bookingTime: '14:00',
        amount: 75.00,
        currency: 'USD',
        status: 'scheduled',
        customerEmail: 'customer2@example.com',
        notes: 'Initial fitness assessment and goal setting',
        invoiceNumber: `INV-ARTI-${Date.now()}-2`,
        orderNumber: `ORD-ARTI-${Date.now()}-2`
      },
      {
        userId: 'customer-3',
        trainerId: trainer.id,
        trainerName: trainer.name,
        sessionType: 'HIIT Training',
        bookingDate: new Date(currentYear, currentMonth, today.getDate() + 7).toISOString().split('T')[0],
        bookingTime: '16:30',
        amount: 75.00,
        currency: 'USD',
        status: 'confirmed',
        customerEmail: 'customer3@example.com',
        notes: 'High-intensity interval training',
        invoiceNumber: `INV-ARTI-${Date.now()}-3`,
        orderNumber: `ORD-ARTI-${Date.now()}-3`
      }
    ];

    // Create the bookings
    const createdBookings = await prisma.trainerBookings.createMany({
      data: testBookings,
      skipDuplicates: true
    });

    console.log(`\n✅ Created ${createdBookings.count} test bookings where arti@gmail.com is the TRAINER`);

    console.log('\n🎉 Setup complete! Now arti@gmail.com can see their trainer appointments in the calendar.');

  } catch (error) {
    console.error('❌ Error creating trainer record:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createArtiTrainer();
