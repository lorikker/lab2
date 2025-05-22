import { db } from "@/db";

export async function fetchPostById(id: string) {
  try {
    const data = await db.post.findUnique({
      where: { id },
    });

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch post.");
  }
}

export async function fetchAllPosts() {
  try {
    // Artificially delay a reponse for demo purposes.
    console.log("Fetching revenue data...");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("Revenue data fetched!");

    const data = await db.post.findMany({
      orderBy: { createdAt: "desc" },
    });

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch posts.");
  }
}

export async function fetchPostsCount() {
  try {
    // Artificially delay a reponse for demo purposes.
    console.log("Fetching posts count...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Posts count fetched!");

    const data = await db.post.count();

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch posts count.");
  }
}

export async function fetchUsersCount() {
  try {
    // Artificially delay a reponse for demo purposes.
    console.log("Fetching users count...");
    await new Promise((resolve) => setTimeout(resolve, 4000));
    console.log("Users count fetched!");

    const data = await db.user.count();

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch users count.");
  }
}

export async function fetchAllUsers() {
  try {
    console.log("Fetching all users...");

    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    console.log("Users fetched successfully");
    return users;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch users.");
  }
}
