import Breadcrumbs from "@/app/_components/dashboard/breadcrumbs";
import Form from "@/app/_components/dashboard/create-form";

import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User ID is not available");
  }

  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-gray-50 pt-8 font-sans">
      <div className="flex flex-col items-start justify-center gap-3">
        <Breadcrumbs
          breadcrumbs={[
            { label: "Posts", href: "/dashboard/posts" },
            {
              label: "Create Posts",
              href: `/dashboard/posts/create`,
              active: true,
            },
          ]}
        />

        <Form userId={userId} />
      </div>
    </main>
  );
}
