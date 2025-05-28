import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkLorikUser() {
  try {
    console.log('🔍 Checking lorik@gmail.com user...\n');

    // Check user
    const user = await prisma.user.findUnique({
      where: { email: 'lorik@gmail.com' }
    });
    
    if (user) {
      console.log('✅ User found:', {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      });

      // Check if this user already has trainer records
      const existingTrainers = await prisma.trainers.findMany({
        where: { userId: user.id }
      });

      console.log(`\n📋 Existing trainer records for this user: ${existingTrainers.length}`);
      existingTrainers.forEach(trainer => {
        console.log(`  - Name: ${trainer.name}`);
        console.log(`  - Email: ${trainer.email}`);
        console.log(`  - Category: ${trainer.category}`);
        console.log(`  - IsActive: ${trainer.isActive}`);
        console.log('  ---');
      });

      // Check approved trainers
      const existingApprovedTrainers = await prisma.approvedTrainers.findMany({
        where: { userId: user.id }
      });

      console.log(`\n📋 Existing approved trainer records for this user: ${existingApprovedTrainers.length}`);
      existingApprovedTrainers.forEach(trainer => {
        console.log(`  - Name: ${trainer.name}`);
        console.log(`  - Email: ${trainer.email}`);
        console.log(`  - Category: ${trainer.category}`);
        console.log(`  - IsActive: ${trainer.isActive}`);
        console.log('  ---');
      });

    } else {
      console.log('❌ User not found');
    }

  } catch (error) {
    console.error('❌ Error checking user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLorikUser();
