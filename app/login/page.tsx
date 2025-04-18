import type { Metadata } from "next";
import LoginForm from "../_components/login-form";
import { HomePageButton } from "../_components/route-buttons";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 font-sans">
      <div className="flex flex-col items-start justify-center gap-3">
        <HomePageButton />
        <div className="flex flex-col items-center justify-center gap-8 rounded-lg border border-neutral-200 bg-white pt-10 shadow-sm lg:w-[400px]">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
