import { Metadata } from "next";
import UsersTable from "@/app/_components/dashboard/users-table";
import { Suspense } from "react";
import { UserGroupIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "User Management | SixStar Fitness",
};

export default function UsersPage() {
  return (
    <main className="p-4 md:p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
      </div>
      
      <div className="mt-4 rounded-md bg-white p-6 shadow">
        <div className="flex items-center gap-2">
          <UserGroupIcon className="h-6 w-6 text-gray-600" />
          <h2 className="text-xl font-medium text-gray-900">All Users</h2>
        </div>
        
        <p className="mt-2 text-sm text-gray-600">
          Manage user roles by selecting a new role and clicking Update. Changes are applied immediately.
        </p>
        
        <Suspense fallback={<div className="mt-6 text-center">Loading users...</div>}>
          <UsersTable />
        </Suspense>
      </div>
    </main>
  );
}
