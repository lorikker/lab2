import Breadcrumbs from "@/app/_components/dashboard/breadcrumbs";
import { fetchPostById } from "@/app/lib/data";
import Form from "@/app/_components/dashboard/edit-form";

import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const post = await fetchPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-gray-50 pt-8 font-sans">
      <div className="flex flex-col items-start justify-center gap-3">
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
