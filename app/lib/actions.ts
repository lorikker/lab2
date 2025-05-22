"use server";

import z from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";

const FormSchema = z.object({
  id: z.string(),
  createdById: z.string(),
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters long.",
    })
    .max(30, {
      message: "Title must be less than 30 characters long.",
    }),
  content: z
    .string()
    .min(3, {
      message: "Content must be at least 3 characters long.",
    })
    .max(1000, {
      message: "Content must be less than 1000 characters long.",
    }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const CreatePost = FormSchema.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
  createdById: true,
});

const UpdatePost = FormSchema.omit({
  id: true,
  createdById: true,
  updatedAt: true,
  createdAt: true,
});

export async function createPost(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = CreatePost.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Post.",
    };
  }
  const { title, content } = validatedFields.data;

  try {
    await db.post.create({
      data: { title, content, createdById: id },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { message: "Database Error: Failed to Create Post." };
  }

  revalidatePath("/dashboard/posts");
  redirect("/dashboard/posts");
}

export async function updatePost(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdatePost.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Post.",
    };
  }

  const { title, content } = validatedFields.data;

  try {
    await db.post.update({
      where: { id },
      data: { title, content },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { message: "Database Error: Failed to Update Post." };
  }

  revalidatePath("/dashboard/posts");
  redirect("/dashboard/posts");
}

export async function deletePost(id: string) {
  // test error page
  throw new Error("Failed to Delete Post");

  try {
    await db.post.delete({ where: { id } });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { message: "Database Error: Failed to Delete Post." };
  }

  revalidatePath("/dashboard/posts");
  redirect("/dashboard/posts");
}

// User role schema
const UserRoleSchema = z.object({
  userId: z.string(),
  role: z.enum(["USER", "TRAINER", "ADMIN"]),
});

// User update schema
const UserUpdateSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

// User delete schema
const UserDeleteSchema = z.object({
  userId: z.string(),
});

export async function updateUserRole(
  prevState: UserRoleState,
  formData: FormData,
) {
  const validatedFields = UserRoleSchema.safeParse({
    userId: formData.get("userId"),
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input. Failed to update user role.",
    };
  }

  const { userId, role } = validatedFields.data;

  try {
    await db.user.update({
      where: { id: userId },
      data: { role },
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return {
      message: "Database Error: Failed to update user role.",
      success: false,
    };
  }

  revalidatePath("/dashboard/users");
  return {
    message: `User role updated to ${role} successfully.`,
    success: true,
  };
}

export async function updateUserInfo(
  prevState: UserUpdateState,
  formData: FormData,
) {
  const validatedFields = UserUpdateSchema.safeParse({
    userId: formData.get("userId"),
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input. Failed to update user information.",
      success: false,
    };
  }

  const { userId, name, email } = validatedFields.data;

  try {
    // Check if email is already taken by another user
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== userId) {
      return {
        message: "Email is already taken by another user.",
        success: false,
      };
    }

    await db.user.update({
      where: { id: userId },
      data: { name, email },
    });
  } catch (error) {
    console.error("Error updating user information:", error);
    return {
      message: "Database Error: Failed to update user information.",
      success: false,
    };
  }

  revalidatePath("/dashboard/users");
  return {
    message: "User information updated successfully.",
    success: true,
  };
}

export async function deleteUser(
  prevState: UserDeleteState,
  formData: FormData,
) {
  const validatedFields = UserDeleteSchema.safeParse({
    userId: formData.get("userId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input. Failed to delete user.",
      success: false,
    };
  }

  const { userId } = validatedFields.data;

  try {
    await db.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      message: "Database Error: Failed to delete user.",
      success: false,
    };
  }

  revalidatePath("/dashboard/users");
  return {
    message: "User deleted successfully.",
    success: true,
  };
}

// This is temporary
export type State = {
  errors?: {
    title?: string[];
    content?: string[];
  };
  message?: string | null;
};

// User role state
export type UserRoleState = {
  errors?: {
    userId?: string[];
    role?: string[];
  };
  message?: string | null;
  success?: boolean;
};

// User update state
export type UserUpdateState = {
  errors?: {
    userId?: string[];
    name?: string[];
    email?: string[];
  };
  message?: string | null;
  success?: boolean;
};

// User delete state
export type UserDeleteState = {
  errors?: {
    userId?: string[];
  };
  message?: string | null;
  success?: boolean;
};
