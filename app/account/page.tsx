import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserCircleIcon, EnvelopeIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { LogoutButton } from "../_components/route-buttons";

export const metadata = {
  title: "Account - FitnessHub",
  description: "View and manage your account details",
};

export default async function AccountPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-start bg-white pt-24 font-sans">
      <div className="container max-w-4xl px-4">
        <h1 className="mb-8 text-3xl font-bold text-[#2A2A2A]">My Account</h1>
        
        <div className="mb-8 rounded-lg border border-[#D9D9D9] bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center">
            <div className="mr-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#D5FC51]">
              <UserCircleIcon className="h-12 w-12 text-[#2A2A2A]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#2A2A2A]">
                {session.user?.name || "User"}
              </h2>
              <p className="text-[#2A2A2A]">Member</p>
            </div>
          </div>

          <div className="mb-6 border-b border-[#D9D9D9] pb-6">
            <h3 className="mb-4 text-lg font-semibold text-[#2A2A2A]">Account Information</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <EnvelopeIcon className="mr-3 h-5 w-5 text-[#2A2A2A]" />
                <span className="text-[#2A2A2A]">{session.user?.email}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="mr-3 h-5 w-5 text-[#2A2A2A]" />
                <span className="text-[#2A2A2A]">Member since: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="mb-6 border-b border-[#D9D9D9] pb-6">
            <h3 className="mb-4 text-lg font-semibold text-[#2A2A2A]">Membership</h3>
            <div className="rounded-md bg-[#D9D9D9] p-4">
              <p className="font-medium text-[#2A2A2A]">Premium Plan</p>
              <p className="text-sm text-[#2A2A2A]">Your membership is active until December 31, 2023</p>
            </div>
          </div>

          <div className="flex justify-end">
            <LogoutButton />
          </div>
        </div>
      </div>
    </main>
  );
}
