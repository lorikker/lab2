import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";

import { scrypt } from "crypto";
import { env } from "./env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    id: string;
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: "Email", type: "text", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      authorize: async (credentials) => {
        let user = null;

        const { email, password } = credentials as {
          email?: string;
          password?: string;
        };

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        try {
          user = await db.user.findUnique({
            where: {
              email,
            },
            select: {
              id: true,
              email: true,
              password: true,
              name: true,
            },
          });

          if (!user || !user.password) {
            console.log("User not found");
            return null;
          }

          const passwordsMatch = await verify(password, user.password);

          console.log("passwordsMatch", passwordsMatch);

          if (passwordsMatch) {
            console.log("User found:", user);
            return user;
          }

          return null;
        } catch (error) {
          console.error("Failed to fetch user:", error);
          throw new Error("Failed to fetch user.");
        }
      },
    }),
  ],
  adapter: PrismaAdapter(db),
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
});

async function verify(password: string, hash: string) {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key == derivedKey.toString("hex"));
    });
  });
}
