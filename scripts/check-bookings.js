import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkBookings() {
  try {
    console.log('🔍 Checking trainer bookings for arti@gmail.com...\n');

    // Get all trainer bookings to see the structure
    const allBookings = await prisma.trainerBookings.findMany({
      select: {
        id: true,
        userId: true,
        trainerId: true,
        trainerName: true,
        bookingDate: true,
        bookingTime: true,
        status: true,
        customerEmail: true
      },
      orderBy: { bookingDate: 'asc' }
    });

    console.log(`📋 Found ${allBookings.length} total trainer bookings:`);
    allBookings.forEach((booking, index) => {
      console.log(`  ${index + 1}. Booking ID: ${booking.id}`);
      console.log(`     - Trainer ID: ${booking.trainerId}`);
      console.log(`     - Trainer Name: ${booking.trainerName}`);
      console.log(`     - Customer Email: ${booking.customerEmail}`);
      console.log(`     - Date: ${booking.bookingDate} ${booking.bookingTime}`);
      console.log(`     - Status: ${booking.status}`);
      console.log('');
    });

    // Check if there are any trainers in the trainers table
    const trainers = await prisma.trainers.findMany({
      select: {
        id: true,
        userId: true,
        name: true,
        email: true,
        category: true
      }
    });

    console.log(`\n👥 Found ${trainers.length} trainers in trainers table:`);
    trainers.forEach((trainer, index) => {
      console.log(`  ${index + 1}. Trainer ID: ${trainer.id}`);
      console.log(`     - User ID: ${trainer.userId}`);
      console.log(`     - Name: ${trainer.name}`);
      console.log(`     - Email: ${trainer.email}`);
      console.log(`     - Category: ${trainer.category}`);
      console.log('');
    });

    // Check if arti@gmail.com is in the users table
    const user = await prisma.user.findUnique({
      where: { email: 'arti@gmail.com' },
      select: { id: true, name: true, email: true, role: true }
    });

    if (user) {
      console.log(`\n✅ User arti@gmail.com found:`);
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Name: ${user.name}`);
      console.log(`   - Role: ${user.role}`);
    } else {
      console.log(`\n❌ User arti@gmail.com not found`);
    }

  } catch (error) {
    console.error('❌ Error checking bookings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBookings();
