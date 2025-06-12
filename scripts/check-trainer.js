import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTrainer() {
  try {
    console.log('🔍 Checking trainer data for arti@gmail.com...\n');

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: 'arti@gmail.com' },
      select: { id: true, name: true, email: true, role: true }
    });

    if (user) {
      console.log('✅ User found:');
      console.log(`  - ID: ${user.id}`);
      console.log(`  - Name: ${user.name}`);
      console.log(`  - Email: ${user.email}`);
      console.log(`  - Role: ${user.role}`);
    } else {
      console.log('❌ User not found with email: arti@gmail.com');
      return;
    }

    // Check if trainer record exists
    const trainer = await prisma.trainers.findUnique({
      where: { email: 'arti@gmail.com' },
      select: { 
        id: true, 
        userId: true, 
        name: true, 
        email: true, 
        category: true,
        specialty: true,
        experience: true,
        price: true,
        isActive: true
      }
    });

    if (trainer) {
      console.log('\n✅ Trainer record found:');
      console.log(`  - Trainer ID: ${trainer.id}`);
      console.log(`  - User ID: ${trainer.userId}`);
      console.log(`  - Name: ${trainer.name}`);
      console.log(`  - Email: ${trainer.email}`);
      console.log(`  - Category: ${trainer.category}`);
      console.log(`  - Specialty: ${trainer.specialty}`);
      console.log(`  - Experience: ${trainer.experience}`);
      console.log(`  - Price: ${trainer.price}`);
      console.log(`  - Active: ${trainer.isActive}`);
    } else {
      console.log('\n❌ No trainer record found for arti@gmail.com');
      console.log('💡 This user needs to be added as a trainer to see their bookings');
    }

    // Check trainer bookings for this trainer
    if (trainer) {
      const bookings = await prisma.trainerBookings.findMany({
        where: { trainerId: trainer.id },
        select: {
          id: true,
          trainerId: true,
          trainerName: true,
          bookingDate: true,
          bookingTime: true,
          status: true,
          customerEmail: true
        },
        orderBy: { bookingDate: 'asc' }
      });

      console.log(`\n📅 Found ${bookings.length} bookings for this trainer:`);
      bookings.forEach(booking => {
        console.log(`  - ${booking.bookingDate} ${booking.bookingTime}: ${booking.status} (Customer: ${booking.customerEmail})`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking trainer:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTrainer();
