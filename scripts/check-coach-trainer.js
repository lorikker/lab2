import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkCoachTrainer() {
  try {
    console.log("🔍 Checking for COACH COACH trainer...\n");

    // Check in trainers table
    console.log("1. Checking trainers table:");
    const trainersInTable = await prisma.trainers.findMany({
      where: {
        OR: [{ name: { contains: "COACH" } }, { email: "coach@gmail.com" }],
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(`Found ${trainersInTable.length} records in trainers table:`);
    trainersInTable.forEach((trainer) => {
      console.log(`  - ID: ${trainer.id}`);
      console.log(`  - Name: ${trainer.name}`);
      console.log(`  - Email: ${trainer.email}`);
      console.log(`  - Category: ${trainer.category}`);
      console.log(`  - IsActive: ${trainer.isActive}`);
      console.log(`  - Created: ${trainer.createdAt}`);
      console.log("  ---");
    });

    // Check in approvedTrainers table
    console.log("\n2. Checking approvedTrainers table:");
    const approvedTrainers = await prisma.approvedTrainers.findMany({
      where: {
        OR: [{ name: { contains: "COACH" } }, { email: "coach@gmail.com" }],
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(
      `Found ${approvedTrainers.length} records in approvedTrainers table:`,
    );
    approvedTrainers.forEach((trainer) => {
      console.log(`  - ID: ${trainer.id}`);
      console.log(`  - Name: ${trainer.name}`);
      console.log(`  - Email: ${trainer.email}`);
      console.log(`  - Category: ${trainer.category}`);
      console.log(`  - IsActive: ${trainer.isActive}`);
      console.log(`  - Created: ${trainer.createdAt}`);
      console.log("  ---");
    });

    // Check trainer applications
    console.log("\n3. Checking trainer applications:");
    const applications = await prisma.trainerApplications.findMany({
      where: {
        OR: [{ name: { contains: "COACH" } }, { email: "coach@gmail.com" }],
      },
      orderBy: { appliedAt: "desc" },
    });

    console.log(`Found ${applications.length} applications:`);
    applications.forEach((app) => {
      console.log(`  - ID: ${app.id}`);
      console.log(`  - Name: ${app.name}`);
      console.log(`  - Email: ${app.email}`);
      console.log(`  - Category: ${app.category}`);
      console.log(`  - Status: ${app.status}`);
      console.log(`  - Applied: ${app.appliedAt}`);
      console.log(`  - Reviewed: ${app.reviewedAt}`);
      console.log("  ---");
    });

    // Test API call
    console.log("\n4. Testing /api/trainers endpoint:");
    try {
      const response = await fetch("http://localhost:3001/api/trainers");
      if (response.ok) {
        const data = await response.json();
        console.log(`API returned ${data.trainers?.length || 0} trainers`);

        const coachTrainer = data.trainers?.find(
          (t) => t.name?.includes("COACH") || t.email === "coach@gmail.com",
        );

        if (coachTrainer) {
          console.log("✅ COACH COACH found in API response:", coachTrainer);
        } else {
          console.log("❌ COACH COACH NOT found in API response");
        }
      } else {
        console.log("❌ API call failed:", response.status);
      }
    } catch (error) {
      console.log("❌ API call error:", error.message);
    }
  } catch (error) {
    console.error("❌ Error checking coach trainer:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCoachTrainer();
