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
  XMarkIcon,
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

export default function TrainerApplicationsClient() {
  const { data: session } = useSession();
  const router = useRouter();

  const [applications, setApplications] = useState<TrainerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("pending");
  const [selectedApplication, setSelectedApplication] =
    useState<TrainerApplication | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

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
      const response = await fetch(
        `/api/trainer-applications?status=${selectedStatus}`,
      );
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      } else {
        console.error("Error response:", response.status, response.statusText);
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
      alert(`An error occurred while ${action}ing the application.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const categories: Record<string, string> = {
      "strength": "Strength Training",
      "cardio": "Cardio & Endurance",
      "yoga": "Yoga & Flexibility",
      "nutrition": "Nutrition & Diet",
      "sports": "Sports Performance",
      "rehab": "Rehabilitation",
      "wellness": "Wellness & Lifestyle",
      "other": "Other Specialties",
    };
    return categories[categoryId] || categoryId;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "rejected":
        return <XCircleIcon className="h-4 w-4" />;
      case "pending":
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800";
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
        <div className="mb-8 flex space-x-2">
          <button
            onClick={() => setSelectedStatus("pending")}
            className={`rounded-xl px-4 py-2 font-medium transition-colors ${
              selectedStatus === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setSelectedStatus("approved")}
            className={`rounded-xl px-4 py-2 font-medium transition-colors ${
              selectedStatus === "approved"
                ? "bg-green-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setSelectedStatus("rejected")}
            className={`rounded-xl px-4 py-2 font-medium transition-colors ${
              selectedStatus === "rejected"
                ? "bg-red-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Rejected
          </button>
          <button
            onClick={() => setSelectedStatus("all")}
            className={`rounded-xl px-4 py-2 font-medium transition-colors ${
              selectedStatus === "all"
                ? "bg-[#D5FC51] text-black"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            All
          </button>
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

        {/* Application Details Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-gray-800 p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Application Details
                </h2>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="rounded-full bg-gray-700 p-2 text-gray-300 hover:bg-gray-600 hover:text-white"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6 flex items-center">
                {selectedApplication.photoUrl ? (
                  <img
                    src={selectedApplication.photoUrl}
                    alt={selectedApplication.name}
                    className="mr-4 h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-600">
                    <UserIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedApplication.name}
                  </h3>
                  <p className="text-sm text-[#D5FC51]">
                    {getCategoryName(selectedApplication.category)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedApplication.specialty}
                  </p>
                </div>
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
        )}
      </div>
    </div>
  );
}
