"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface DashboardAccessGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requireAdminAccess?: boolean;
}

export default function DashboardAccessGuard({ 
  children, 
  requiredRoles = ["ADMIN", "TRAINER"],
  requireAdminAccess = false 
}: DashboardAccessGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string>("USER");
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      // If session is loading, wait
      if (status === "loading") {
        return;
      }

      // If no session, redirect to login
      if (!session) {
        router.push("/login");
        return;
      }

      try {
        // Fetch user role
        const response = await fetch(`/api/user?email=${session.user?.email}`);
        if (response.ok) {
          const data = await response.json();
          const role = data.user?.role || "USER";
          setUserRole(role);

          // Check if user has required role
          const hasRequiredRole = requiredRoles.includes(role);
          
          // Check if user has accessed admin dashboard (stored in sessionStorage)
          const adminAccessGranted = sessionStorage.getItem("adminAccessGranted");
          const hasAdminAccessFlag = adminAccessGranted === "true";
          setHasAdminAccess(hasAdminAccessFlag);

          // For dashboard routes, require both role and admin access
          if (pathname.startsWith("/dashboard")) {
            if (requireAdminAccess) {
              // For sensitive routes, require explicit admin access
              if (hasRequiredRole && hasAdminAccessFlag) {
                setHasAccess(true);
              } else {
                // Redirect to admin dashboard first
                router.push("/admin");
                return;
              }
            } else {
              // For general dashboard access, just check role
              if (hasRequiredRole) {
                setHasAccess(true);
              } else {
                router.push("/");
                return;
              }
            }
          } else {
            // For non-dashboard routes, just check role
            if (hasRequiredRole) {
              setHasAccess(true);
            } else {
              router.push("/");
              return;
            }
          }
        } else {
          router.push("/login");
          return;
        }
      } catch (error) {
        console.error("Error checking access:", error);
        router.push("/login");
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [session, status, router, pathname, requiredRoles, requireAdminAccess]);

  // Grant admin access when user visits admin dashboard
  useEffect(() => {
    if (pathname === "/admin" && hasAccess) {
      sessionStorage.setItem("adminAccessGranted", "true");
      setHasAdminAccess(true);
    }
  }, [pathname, hasAccess]);

  if (isLoading || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#D5FC51]"></div>
            <p className="text-gray-600">Verifying access...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="py-16 text-center">
            <div className="mb-6 text-6xl">🔒</div>
            <h1 className="mb-4 text-3xl font-bold text-[#2A2A2A]">Access Denied</h1>
            <p className="mb-6 text-gray-600">
              You don't have permission to access this page.
              {pathname.startsWith("/dashboard") && !hasAdminAccess && (
                <span className="block mt-2">
                  Please access the dashboard through the admin panel first.
                </span>
              )}
            </p>
            <div className="space-x-4">
              <button
                onClick={() => router.push("/")}
                className="rounded-lg bg-gray-200 px-6 py-3 text-[#2A2A2A] hover:bg-gray-300 transition-colors"
              >
                Go Home
              </button>
              {requiredRoles.includes("ADMIN") && (
                <button
                  onClick={() => router.push("/admin")}
                  className="rounded-lg bg-[#D5FC51] px-6 py-3 text-[#2A2A2A] hover:opacity-90 transition-opacity"
                >
                  Go to Admin Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Helper function to grant admin access programmatically
export function grantAdminAccess() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("adminAccessGranted", "true");
  }
}

// Helper function to revoke admin access
export function revokeAdminAccess() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("adminAccessGranted");
  }
}

// Helper function to check if user has admin access
export function hasAdminAccess(): boolean {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("adminAccessGranted") === "true";
  }
  return false;
}
