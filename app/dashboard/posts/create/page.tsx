import Breadcrumbs from "@/app/_components/dashboard/breadcrumbs";
import Form from "@/app/_components/dashboard/create-form";
import {
  DashboardPageButton,
  HomePageButton,
} from "@/app/_components/route-buttons";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User ID is not available");
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
