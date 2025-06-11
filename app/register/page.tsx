import type { Metadata } from "next";
import RegisterForm from "../_components/register-form";

export const metadata: Metadata = {
  title: "Register - SixStarFitness",
  description: "Create a new account on SixStarFitness",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-white pt-24 font-sans">
      <div className="flex flex-col items-start justify-center gap-3">
        <div className="flex flex-col items-center justify-center gap-8 rounded-lg border border-[#D9D9D9] bg-white p-8 shadow-sm lg:w-[450px]">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
