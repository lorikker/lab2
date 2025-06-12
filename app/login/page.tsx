import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LoginForm from "../_components/login-form";

export const metadata: Metadata = {
  title: "Login",
};

export default async function LoginPage() {
  // Check if user is already logged in
  const session = await auth();

  if (session) {
    // User is already logged in, redirect to home
    redirect("/");
  }

  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-white pt-8 font-sans">
      <div className="flex flex-col items-start justify-center gap-3">
        <div className="flex flex-col items-center justify-center gap-8 rounded-lg border border-[#D9D9D9] bg-white p-8 shadow-sm lg:w-[450px]">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
