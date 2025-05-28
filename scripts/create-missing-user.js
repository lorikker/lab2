import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createMissingUser() {
  try {
    console.log('Creating missing user for trainer application...');

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (existingUser) {
      console.log('User already exists:', existingUser);
      return;
    }

    // Create the user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test Trainer',
        role: 'USER'
      }
    });

    console.log('✅ User created successfully:', user);

  } catch (error) {
    console.error('❌ Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createMissingUser();
