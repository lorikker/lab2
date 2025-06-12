import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestTrainer() {
  try {
    console.log('🔄 Creating test trainer user...');

    // Create a test trainer user
    const trainerUser = await prisma.user.upsert({
      where: { email: 'trainer@sixstarfitness.com' },
      update: {
        role: 'TRAINER'
      },
      create: {
        id: 'trainer-test-user-123',
        name: 'Alex Fitness',
        email: 'trainer@sixstarfitness.com',
        role: 'TRAINER'
      }
    });

    console.log('✅ Created trainer user:', trainerUser);

    // Create trainer profile
    const trainer = await prisma.trainers.upsert({
      where: { userId: trainerUser.id },
      update: {
        name: trainerUser.name,
        email: trainerUser.email
      },
      create: {
        id: 'trainer-1',
        userId: trainerUser.id,
        applicationId: 'app-trainer-1',
        name: trainerUser.name,
        email: trainerUser.email,
        category: 'Physical Training',
        specialty: 'Strength Training',
        experience: '5 years',
        price: '$80/session',
        description: 'Expert in strength training and muscle building',
        approvedBy: 'admin'
      }
    });

    console.log('✅ Created trainer profile:', trainer);

    // Update existing bookings to use this trainer ID
    const updatedBookings = await prisma.trainerBookings.updateMany({
      where: { trainerName: 'Alex Fitness' },
      data: { trainerId: trainer.id }
    });

    console.log(`✅ Updated ${updatedBookings.count} bookings to use trainer ID: ${trainer.id}`);

    console.log('\n🎉 Test trainer created successfully!');
    console.log('📧 Email: trainer@sixstarfitness.com');
    console.log('🔑 You can now login as this trainer to see their personal schedule');

  } catch (error) {
    console.error('❌ Error creating test trainer:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestTrainer();
