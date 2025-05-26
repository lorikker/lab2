// This script makes a user an admin by email
// Run with: node scripts/make-admin.js user@example.com

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeAdmin() {
  const email = process.argv[2];
  
  if (!email) {
    console.error('Please provide an email address');
    console.error('Usage: node scripts/make-admin.js user@example.com');
    process.exit(1);
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }
    
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });
    
    console.log(`User ${updatedUser.email} is now an admin`);
  } catch (error) {
    console.error('Error updating user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
