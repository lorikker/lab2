"use client";

import { useState, useEffect } from "react";
import {
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

interface NotificationData {
  applicationId?: string;
  applicantName?: string;
  applicantEmail?: string;
  category?: string;
  specialty?: string;
  appliedAt?: string;
  [key: string]: any;
}

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
  photoUrl: string;
  status: string;
  appliedAt: string;
  createdAt: string;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: NotificationData;
  isRead: boolean;
  createdAt: string;
}

interface NotificationModalProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (applicationId: string) => void;
  onReject?: (applicationId: string) => void;
  isProcessing?: boolean;
}

export default function NotificationModal({
  notification,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isProcessing = false,
}: NotificationModalProps) {
  const [adminNotes, setAdminNotes] = useState("");
  const [applicationDetails, setApplicationDetails] =
    useState<TrainerApplication | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Fetch application details when modal opens for trainer applications
  useEffect(() => {
    const fetchApplicationDetails = async () => {
      if (
        isOpen &&
        notification?.type === "trainer_application" &&
        notification.data.applicationId
      ) {
        setIsLoadingDetails(true);
        try {
          const response = await fetch(
            `/api/trainer-applications/${notification.data.applicationId}`,
          );
          if (response.ok) {
            const data = await response.json();
            setApplicationDetails(data.application);
          }
        } catch (error) {
          console.error("Error fetching application details:", error);
        } finally {
          setIsLoadingDetails(false);
        }
      }
    };

    fetchApplicationDetails();
  }, [isOpen, notification]);

  if (!isOpen || !notification) return null;

  const isTrainerApplication = notification.type === "trainer_application";
  const data = notification.data;

  const handleApprove = () => {
    if (data.applicationId && onApprove) {
      onApprove(data.applicationId);
    }
  };

  const handleReject = () => {
    if (data.applicationId && onReject) {
      onReject(data.applicationId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "diet":
        return "🥗";
      case "online":
        return "💻";
      case "physical":
        return "💪";
      case "workout":
        return "🏋️";
      default:
        return "🎯";
    }
  };

  return (
    <div
      className="animate-fadeIn fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-slideUp relative max-h-[85vh] w-full max-w-4xl transform overflow-hidden rounded-3xl border border-gray-200/50 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Header Background */}
        <div className="relative bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 px-6 py-3">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 h-full w-full">
            <div className="absolute top-4 left-8 h-20 w-20 rounded-full bg-[#D5FC51]/10 blur-xl"></div>
            <div className="absolute top-8 right-12 h-16 w-16 rounded-full bg-[#D5FC51]/20 blur-lg"></div>
            <div className="absolute bottom-4 left-1/3 h-12 w-12 rounded-full bg-white/5 blur-md"></div>
          </div>

          {/* Header Content */}
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="flex h-16 w-16 rotate-3 transform items-center justify-center rounded-2xl bg-gradient-to-br from-[#D5FC51] to-[#B8E635] shadow-lg">
                  <span className="-rotate-3 transform text-3xl">
                    {isTrainerApplication ? "👨‍💼" : "🔔"}
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
                  <span className="text-xs font-bold text-white">!</span>
                </div>
              </div>
              <div>
                <h2 className="mb-1 text-2xl font-bold text-white">
                  {notification.title}
                </h2>
                <div className="flex items-center space-x-3">
                  <p className="text-sm text-gray-300">
                    {formatDate(notification.createdAt)}
                  </p>
                  <span className="rounded-full border border-[#D5FC51]/30 bg-[#D5FC51]/20 px-3 py-1 text-xs font-medium text-[#D5FC51]">
                    {notification.type === "trainer_application"
                      ? "New Application"
                      : "Notification"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="group flex-shrink-0 rounded-full border-2 border-red-400/50 bg-red-500/10 p-3 transition-all duration-300 hover:border-red-400 hover:bg-red-500/20"
              title="Close"
            >
              <XMarkIcon className="h-6 w-6 text-red-400 transition-colors group-hover:text-red-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(85vh-100px)] overflow-y-auto p-6">
          {isTrainerApplication ? (
            /* Trainer Application Details */
            <div className="space-y-6">
              {isLoadingDetails ? (
                <div className="flex items-center justify-center py-12">
                  <div className="relative">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#D5FC51]/20 border-t-[#D5FC51]"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#D5FC51]/10"></div>
                  </div>
                  <span className="ml-4 font-medium text-gray-600">
                    Loading application details...
                  </span>
                </div>
              ) : (
                <>
                  {/* Application Overview */}
                  <div className="relative rounded-2xl border border-[#D5FC51]/20 bg-gradient-to-br from-[#D5FC51]/10 via-blue-50/50 to-purple-50/30 p-6">
                    <div className="absolute top-4 right-4 h-16 w-16 rounded-full bg-[#D5FC51]/10 blur-lg"></div>
                    <div className="relative flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D5FC51] to-[#B8E635] shadow-lg">
                          <span className="text-4xl">
                            {getCategoryIcon(
                              applicationDetails?.category ||
                                data.category ||
                                "",
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 text-2xl font-bold text-gray-900">
                          New Trainer Application
                        </h3>
                        <p className="mb-3 text-lg font-semibold text-[#D5FC51]">
                          {applicationDetails?.specialty || data.specialty}
                        </p>
                        <p className="leading-relaxed text-gray-700">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Applicant Information */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
                      <h4 className="mb-6 flex items-center text-xl font-bold text-gray-900">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                          <UserIcon className="h-5 w-5 text-white" />
                        </div>
                        Applicant Information
                      </h4>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-4 rounded-xl bg-gray-50 p-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                            <UserIcon className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-800">
                            {applicationDetails?.name || data.applicantName}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 rounded-xl bg-gray-50 p-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                            <EnvelopeIcon className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="text-gray-800">
                            {applicationDetails?.email || data.applicantEmail}
                          </span>
                        </div>

                        {applicationDetails?.phone && (
                          <div className="flex items-center space-x-4 rounded-xl bg-gray-50 p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                              <PhoneIcon className="h-4 w-4 text-purple-600" />
                            </div>
                            <span className="text-gray-800">
                              {applicationDetails.phone}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center space-x-4 rounded-xl bg-gray-50 p-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                            <CalendarIcon className="h-4 w-4 text-orange-600" />
                          </div>
                          <span className="text-gray-800">
                            Applied:{" "}
                            {formatDate(
                              applicationDetails?.appliedAt ||
                                data.appliedAt ||
                                "",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
                      {/* Close button */}
                      <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
                      >
                        <XMarkIcon className="h-5 w-5 text-gray-600" />
                      </button>

                      <h4 className="mb-6 flex items-center pr-12 text-xl font-bold text-gray-900">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#D5FC51] to-[#B8E635]">
                          <TrophyIcon className="h-5 w-5 text-gray-800" />
                        </div>
                        Professional Details
                      </h4>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-4 rounded-xl border border-[#D5FC51]/20 bg-gradient-to-r from-[#D5FC51]/10 to-[#B8E635]/10 p-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#D5FC51] to-[#B8E635]">
                            <span className="text-2xl">
                              {getCategoryIcon(
                                applicationDetails?.category ||
                                  data.category ||
                                  "",
                              )}
                            </span>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-gray-900 capitalize">
                              {applicationDetails?.category || data.category}
                            </p>
                            <p className="font-medium text-[#D5FC51]">
                              {applicationDetails?.specialty || data.specialty}
                            </p>
                          </div>
                        </div>

                        {applicationDetails?.experience && (
                          <div className="flex items-center space-x-4 rounded-xl bg-gray-50 p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                              <ClockIcon className="h-4 w-4 text-indigo-600" />
                            </div>
                            <span className="font-medium text-gray-800">
                              {applicationDetails.experience} years experience
                            </span>
                          </div>
                        )}

                        {applicationDetails?.price && (
                          <div className="flex items-center space-x-4 rounded-xl bg-gray-50 p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                              <CurrencyDollarIcon className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="text-lg font-bold text-gray-800">
                              ${applicationDetails.price}/session
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  {applicationDetails && (
                    <div className="space-y-4">
                      {applicationDetails.description && (
                        <div>
                          <h4 className="mb-2 font-semibold text-gray-900">
                            Description
                          </h4>
                          <div className="rounded-lg bg-gray-50 p-4">
                            <p className="text-gray-700">
                              {applicationDetails.description}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="grid gap-4 md:grid-cols-2">
                        {applicationDetails.qualifications && (
                          <div>
                            <h4 className="mb-2 font-semibold text-gray-900">
                              Qualifications
                            </h4>
                            <div className="rounded-lg bg-gray-50 p-4">
                              <p className="text-gray-700">
                                {applicationDetails.qualifications}
                              </p>
                            </div>
                          </div>
                        )}

                        {applicationDetails.availability && (
                          <div>
                            <h4 className="mb-2 font-semibold text-gray-900">
                              Availability
                            </h4>
                            <div className="rounded-lg bg-gray-50 p-4">
                              <p className="text-gray-700">
                                {applicationDetails.availability}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {applicationDetails.photoUrl && (
                        <div>
                          <h4 className="mb-2 font-semibold text-gray-900">
                            Profile Photo
                          </h4>
                          <div className="rounded-lg bg-gray-50 p-4">
                            <img
                              src={applicationDetails.photoUrl}
                              alt="Trainer profile"
                              className="h-32 w-32 rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Admin Notes */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Admin Notes (Optional)
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add any notes about this application..."
                      className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-[#D5FC51]"
                      rows={3}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-6">
                    <h4 className="mb-4 text-center text-lg font-bold text-gray-900">
                      Admin Decision
                    </h4>
                    <div className="flex space-x-4">
                      <button
                        onClick={handleApprove}
                        disabled={isProcessing}
                        className="flex flex-1 transform items-center justify-center space-x-3 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-green-700 hover:shadow-xl disabled:scale-100 disabled:from-gray-400 disabled:to-gray-500"
                      >
                        {isProcessing ? (
                          <div className="relative">
                            <div className="h-6 w-6 animate-spin rounded-full border-3 border-white/30 border-t-white" />
                          </div>
                        ) : (
                          <>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
                              <TrophyIcon className="h-5 w-5" />
                            </div>
                            <span className="text-lg">Approve Trainer</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleReject}
                        disabled={isProcessing}
                        className="flex flex-1 transform items-center justify-center space-x-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-red-700 hover:shadow-xl disabled:scale-100 disabled:from-gray-400 disabled:to-gray-500"
                      >
                        {isProcessing ? (
                          <div className="relative">
                            <div className="h-6 w-6 animate-spin rounded-full border-3 border-white/30 border-t-white" />
                          </div>
                        ) : (
                          <>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
                              <XMarkIcon className="h-5 w-5" />
                            </div>
                            <span className="text-lg">Reject Application</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Regular Notification */
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="leading-relaxed text-gray-700">
                  {notification.message}
                </p>
              </div>

              {data && Object.keys(data).length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="mb-3 font-medium text-gray-900">
                    Additional Details
                  </h4>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <pre className="text-sm whitespace-pre-wrap text-gray-600">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer for non-trainer notifications */}
        {!isTrainerApplication && (
          <div className="rounded-b-2xl bg-gray-50 px-6 py-4">
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-[#D5FC51] px-4 py-2 font-semibold text-black transition-colors hover:bg-[#c5ec41]"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
