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

// This is temporary
export type State = {
  errors?: {
    title?: string[];
    content?: string[];
  };
  message?: string | null;
};
