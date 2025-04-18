import type { Metadata } from "next";
import {
  CreatePageButton,
  DashboardPageButton,
  DeletePostButton,
  EditPageButton,
  HomePageButton,
  LogoutButton,
} from "@/app/_components/route-buttons";
import { fetchAllPosts } from "@/app/lib/data";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Posts",
};

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-8 font-sans">
      <div className="flex flex-col items-start justify-center gap-3">
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

          <PostsList />
        </div>
        <div className="self-end">
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}

const PostsList = async () => {
  const posts = await fetchAllPosts();
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 px-3">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex w-full flex-col items-start justify-center gap-6 rounded-lg border border-indigo-100 px-4 py-6 shadow-sm"
        >
          <div className="flex w-full flex-col items-start justify-center gap-3 border-b border-indigo-100 pb-4">
            <h1 className="text-xl font-bold text-indigo-900">{post.title}</h1>
            <p className="text-lg text-indigo-900">{post.content}</p>
          </div>
          <div className="flex items-center gap-2 self-end">
            <EditPageButton id={post.id} />
            <DeletePostButton id={post.id} />
          </div>
        </div>
      ))}
    </div>
  );
};
