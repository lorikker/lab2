import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkRealApplications() {
  try {
    console.log('🔍 Checking for real pending applications...\n');

    // Get all pending applications
    const pendingApplications = await prisma.trainerApplications.findMany({
      where: { status: 'pending' },
      orderBy: { appliedAt: 'desc' }
    });
    
    console.log(`Found ${pendingApplications.length} pending applications:`);
    
    // Filter out test applications (created by scripts)
    const realApplications = pendingApplications.filter(app => 
      !app.email.includes('example.com') && 
      !app.email.includes('test') &&
      app.name !== 'John Smith' &&
      app.name !== 'Maria Rodriguez'
    );
    
    console.log(`\nReal applications (not created by scripts): ${realApplications.length}`);
    
    realApplications.forEach(app => {
      console.log(`  - ID: ${app.id}`);
      console.log(`  - Name: ${app.name}`);
      console.log(`  - Email: ${app.email}`);
      console.log(`  - Category: ${app.category}`);
      console.log(`  - Specialty: ${app.specialty}`);
      console.log(`  - Applied: ${app.appliedAt}`);
      console.log('  ---');
    });

    // Also check all applications to see which ones might be real
    console.log('\n📋 All pending applications:');
    pendingApplications.forEach(app => {
      const isTest = app.email.includes('example.com') || 
                     app.email.includes('test') ||
                     app.name === 'John Smith' ||
                     app.name === 'Maria Rodriguez';
      
      console.log(`  ${isTest ? '🤖' : '👤'} ${app.name} (${app.email}) - ${app.category}`);
    });

    if (realApplications.length === 0) {
      console.log('\n❌ No real pending applications found.');
      console.log('💡 Please submit a new trainer application through the website UI.');
    } else {
      console.log('\n✅ Found real applications that need approval!');
    }

  } catch (error) {
    console.error('❌ Error checking applications:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRealApplications();
