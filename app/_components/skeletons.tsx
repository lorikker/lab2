import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import {
  CreatePageButton,
  DashboardPageButton,
  HomePageButton,
  LogoutButton,
  PostsPageButton,
} from "./route-buttons";

const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

const MainSkeleton = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-8 font-sans">
      <div className="flex flex-col items-start justify-center gap-3">
        {children}
      </div>
    </main>
  );
};

export function CountCardSkeleton() {
  return (
    <div
      className={`${shimmer} relative w-full overflow-hidden rounded-lg border border-indigo-100 bg-white p-2 shadow-sm`}
    >
      <div className="flex items-center p-4">
        <div className="h-5 w-5 rounded-md bg-gray-200" />
        <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-indigo-50 px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

export function PostSkeleton() {
  return (
    <div
      className={`${shimmer} relative flex w-full flex-col gap-6 overflow-hidden rounded-lg border border-indigo-100 px-4 py-6 shadow-sm`}
    >
      <div className="flex w-full flex-col items-start justify-center gap-3 border-b border-indigo-100 pb-4">
        <div className="mb-4 h-4 w-1/2 rounded-md bg-gray-300" />
        <div className="h-4 w-full rounded-md bg-gray-200" />
        <div className="h-4 w-full rounded-md bg-gray-200" />
        <div className="h-4 w-full rounded-md bg-gray-200" />
      </div>
      <div className="flex items-center gap-2 self-end">
        <div className="h-10 w-[58px] rounded-lg bg-gray-200" />
        <div className="h-10 w-[58px] rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

export const PostsSkeleton = () => {
  return (
    <MainSkeleton>
      <div className="flex w-full items-center justify-start gap-2">
        <HomePageButton />
        <DashboardPageButton />
      </div>
      <div className="flex flex-col items-center justify-center gap-8 rounded-lg border border-neutral-200 bg-white px-4 py-8 shadow-sm lg:w-[600px]">
        <h1 className="text-center text-2xl font-bold text-indigo-900 lg:text-4xl">
          Posts
        </h1>

        <div className="flex items-center justify-start gap-4 rounded-lg border border-indigo-100 px-3 py-1 shadow-sm">
          <CreatePageButton />
          <span className="text-sm text-indigo-900">Add new post</span>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-4 px-3">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      </div>
      <div className="self-end">
        <LogoutButton />
      </div>
    </MainSkeleton>
  );
};

export const DashboardSkeleton = () => {
  return (
    <MainSkeleton>
      <div className="flex w-full items-center justify-start gap-2">
        <HomePageButton />
        <PostsPageButton />
      </div>
      <div className="flex flex-col items-center justify-center gap-8 rounded-lg border bg-white px-12 py-10 shadow-sm lg:w-[400px]">
        <h1 className="text-center text-2xl font-bold text-indigo-900 lg:text-4xl">
          Dashboard
        </h1>
        <span className="flex items-center gap-2 text-indigo-900">
          <ShieldCheckIcon className="h-7 w-7 text-green-500" />
          <span>This page is protected!</span>
        </span>
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <CountCardSkeleton />
          <CountCardSkeleton />
        </div>
      </div>
      <div className="self-end">
        <LogoutButton />
      </div>
    </MainSkeleton>
  );
};
