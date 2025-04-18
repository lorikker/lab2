import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import {
  HomePageButton,
  LogoutButton,
  PostsPageButton,
} from "../../_components/route-buttons";
import {
  CountPosts,
  CountUsers,
} from "../../_components/dashboard/count-entries";
import { Suspense } from "react";
import { CountCardSkeleton } from "../../_components/skeletons";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 font-sans">
      <div className="flex flex-col items-start justify-center gap-3">
        <div className="flex w-full items-center justify-start gap-2">
          <HomePageButton />
          <PostsPageButton />
        </div>
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
              <CountPosts />
            </Suspense>
            <Suspense fallback={<CountCardSkeleton />}>
              <CountUsers />
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
