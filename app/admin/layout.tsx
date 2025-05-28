"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (status === "loading") {
        return; // Still loading session
      }

      if (!session?.user?.email) {
        router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
        return;
      }

      try {
        // Check if user is admin
        const response = await fetch(`/api/user?email=${session.user.email}`);
        if (response.ok) {
          const data = await response.json();
          if (data.user?.role === "ADMIN") {
            setIsAuthorized(true);
          } else {
            // Not admin, redirect to home
            router.push('/');
            return;
          }
        } else {
          router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
          return;
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
        return;
      }

      setIsLoading(false);
    };

    checkAdminAccess();
  }, [session, status, router]);

  if (isLoading || status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D5FC51] mx-auto mb-4"></div>
          <p className="text-gray-400">Checking dashboard access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access this area.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
