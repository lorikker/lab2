import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createApprovedTrainers() {
  try {
    console.log('Creating trainer records for approved applications...');

    // Get all approved applications
    const approvedApplications = await prisma.trainerApplications.findMany({
      where: { status: 'approved' }
    });

    console.log(`Found ${approvedApplications.length} approved applications`);

    for (const application of approvedApplications) {
      console.log(`Processing application for ${application.name}...`);

      // Find the user
      let user;
      if (application.userId.includes('@')) {
        user = await prisma.user.findUnique({
          where: { email: application.userId }
        });
      } else {
        user = await prisma.user.findUnique({
          where: { id: application.userId }
        });
      }

      if (!user) {
        console.log(`❌ User not found for application ${application.id}`);
        continue;
      }

      // Check if trainer already exists
      const existingTrainer = await prisma.trainers.findUnique({
        where: { userId: user.id }
      });

      if (existingTrainer) {
        console.log(`✅ Trainer already exists for ${application.name}`);
        continue;
      }

      // Update user role to TRAINER
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'TRAINER' }
      });

      // Create trainer record
      const trainer = await prisma.trainers.create({
        data: {
          userId: user.id,
          applicationId: application.id,
          name: application.name,
          email: application.email,
          phone: application.phone,
          category: application.category,
          specialty: application.specialty,
          experience: application.experience,
          price: application.price,
          description: application.description,
          qualifications: application.qualifications,
          availability: application.availability,
          photoUrl: application.photoUrl,
          approvedBy: application.reviewedBy || 'system'
        }
      });

      // Create approved trainer record
      const approvedTrainer = await prisma.approvedTrainers.create({
        data: {
          userId: user.id,
          applicationId: application.id,
          name: application.name,
          email: application.email,
          phone: application.phone,
          category: application.category,
          specialty: application.specialty,
          experience: application.experience,
          price: application.price,
          description: application.description,
          qualifications: application.qualifications,
          availability: application.availability,
          photoUrl: application.photoUrl,
          rating: 5.0,
          isActive: true,
          approvedBy: application.reviewedBy || 'system'
        }
      });

      console.log(`✅ Created trainer records for ${application.name}`);
    }

    console.log('✅ All approved trainers created successfully!');

  } catch (error) {
    console.error('❌ Error creating trainers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createApprovedTrainers();
