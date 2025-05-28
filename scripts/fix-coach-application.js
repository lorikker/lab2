import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixCoachApplication() {
  try {
    console.log('🔧 Fixing COACH COACH application...\n');

    // First, create a new user for COACH COACH
    const newUser = await prisma.user.create({
      data: {
        email: 'coach@gmail.com',
        name: 'COACH COACH',
        role: 'USER'
      }
    });

    console.log('✅ Created new user for COACH COACH:', newUser);

    // Update the application to use the new user ID
    const application = await prisma.trainerApplications.findFirst({
      where: {
        name: 'COACH COACH',
        email: 'coach@gmail.com'
      }
    });

    if (application) {
      // Update application to use new user ID and reset status to pending
      await prisma.trainerApplications.update({
        where: { id: application.id },
        data: {
          userId: newUser.id,
          status: 'pending',
          reviewedAt: null,
          reviewedBy: null,
          adminNotes: null
        }
      });

      console.log('✅ Updated application to use new user ID and reset to pending');

      // Create a new notification for admin
      await prisma.notifications.create({
        data: {
          userId: 'lorik@gmail.com',
          type: 'trainer_application',
          title: 'New Trainer Application (Fixed)',
          message: `${application.name} has submitted a trainer application for ${application.specialty} (Fixed application).`,
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

      console.log('✅ Created new notification for admin');

      console.log('\n🎉 COACH COACH application fixed!');
      console.log('📋 Details:');
      console.log(`   - New User ID: ${newUser.id}`);
      console.log(`   - Application ID: ${application.id}`);
      console.log(`   - Status: pending`);
      console.log('\n📝 Next steps:');
      console.log('1. Go to dashboard as admin (lorik@gmail.com)');
      console.log('2. Check notifications for the fixed application');
      console.log('3. Approve the application');
      console.log('4. COACH COACH should now appear on trainers page');

    } else {
      console.log('❌ Application not found');
    }

  } catch (error) {
    if (error.code === 'P2002') {
      console.log('❌ User with email coach@gmail.com already exists');
      
      // Find existing user
      const existingUser = await prisma.user.findUnique({
        where: { email: 'coach@gmail.com' }
      });

      if (existingUser && existingUser.email !== 'lorik@gmail.com') {
        console.log('✅ Using existing coach@gmail.com user:', existingUser);
        
        // Update application to use this user
        const application = await prisma.trainerApplications.findFirst({
          where: {
            name: 'COACH COACH',
            email: 'coach@gmail.com'
          }
        });

        if (application) {
          await prisma.trainerApplications.update({
            where: { id: application.id },
            data: {
              userId: existingUser.id,
              status: 'pending',
              reviewedAt: null,
              reviewedBy: null,
              adminNotes: null
            }
          });
          console.log('✅ Updated application to use existing user and reset to pending');
        }
      }
    } else {
      console.error('❌ Error fixing application:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

fixCoachApplication();
