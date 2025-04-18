import { auth } from "@/auth";
import {
  DashboardPageButton,
  LoginPageButton,
  LogoutButton,
} from "./_components/route-buttons";
import { CheckBadgeIcon, NoSymbolIcon } from "@heroicons/react/24/outline";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 font-sans">
      <div className="flex flex-col items-start justify-center gap-3">
        {!session && (
          <div className="self-start">
            <LoginPageButton />
          </div>
        )}
        {session && (
          <div className="self-start">
            <DashboardPageButton />
          </div>
        )}
        <div className="flex flex-col items-center justify-center gap-8 rounded-lg border border-neutral-200 bg-white px-12 py-10 shadow-sm lg:w-[400px]">
          <h1 className="text-center text-2xl font-bold text-indigo-950 lg:text-4xl">
            Homepage
          </h1>
          <span className="flex items-center gap-2 text-center text-indigo-900">
            <span>Status:</span>
            {session ? (
              <span className="flex items-center gap-2">
                <CheckBadgeIcon className="h-7 w-7 text-green-500" />
                <span>Logged in</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <NoSymbolIcon className="h-7 w-7 text-red-500" />
                <span>Logged out</span>
              </span>
            )}
          </span>
        </div>
        {session && (
          <div className="self-end">
            <LogoutButton />
          </div>
        )}
      </div>
    </main>
  );
}
