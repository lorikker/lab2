import { ShieldCheckIcon, UserGroupIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import { LogoutButton } from "../../_components/route-buttons";
import { Suspense } from "react";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-gray-50 pt-8 font-sans">
      <div className="flex flex-col items-start justify-center gap-3">
        <div className="flex flex-col items-center justify-center gap-8 rounded-lg border border-neutral-200 bg-white px-12 py-10 shadow-sm lg:w-[400px]">
          <h1 className="text-center text-2xl font-bold text-indigo-900 lg:text-4xl">
            Dashboard
          </h1>
          <span className="flex items-center gap-2 text-indigo-900">
            <ShieldCheckIcon className="h-7 w-7 text-green-500" />
            <span>This page is protected!</span>
          </span>

          <div className="flex w-full flex-col items-center justify-center gap-4">
            <Suspense fallback={<CountCardSkeleton />}>
              <CountUsers />
            </Suspense>
            <Suspense fallback={<CountCardSkeleton />}>
              <CountMemberships />
            </Suspense>
          </div>
        </div>
        <div className="self-end">
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}

const CountCardSkeleton = () => {
  return (
    <div className="flex w-full animate-pulse items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-6">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-300"></div>
        <div className="space-y-2">
          <div className="h-4 w-16 rounded bg-gray-300"></div>
          <div className="h-6 w-12 rounded bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
};

const CountUsers = async () => {
  const count = await db.user.count();
  return (
    <div className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-6 shadow-sm">
      <div className="flex items-center gap-3">
        <UserGroupIcon className="h-8 w-8 text-[#D5FC51]" />
        <div>
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{count}</p>
        </div>
      </div>
    </div>
  );
};

const CountMemberships = async () => {
  const count = await db.memberships.count();
  return (
    <div className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-6 shadow-sm">
      <div className="flex items-center gap-3">
        <CreditCardIcon className="h-8 w-8 text-[#D5FC51]" />
        <div>
          <p className="text-sm text-gray-600">Memberships</p>
          <p className="text-2xl font-bold text-gray-900">{count}</p>
        </div>
      </div>
    </div>
  );
};
