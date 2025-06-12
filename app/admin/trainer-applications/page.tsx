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
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
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
  const [filteredApplications, setFilteredApplications] = useState<TrainerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<TrainerApplication | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
  }, [session, router]);

  useEffect(() => {
    let filtered = applications;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  }, [searchTerm, statusFilter, applications]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/trainer-applications");
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
        setFilteredApplications(data.applications || []);
      } else {
        console.error("Failed to fetch applications");
        setApplications([]);
        setFilteredApplications([]);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setApplications([]);
      setFilteredApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplicationAction = async (
    applicationId: string,
    action: "approve" | "reject"
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
          `Failed to ${action} application: ${errorData.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error(`Error ${action}ing application:`, error);
      alert(`Failed to ${action} application. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <CheckCircleIcon className="mr-1 h-3 w-3" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <XCircleIcon className="mr-1 h-3 w-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <ClockIcon className="mr-1 h-3 w-3" />
            Pending
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#D5FC51]"></div>
            <p className="text-gray-600">Loading trainer applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/admin"
              className="mr-4 rounded-lg p-2 text-gray-600 hover:bg-white hover:text-[#D5FC51] transition-colors"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="mb-2 text-4xl font-bold text-[#2A2A2A]">Trainer Applications</h1>
              <p className="text-lg text-gray-600">
                Review and manage all trainer applications from the database
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-[#2A2A2A]">{applications.length}</p>
              </div>
              <UserIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-[#2A2A2A]">
                  {applications.filter(app => app.status === "pending").length}
                </p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-[#2A2A2A]">
                  {applications.filter(app => app.status === "approved").length}
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-[#2A2A2A]">
                  {applications.filter(app => app.status === "rejected").length}
                </p>
              </div>
              <XCircleIcon className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-[#D5FC51] focus:outline-none focus:ring-2 focus:ring-[#D5FC51]/20"
              />
            </div>
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none rounded-lg border border-gray-300 pl-10 pr-8 py-2 focus:border-[#D5FC51] focus:outline-none focus:ring-2 focus:ring-[#D5FC51]/20"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredApplications.map((application) => (
            <div key={application.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              {/* Application Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={application.photoUrl || "/default-avatar.png"}
                      alt={application.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2A2A2A]">{application.name}</h3>
                    <p className="text-sm text-gray-600">{application.email}</p>
                  </div>
                </div>
                {getStatusBadge(application.status)}
              </div>

              {/* Application Details */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Category:</span>
                  <span className="text-sm font-medium text-[#2A2A2A]">{application.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Specialty:</span>
                  <span className="text-sm font-medium text-[#2A2A2A]">{application.specialty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Experience:</span>
                  <span className="text-sm font-medium text-[#2A2A2A]">{application.experience}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="text-sm font-medium text-[#2A2A2A]">{application.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Applied:</span>
                  <span className="text-sm font-medium text-[#2A2A2A]">
                    {new Date(application.appliedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 line-clamp-3">{application.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between space-x-2">
                <button
                  onClick={() => setSelectedApplication(application)}
                  className="flex items-center rounded-lg bg-blue-50 px-3 py-2 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <EyeIcon className="mr-1 h-4 w-4" />
                  View Details
                </button>

                {application.status === "pending" && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApplicationAction(application.id, "approve")}
                      disabled={isProcessing}
                      className="rounded-lg bg-green-50 px-3 py-2 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApplicationAction(application.id, "reject")}
                      disabled={isProcessing}
                      className="rounded-lg bg-red-50 px-3 py-2 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredApplications.length === 0 && (
          <div className="py-16 text-center">
            <UserIcon className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">No applications found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No trainer applications have been submitted yet."}
            </p>
          </div>
        )}

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#2A2A2A]">Application Details</h2>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-[#2A2A2A]">Personal Information</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-3">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium text-[#2A2A2A]">{selectedApplication.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-[#2A2A2A]">{selectedApplication.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium text-[#2A2A2A]">{selectedApplication.phone || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        {getStatusBadge(selectedApplication.status)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-[#2A2A2A]">Professional Information</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-medium text-[#2A2A2A]">{selectedApplication.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Specialty</p>
                      <p className="font-medium text-[#2A2A2A]">{selectedApplication.specialty}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Experience</p>
                      <p className="font-medium text-[#2A2A2A]">{selectedApplication.experience}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="font-medium text-[#2A2A2A]">{selectedApplication.price}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-[#2A2A2A]">Description</h3>
                  <p className="text-gray-700">{selectedApplication.description}</p>
                </div>

                {/* Qualifications */}
                {selectedApplication.qualifications && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-[#2A2A2A]">Qualifications</h3>
                    <p className="text-gray-700">{selectedApplication.qualifications}</p>
                  </div>
                )}

                {/* Availability */}
                {selectedApplication.availability && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-[#2A2A2A]">Availability</h3>
                    <p className="text-gray-700">{selectedApplication.availability}</p>
                  </div>
                )}

                {/* Admin Notes */}
                {selectedApplication.status === "pending" && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-[#2A2A2A]">Admin Notes</h3>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add notes for this application..."
                      className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#D5FC51] focus:outline-none focus:ring-2 focus:ring-[#D5FC51]/20"
                      rows={3}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                {selectedApplication.status === "pending" && (
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => handleApplicationAction(selectedApplication.id, "reject")}
                      disabled={isProcessing}
                      className="rounded-lg bg-red-500 px-6 py-2 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? "Processing..." : "Reject"}
                    </button>
                    <button
                      onClick={() => handleApplicationAction(selectedApplication.id, "approve")}
                      disabled={isProcessing}
                      className="rounded-lg bg-green-500 px-6 py-2 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? "Processing..." : "Approve"}
                    </button>
                  </div>
                )}

                {/* Review Information */}
                {selectedApplication.status !== "pending" && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-[#2A2A2A]">Review Information</h3>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div>
                          <p className="text-sm text-gray-600">Reviewed At</p>
                          <p className="font-medium text-[#2A2A2A]">
                            {selectedApplication.reviewedAt ? formatDate(selectedApplication.reviewedAt) : "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Reviewed By</p>
                          <p className="font-medium text-[#2A2A2A]">{selectedApplication.reviewedBy || "N/A"}</p>
                        </div>
                      </div>
                      {selectedApplication.adminNotes && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600">Admin Notes</p>
                          <p className="text-gray-700">{selectedApplication.adminNotes}</p>
                        </div>
                      )}
                    </div>
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
