import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCurrentTables() {
  try {
    console.log('🔍 Checking current database tables...\n');
    
    // Check existing tables
    const tables = [
      { name: 'users', model: 'user' },
      { name: 'posts', model: 'post' },
      { name: 'accounts', model: 'account' },
      { name: 'sessions', model: 'session' },
      { name: 'users_memberships', model: 'usersMemberships' },
      { name: 'orders_memberships', model: 'ordersMemberships' },
      { name: 'memberships', model: 'memberships' },
      { name: 'paidmemberships', model: 'paidMemberships' }
    ];

    for (const table of tables) {
      try {
        let count;
        switch (table.model) {
          case 'user':
            count = await prisma.user.count();
            break;
          case 'post':
            count = await prisma.post.count();
            break;
          case 'account':
            count = await prisma.account.count();
            break;
          case 'session':
            count = await prisma.session.count();
            break;
          case 'usersMemberships':
            count = await prisma.usersMemberships.count();
            break;
          case 'ordersMemberships':
            count = await prisma.ordersMemberships.count();
            break;
          case 'memberships':
            count = await prisma.memberships.count();
            break;
          case 'paidMemberships':
            count = await prisma.paidMemberships.count();
            break;
          default:
            count = 'Unknown';
        }
        console.log(`✅ ${table.name} table EXISTS with ${count} records`);
      } catch (error) {
        console.log(`❌ ${table.name} table does NOT exist`);
        console.log(`   Error: ${error.message.split('\n')[0]}`);
      }
    }
    
  } catch (error) {
    console.error('❌ General error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentTables();
