import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeftIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import UsersTable from "@/app/_components/dashboard/users-table";
import { fetchUsersCount } from "@/app/lib/data";

export default async function UsersPage() {
  const totalUsers = await fetchUsersCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              href="/admin"
              className="mr-4 p-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
              <p className="text-gray-400 text-lg">Manage user accounts, roles, and permissions</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Total Users</p>
            <p className="text-2xl font-bold text-white">{totalUsers}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <UserGroupIcon className="h-6 w-6 text-[#D5FC51]" />
              <h3 className="text-xl font-bold text-white">All Users</h3>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Manage user roles by selecting a new role and clicking Update. Changes are applied immediately.
            </p>
          </div>

          <div className="p-6">
            <Suspense fallback={
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D5FC51] mx-auto mb-4"></div>
                <p className="text-gray-400">Loading users...</p>
              </div>
            }>
              <UsersTable />
            </Suspense>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/admin"
            className="inline-flex items-center bg-[#D5FC51] text-[#2A2A2A] font-bold px-6 py-3 rounded-xl hover:bg-[#D5FC51]/90 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
