import { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  UserGroupIcon,
  UserIcon,
  ChartBarIcon,
  Squares2X2Icon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Dashboard | SixStar Fitness",
};

export default async function DashboardPage() {
  const session = await auth();

  // Redirect if not logged in
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  // Check if user is admin
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { role: true, name: true, email: true }
  });

  // Redirect users who are not admin or trainer to home page
  if (!user || (user.role !== 'ADMIN' && user.role !== 'TRAINER')) {
    redirect("/");
  }

  return (
    <main className="p-4 md:p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* User Management Card - For all users */}
        <Link
          href="/dashboard/users"
          className="rounded-md bg-white p-6 shadow transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-2">
            <UserGroupIcon className="h-6 w-6 text-[#D5FC51]" />
            <h2 className="text-xl font-medium text-gray-900">
              User Management
            </h2>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            View and manage user roles and permissions.
          </p>
        </Link>

        {/* Profile Card - For all users */}
        <Link
          href="/account"
          className="rounded-md bg-white p-6 shadow transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-2">
            <UserIcon className="h-6 w-6 text-[#D5FC51]" />
            <h2 className="text-xl font-medium text-gray-900">My Profile</h2>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            View and update your personal information.
          </p>
        </Link>

        {/* Reports Card - For all users */}
        <Link
          href="/dashboard/reports"
          className="rounded-md bg-white p-6 shadow transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-2">
            <ChartBarIcon className="h-6 w-6 text-[#D5FC51]" />
            <h2 className="text-xl font-medium text-gray-900">Reports</h2>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            View analytics and reports for the fitness center.
          </p>
        </Link>

        {/* Workouts Card - For all users */}
        <Link
          href="/workouts"
          className="rounded-md bg-white p-6 shadow transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-2">
            <Squares2X2Icon className="h-6 w-6 text-[#D5FC51]" />
            <h2 className="text-xl font-medium text-gray-900">Workouts</h2>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Browse and manage your workout routines.
          </p>
        </Link>
      </div>
    </main>
  );
}
