import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Dashboard | SixStar Fitness",
  description: "Manage your fitness journey with SixStar Fitness",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col pt-16">{children}</div>
    </div>
  );
}
