"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

interface TrainerApplication {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  specialty: string;
  experience: string;
  price: string;
  description: string;
  qualifications: string;
  availability: string;
  photoUrl?: string;
  status: "pending" | "approved" | "rejected";
  adminNotes?: string;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export default function TrainerApplicationsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [applications, setApplications] = useState<TrainerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("pending");
  const [selectedApplication, setSelectedApplication] =
    useState<TrainerApplication | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  // Category names mapping
  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      diet: "Diet & Nutrition",
      online: "Online Training",
      physical: "Physical Training",
      programs: "Workout Programs",
    };
    return categories[category] || category;
  };

  useEffect(() => {
    // Check if user is admin (you can implement your own admin check logic)
    if (!session) {
      router.push("/login");
      return;
    }

    fetchApplications();
  }, [session, router, selectedStatus]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/trainer-applications?status=${selectedStatus}`,
      );
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplicationAction = async (
    applicationId: string,
    action: "approve" | "reject",
  ) => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/admin/approve-trainer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId,
          action,
          adminId: session?.user?.id || session?.user?.email,
          adminNotes: adminNotes,
        }),
      });

      if (response.ok) {
        alert(`Application ${action}d successfully!`);
        setSelectedApplication(null);
        setAdminNotes("");
        fetchApplications();
      } else {
        const errorData = await response.json();
        alert(
          `Failed to ${action} application: ${errorData.error || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error(`Error ${action}ing application:`, error);
      alert(`Failed to ${action} application`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-400 bg-yellow-400/20";
      case "approved":
        return "text-green-400 bg-green-400/20";
      case "rejected":
        return "text-red-400 bg-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <ClockIcon className="h-4 w-4" />;
      case "approved":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "rejected":
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">
              Trainer Applications
            </h1>
            <p className="text-gray-400">
              Review and manage trainer applications
            </p>
          </div>
          <Link
            href="/admin"
            className="rounded-xl bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600"
          >
            Back to Admin
          </Link>
        </div>

        {/* Status Filter */}
        <div className="mb-8 flex space-x-4">
          {["pending", "approved", "rejected", "all"].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`rounded-xl px-4 py-2 font-medium transition-colors ${
                selectedStatus === status
                  ? "bg-[#D5FC51] text-black"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#D5FC51]"></div>
            <p className="text-gray-400">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-gray-400">
              No applications found for status: {selectedStatus}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {applications.map((application) => (
              <div
                key={application.id}
                className="rounded-2xl bg-gray-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/70"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center">
                    {application.photoUrl ? (
                      <img
                        src={application.photoUrl}
                        alt={application.name}
                        className="mr-3 h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-600">
                        <UserIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {application.name}
                      </h3>
                      <p className="text-sm text-[#D5FC51]">
                        {getCategoryName(application.category)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {application.specialty}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(application.status)}`}
                  >
                    {getStatusIcon(application.status)}
                    <span className="ml-1">{application.status}</span>
                  </div>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-300">
                    <EnvelopeIcon className="mr-2 h-4 w-4" />
                    {application.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <PhoneIcon className="mr-2 h-4 w-4" />
                    {application.phone}
                  </div>
                  <div className="text-sm text-gray-300">
                    <strong>Experience:</strong> {application.experience}
                  </div>
                  <div className="text-sm text-gray-300">
                    <strong>Price:</strong> {application.price}
                  </div>
                </div>

                <p className="mb-4 line-clamp-3 text-sm text-gray-400">
                  {application.description}
                </p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedApplication(application)}
                    className="flex flex-1 items-center justify-center rounded-xl bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600"
                  >
                    <EyeIcon className="mr-2 h-4 w-4" />
                    View Details
                  </button>
                  {application.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleApplicationAction(application.id, "approve")
                        }
                        disabled={isProcessing}
                        className="rounded-xl bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleApplicationAction(application.id, "reject")
                        }
                        disabled={isProcessing}
                        className="rounded-xl bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                      >
                        <XCircleIcon className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  Applied:{" "}
                  {new Date(application.appliedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-gray-800">
              <div className="p-6">
                <div className="mb-6 flex items-start justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    Application Details
                  </h2>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">
                        Name
                      </label>
                      <p className="text-white">{selectedApplication.name}</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">
                        Category
                      </label>
                      <p className="text-[#D5FC51]">
                        {getCategoryName(selectedApplication.category)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm text-gray-400">
                      Specialty
                    </label>
                    <p className="text-white">
                      {selectedApplication.specialty}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">
                        Email
                      </label>
                      <p className="text-white">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">
                        Phone
                      </label>
                      <p className="text-white">{selectedApplication.phone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">
                        Experience
                      </label>
                      <p className="text-white">
                        {selectedApplication.experience}
                      </p>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">
                        Price
                      </label>
                      <p className="text-white">{selectedApplication.price}</p>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm text-gray-400">
                      Description
                    </label>
                    <p className="text-white">
                      {selectedApplication.description}
                    </p>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm text-gray-400">
                      Qualifications
                    </label>
                    <p className="text-white">
                      {selectedApplication.qualifications}
                    </p>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm text-gray-400">
                      Availability
                    </label>
                    <p className="text-white">
                      {selectedApplication.availability}
                    </p>
                  </div>

                  {selectedApplication.status === "pending" && (
                    <div>
                      <label className="mb-2 block text-sm text-gray-400">
                        Admin Notes (Optional)
                      </label>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="w-full rounded-xl border border-gray-600 bg-gray-700 p-3 text-white focus:border-[#D5FC51] focus:outline-none"
                        rows={3}
                        placeholder="Add notes about your decision..."
                      />
                    </div>
                  )}

                  {selectedApplication.status === "pending" && (
                    <div className="flex space-x-4 pt-4">
                      <button
                        onClick={() =>
                          handleApplicationAction(
                            selectedApplication.id,
                            "approve",
                          )
                        }
                        disabled={isProcessing}
                        className="flex flex-1 items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                      >
                        <CheckCircleIcon className="mr-2 h-5 w-5" />
                        {isProcessing ? "Processing..." : "Approve Application"}
                      </button>
                      <button
                        onClick={() =>
                          handleApplicationAction(
                            selectedApplication.id,
                            "reject",
                          )
                        }
                        disabled={isProcessing}
                        className="flex flex-1 items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                      >
                        <XCircleIcon className="mr-2 h-5 w-5" />
                        {isProcessing ? "Processing..." : "Reject Application"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
