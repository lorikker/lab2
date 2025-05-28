import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugTrainerApproval() {
  try {
    console.log('🔍 Debugging trainer approval system...\n');

    // 1. Check pending applications
    console.log('1. Checking pending trainer applications:');
    const pendingApplications = await prisma.trainerApplications.findMany({
      where: { status: 'pending' },
      orderBy: { appliedAt: 'desc' }
    });
    
    console.log(`Found ${pendingApplications.length} pending applications:`);
    pendingApplications.forEach(app => {
      console.log(`  - ID: ${app.id}`);
      console.log(`  - Name: ${app.name}`);
      console.log(`  - Email: ${app.email}`);
      console.log(`  - UserId: ${app.userId}`);
      console.log(`  - Category: ${app.category}`);
      console.log(`  - Status: ${app.status}`);
      console.log(`  - Applied: ${app.appliedAt}`);
      console.log('  ---');
    });

    // 2. Check if users exist for these applications
    console.log('\n2. Checking if users exist for pending applications:');
    for (const app of pendingApplications) {
      let user = null;
      
      if (app.userId.includes('@')) {
        user = await prisma.user.findUnique({
          where: { email: app.userId }
        });
      } else {
        user = await prisma.user.findUnique({
          where: { id: app.userId }
        });
      }
      
      if (user) {
        console.log(`  ✅ User found for ${app.name}: ${user.email} (Role: ${user.role})`);
      } else {
        console.log(`  ❌ User NOT found for ${app.name} (UserId: ${app.userId})`);
        
        // Create missing user
        console.log(`  🔧 Creating missing user...`);
        const newUser = await prisma.user.create({
          data: {
            email: app.email,
            name: app.name,
            role: 'USER'
          }
        });
        console.log(`  ✅ Created user: ${newUser.email}`);
        
        // Update application with correct userId
        await prisma.trainerApplications.update({
          where: { id: app.id },
          data: { userId: newUser.id }
        });
        console.log(`  ✅ Updated application userId to: ${newUser.id}`);
      }
    }

    // 3. Check admin notifications
    console.log('\n3. Checking admin notifications:');
    const adminNotifications = await prisma.notifications.findMany({
      where: { 
        isAdmin: true,
        type: 'trainer_application'
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log(`Found ${adminNotifications.length} admin notifications:`);
    adminNotifications.forEach(notif => {
      console.log(`  - ID: ${notif.id}`);
      console.log(`  - Title: ${notif.title}`);
      console.log(`  - UserId: ${notif.userId}`);
      console.log(`  - Read: ${notif.isRead}`);
      console.log(`  - Created: ${notif.createdAt}`);
      console.log('  ---');
    });

    // 4. Check existing trainers
    console.log('\n4. Checking existing trainers:');
    const trainers = await prisma.trainers.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Found ${trainers.length} active trainers:`);
    trainers.forEach(trainer => {
      console.log(`  - Name: ${trainer.name}`);
      console.log(`  - Category: ${trainer.category}`);
      console.log(`  - Email: ${trainer.email}`);
      console.log('  ---');
    });

    console.log('\n✅ Debug complete!');

  } catch (error) {
    console.error('❌ Error during debug:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugTrainerApproval();
