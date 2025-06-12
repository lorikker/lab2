import { Metadata } from "next";
import DashboardAccessGuard from "@/app/_components/dashboard-access-guard";

export const metadata: Metadata = {
  title: "Dashboard | SixStar Fitness",
  description: "Manage your fitness journey with SixStar Fitness",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAccessGuard
      requiredRoles={["ADMIN", "TRAINER"]}
      requireAdminAccess={true}
    >
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </DashboardAccessGuard>
  );
}
