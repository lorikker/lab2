const { PrismaClient } = require("@prisma/client");
const { users, posts } = require("../app/lib/placeholder-data.js");
const crypto = require("crypto");

async function seedUsers(client) {
  try {
    // Hash password before seeding
    const hashedPassword = await hash(users[0].password);
    const user = await client.user.create({
      data: {
        id: users[0].id,
        email: users[0].email,
        password: hashedPassword,
        name: users[0].name,
      },
    });

    console.log(`Seeded user: ${user.name} with email: ${user.email}`);
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

async function hash(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(8).toString("hex");

    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ":" + derivedKey.toString("hex"));
    });
  });
}

async function seedPosts(client) {
  try {
    const insertedPosts = await client.post.createMany({
      data: posts,
    });

    console.log(`Seeded ${insertedPosts.count} posts`);
  } catch (error) {
    console.error("Error seeding posts:", error);
    throw error;
  }
}

async function main() {
  const client = new PrismaClient();

  await seedUsers(client);
  await seedPosts(client);

  await client.$disconnect();
  // stop the script from hanging
  process.exit(0);
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err,
  );
  process.exit(1);
});
