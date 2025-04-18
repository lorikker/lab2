import Breadcrumbs from "@/app/_components/dashboard/breadcrumbs";
import { fetchPostById } from "@/app/lib/data";
import Form from "@/app/_components/dashboard/edit-form";
import {
  DashboardPageButton,
  HomePageButton,
} from "@/app/_components/route-buttons";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const post = await fetchPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 font-sans">
      <div className="flex flex-col items-start justify-center gap-3">
        <div className="flex w-full items-center justify-start gap-2">
          <HomePageButton />
          <DashboardPageButton />
        </div>

        <Breadcrumbs
          breadcrumbs={[
            { label: "Posts", href: "/dashboard/posts" },
            {
              label: "Edit Posts",
              href: `/dashboard/posts/${id}/edit`,
              active: true,
            },
          ]}
        />

        <Form post={post} />
      </div>
    </main>
  );
}
