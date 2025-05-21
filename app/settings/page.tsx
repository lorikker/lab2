import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "../_components/button";

export const metadata = {
  title: "Settings - FitnessHub",
  description: "Manage your account settings",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-start bg-white pt-24 font-sans">
      <div className="container max-w-4xl px-4">
        <h1 className="mb-8 text-3xl font-bold text-[#2A2A2A]">Settings</h1>
        
        <div className="mb-8 rounded-lg border border-[#D9D9D9] bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-[#2A2A2A]">Account Settings</h2>
          
          <div className="mb-6 space-y-4">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#2A2A2A]">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full rounded-md border border-[#D9D9D9] p-2 focus:border-[#D5FC51] focus:outline-none focus:ring-1 focus:ring-[#D5FC51]"
                defaultValue={session.user?.name || ""}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#2A2A2A]">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full rounded-md border border-[#D9D9D9] p-2 focus:border-[#D5FC51] focus:outline-none focus:ring-1 focus:ring-[#D5FC51]"
                defaultValue={session.user?.email || ""}
              />
            </div>
          </div>
          
          <h2 className="mb-6 text-xl font-semibold text-[#2A2A2A]">Password</h2>
          
          <div className="mb-6 space-y-4">
            <div>
              <label htmlFor="current-password" className="mb-2 block text-sm font-medium text-[#2A2A2A]">
                Current Password
              </label>
              <input
                type="password"
                id="current-password"
                className="w-full rounded-md border border-[#D9D9D9] p-2 focus:border-[#D5FC51] focus:outline-none focus:ring-1 focus:ring-[#D5FC51]"
              />
            </div>
            
            <div>
              <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-[#2A2A2A]">
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                className="w-full rounded-md border border-[#D9D9D9] p-2 focus:border-[#D5FC51] focus:outline-none focus:ring-1 focus:ring-[#D5FC51]"
              />
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-[#2A2A2A]">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="w-full rounded-md border border-[#D9D9D9] p-2 focus:border-[#D5FC51] focus:outline-none focus:ring-1 focus:ring-[#D5FC51]"
              />
            </div>
          </div>
          
          <h2 className="mb-6 text-xl font-semibold text-[#2A2A2A]">Notification Preferences</h2>
          
          <div className="mb-6 space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="email-notifications"
                className="h-4 w-4 rounded border-[#D9D9D9] text-[#D5FC51] focus:ring-[#D5FC51]"
                defaultChecked
              />
              <label htmlFor="email-notifications" className="ml-2 block text-sm text-[#2A2A2A]">
                Receive email notifications
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="marketing-emails"
                className="h-4 w-4 rounded border-[#D9D9D9] text-[#D5FC51] focus:ring-[#D5FC51]"
                defaultChecked
              />
              <label htmlFor="marketing-emails" className="ml-2 block text-sm text-[#2A2A2A]">
                Receive marketing emails
              </label>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button className="bg-[#D5FC51] text-[#2A2A2A] hover:opacity-90">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
