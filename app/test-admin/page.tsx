"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function TestAdminPage() {
  const { data: session, status } = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      if (status === "loading") return;
      
      if (!session?.user?.email) {
        setError("No session found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/user?email=${session.user.email}`);
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.user?.role || "USER");
        } else {
          setError(`API Error: ${response.status}`);
        }
      } catch (err) {
        setError(`Fetch Error: ${err}`);
      }
      
      setLoading(false);
    };

    checkUserRole();
  }, [session, status]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#D5FC51]"></div>
            <p className="text-gray-600">Checking user role...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-[#2A2A2A] mb-8">Admin Access Test</h1>
          
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Session Status</h2>
              <p><strong>Status:</strong> {status}</p>
              <p><strong>User Email:</strong> {session?.user?.email || "Not logged in"}</p>
              <p><strong>User Name:</strong> {session?.user?.name || "Not available"}</p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">User Role</h2>
              {error ? (
                <p className="text-red-600"><strong>Error:</strong> {error}</p>
              ) : (
                <p><strong>Role:</strong> {userRole || "Loading..."}</p>
              )}
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Admin Access</h2>
              {userRole === "ADMIN" ? (
                <div>
                  <p className="text-green-600 mb-4">✅ You have admin access!</p>
                  <a 
                    href="/admin" 
                    className="inline-block bg-[#D5FC51] text-[#2A2A2A] px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Go to Admin Dashboard
                  </a>
                </div>
              ) : (
                <div>
                  <p className="text-red-600 mb-4">❌ You don't have admin access</p>
                  <p className="text-sm text-gray-600">
                    Current role: {userRole || "Unknown"}. You need "ADMIN" role to access the admin dashboard.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Debug Info</h2>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify({
                  sessionStatus: status,
                  userEmail: session?.user?.email,
                  userName: session?.user?.name,
                  userRole: userRole,
                  error: error
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
