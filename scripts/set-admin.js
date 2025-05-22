// Script to set a user as admin
const { PrismaClient } = require('@prisma/client');

// Create a new Prisma client instance
const prisma = new PrismaClient();

// Email of the user to make admin
const userEmail = process.argv[2];

if (!userEmail) {
  console.error('Please provide a user email as an argument');
  console.error('Example: node set-admin.js user@example.com');
  process.exit(1);
}

async function setUserAsAdmin() {
  try {
    console.log(`Attempting to set user ${userEmail} as ADMIN...`);
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    
    if (!user) {
      console.error(`User with email ${userEmail} not found`);
      process.exit(1);
    }
    
    // Update the user role to ADMIN
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' },
    });
    
    console.log(`Successfully updated user ${updatedUser.email} to role: ${updatedUser.role}`);
    
  } catch (error) {
    console.error('Error updating user role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setUserAsAdmin();
