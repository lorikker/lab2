import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateMembershipNames() {
  try {
    console.log('Starting to update membership names...');

    // Get all memberships without names
    const memberships = await prisma.memberships.findMany({
      where: {
        name: null
      },
      include: {
        user: true
      }
    });

    console.log(`Found ${memberships.length} memberships without names`);

    // Update each membership with user name
    for (const membership of memberships) {
      if (membership.user?.name) {
        await prisma.memberships.update({
          where: { id: membership.id },
          data: { name: membership.user.name }
        });
        console.log(`Updated membership ${membership.id} with name: ${membership.user.name}`);
      }
    }

    // Get all paid memberships without names
    const paidMemberships = await prisma.paidMemberships.findMany({
      where: {
        name: null
      },
      include: {
        user: true
      }
    });

    console.log(`Found ${paidMemberships.length} paid memberships without names`);

    // Update each paid membership with user name
    for (const paidMembership of paidMemberships) {
      if (paidMembership.user?.name) {
        await prisma.paidMemberships.update({
          where: { id: paidMembership.id },
          data: { name: paidMembership.user.name }
        });
        console.log(`Updated paid membership ${paidMembership.id} with name: ${paidMembership.user.name}`);
      }
    }

    console.log('✅ Successfully updated all membership names!');
  } catch (error) {
    console.error('❌ Error updating membership names:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateMembershipNames();
