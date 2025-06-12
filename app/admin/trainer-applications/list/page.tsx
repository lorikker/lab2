"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import io from "socket.io-client";

export default function TrainerApplicationsList() {
  const { data: session } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [socket, setSocket] = useState(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!session) return;

    // Create socket connection
    const socketInstance = io();
    setSocket(socketInstance);

    // Join admin room to receive notifications
    socketInstance.emit("join-admin-room");

    // Listen for new trainer applications
    socketInstance.on("new-trainer-application", (data) => {
      console.log("New trainer application received:", data);
      // Refresh applications when a new one is submitted
      fetchApplications();
    });

    // Listen for new notifications that might be related to trainer applications
    socketInstance.on("new-notification", (data) => {
      if (data.type === "trainer_application") {
        console.log("New trainer application notification:", data);
        fetchApplications();
      }
    });

    return () => {
      // Clean up socket connection
      if (socketInstance) {
        socketInstance.off("new-trainer-application");
        socketInstance.off("new-notification");
        socketInstance.disconnect();
      }
    };
  }, [session]);

  // Check authentication and fetch applications
  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user?.role !== "ADMIN") {
      router.push("/");
      return;
    }

    fetchApplications();
  }, [session, router, selectedStatus]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/trainer-applications?status=${selectedStatus}`);
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      } else {
        console.error("Error response:", response.status);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch("/api/admin/approve-trainer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: id,
          action: "approve",
          adminId: session?.user?.id || session?.user?.email,
        }),
      });

      if (response.ok) {
        alert("Application approved successfully!");
        fetchApplications();
      } else {
        alert("Failed to approve application");
      }
    } catch (error) {
      console.error("Error approving application:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch("/api/admin/approve-trainer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: id,
          action: "reject",
          adminId: session?.user?.id || session?.user?.email,
        }),
      });

      if (response.ok) {
        alert("Application rejected successfully!");
        fetchApplications();
      } else {
        alert("Failed to reject application");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved": return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case "rejected": return <XCircleIcon className="h-4 w-4 text-red-500" />;
      default: return <ClockIcon className="h-4 w-4 text-yellow-500" />;
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Trainer Applications</h1>
        <p className="text-gray-600">Review and manage trainer applications in real-time</p>
      </div>

      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => setSelectedStatus("pending")}
          className={`rounded-lg px-4 py-2 ${
            selectedStatus === "pending" ? "bg-yellow-500 text-white" : "bg-gray-100"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setSelectedStatus("approved")}
          className={`rounded-lg px-4 py-2 ${
            selectedStatus === "approved" ? "bg-green-500 text-white" : "bg-gray-100"
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setSelectedStatus("rejected")}
          className={`rounded-lg px-4 py-2 ${
            selectedStatus === "rejected" ? "bg-red-500 text-white" : "bg-gray-100"
          }`}
        >
          Rejected
        </button>
        <button
          onClick={() => setSelectedStatus("all")}
          className={`rounded-lg px-4 py-2 ${
            selectedStatus === "all" ? "bg-[#D5FC51] text-black" : "bg-gray-100"
          }`}
        >
          All
        </button>
        <button
          onClick={fetchApplications}
          className="ml-auto rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading applications...</span>
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-8 text-center">
          <p className="text-lg text-gray-600">No applications found for status: {selectedStatus}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <div key={app.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
              <div className="border-b border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                      <UserIcon className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{app.name}</h3>
                      <p className="text-sm text-gray-500">{app.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center rounded-full bg-gray-100 px-3 py-1">
                    {getStatusIcon(app.status)}
                    <span className="ml-1 text-xs font-medium">{app.status}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <p className="font-medium text-gray-900">{app.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Experience:</span>
                    <p className="font-medium text-gray-900">{app.experience}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <p className="font-medium text-gray-900">{app.price}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Applied:</span>
                    <p className="font-medium text-gray-900">{formatDate(app.appliedAt)}</p>
                  </div>
                </div>
                
                <p className="mb-4 line-clamp-2 text-sm text-gray-600">{app.description}</p>
                
                {app.status === "pending" && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprove(app.id)}
                      className="flex-1 rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(app.id)}
                      className="flex-1 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


