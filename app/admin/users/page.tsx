"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  UserIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!session) {
      router.push("/login");
      return;
    }

    fetchUsers();
  }, [session, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <ShieldCheckIcon className="h-5 w-5 text-red-500" />;
      case "TRAINER":
        return <UserGroupIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <UserIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "TRAINER":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#D5FC51]"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] pt-20">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-3 text-5xl font-light text-[#2A2A2A]">Users</h1>
          <p className="text-xl text-[#D9D9D9] font-light">
            Manage user accounts and roles
          </p>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-xl border border-[#D9D9D9]/50 bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#D9D9D9]/50">
              <thead className="bg-[#F5F5F5]">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-sm font-medium text-[#2A2A2A] uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-sm font-medium text-[#2A2A2A] uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-sm font-medium text-[#2A2A2A] uppercase tracking-wider"
                  >
                    Joined
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-right text-sm font-medium text-[#2A2A2A] uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9D9D9]/50 bg-white">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#F5F5F5]">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-[#D5FC51]/20 flex items-center justify-center">
                          {user.name ? (
                            <span className="text-[#2A2A2A] font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          ) : (
                            <UserIcon className="h-5 w-5 text-[#2A2A2A]" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-[#2A2A2A]">
                            {user.name || "No name"}
                          </div>
                          <div className="text-sm text-[#2A2A2A]/70">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="mr-2">{getRoleIcon(user.role)}</div>
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getRoleBadgeClass(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#2A2A2A]/70">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          // Implement edit functionality
                          console.log("Edit user:", user.id);
                        }}
                        className="mr-3 text-[#D5FC51] hover:text-[#2A2A2A]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          // Implement role change functionality
                          console.log("Change role for user:", user.id);
                        }}
                        className="text-[#D5FC51] hover:text-[#2A2A2A]"
                      >
                        Change Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}