"use server";

import { db } from "@/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// User profile update schema
const UserProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export type ProfileUpdateState = {
  errors?: {
    name?: string[];
    email?: string[];
  };
  message?: string;
  success?: boolean;
};

export async function updateUserProfile(
  prevState: ProfileUpdateState,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      message: "You must be logged in to update your profile.",
      success: false,
    };
  }

  const validatedFields = UserProfileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid input. Failed to update profile.",
      success: false,
    };
  }

  const { name, email } = validatedFields.data;

  try {
    // Check if email is already taken by another user
    if (email !== session.user.email) {
      const existingUser = await db.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== session.user.id) {
        return {
          message: "Email is already taken by another user.",
          success: false,
        };
      }
    }

    // Update the user in the database
    await db.user.update({
      where: { id: session.user.id },
      data: { name, email },
    });

    // Force a full page refresh to update the session data
    revalidatePath("/settings", "layout");
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      message: "Database Error: Failed to update profile.",
      success: false,
    };
  }

  // Redirect to refresh the page and get the updated session
  redirect("/settings");
}
