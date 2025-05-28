'use client';

import { useState, useEffect } from 'react';
import {
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  ClockIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

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
  isProcessing = false
}: NotificationModalProps) {
  const [adminNotes, setAdminNotes] = useState('');
  const [applicationDetails, setApplicationDetails] = useState<TrainerApplication | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Fetch application details when modal opens for trainer applications
  useEffect(() => {
    const fetchApplicationDetails = async () => {
      if (isOpen && notification?.type === 'trainer_application' && notification.data.applicationId) {
        setIsLoadingDetails(true);
        try {
          const response = await fetch(`/api/trainer-applications/${notification.data.applicationId}`);
          if (response.ok) {
            const data = await response.json();
            setApplicationDetails(data.application);
          }
        } catch (error) {
          console.error('Error fetching application details:', error);
        } finally {
          setIsLoadingDetails(false);
        }
      }
    };

    fetchApplicationDetails();
  }, [isOpen, notification]);

  if (!isOpen || !notification) return null;

  const isTrainerApplication = notification.type === 'trainer_application';
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'diet':
        return '🥗';
      case 'online':
        return '💻';
      case 'physical':
        return '💪';
      case 'workout':
        return '🏋️';
      default:
        return '🎯';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden transform animate-slideUp border border-gray-200/50 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Header Background */}
        <div className="relative bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 px-6 py-3">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-4 left-8 w-20 h-20 bg-[#D5FC51]/10 rounded-full blur-xl"></div>
            <div className="absolute top-8 right-12 w-16 h-16 bg-[#D5FC51]/20 rounded-full blur-lg"></div>
            <div className="absolute bottom-4 left-1/3 w-12 h-12 bg-white/5 rounded-full blur-md"></div>
          </div>

          {/* Header Content */}
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D5FC51] to-[#B8E635] rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                  <span className="text-3xl transform -rotate-3">{isTrainerApplication ? '👨‍💼' : '🔔'}</span>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{notification.title}</h2>
                <div className="flex items-center space-x-3">
                  <p className="text-gray-300 text-sm">{formatDate(notification.createdAt)}</p>
                  <span className="px-3 py-1 bg-[#D5FC51]/20 text-[#D5FC51] text-xs font-medium rounded-full border border-[#D5FC51]/30">
                    {notification.type === 'trainer_application' ? 'New Application' : 'Notification'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-red-500/20 rounded-full transition-all duration-300 group bg-red-500/10 border-2 border-red-400/50 hover:border-red-400 flex-shrink-0"
              title="Close"
            >
              <XMarkIcon className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-colors" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(85vh-100px)] overflow-y-auto">
          {isTrainerApplication ? (
            /* Trainer Application Details */
            <div className="space-y-6">
              {isLoadingDetails ? (
                <div className="flex items-center justify-center py-12">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D5FC51]/20 border-t-[#D5FC51]"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#D5FC51]/10"></div>
                  </div>
                  <span className="ml-4 text-gray-600 font-medium">Loading application details...</span>
                </div>
              ) : (
                <>
                  {/* Application Overview */}
                  <div className="relative bg-gradient-to-br from-[#D5FC51]/10 via-blue-50/50 to-purple-50/30 rounded-2xl p-6 border border-[#D5FC51]/20">
                    <div className="absolute top-4 right-4 w-16 h-16 bg-[#D5FC51]/10 rounded-full blur-lg"></div>
                    <div className="relative flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#D5FC51] to-[#B8E635] rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-4xl">{getCategoryIcon(applicationDetails?.category || data.category || '')}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">New Trainer Application</h3>
                        <p className="text-lg text-[#D5FC51] font-semibold mb-3">{applicationDetails?.specialty || data.specialty}</p>
                        <p className="text-gray-700 leading-relaxed">{notification.message}</p>
                      </div>
                    </div>
                  </div>

                  {/* Applicant Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <h4 className="text-xl font-bold text-gray-900 flex items-center mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                          <UserIcon className="w-5 h-5 text-white" />
                        </div>
                        Applicant Information
                      </h4>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-gray-800 font-medium">{applicationDetails?.name || data.applicantName}</span>
                        </div>

                        <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <EnvelopeIcon className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-gray-800">{applicationDetails?.email || data.applicantEmail}</span>
                        </div>

                        {applicationDetails?.phone && (
                          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <PhoneIcon className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="text-gray-800">{applicationDetails.phone}</span>
                          </div>
                        )}

                        <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <CalendarIcon className="w-4 h-4 text-orange-600" />
                          </div>
                          <span className="text-gray-800">Applied: {formatDate(applicationDetails?.appliedAt || data.appliedAt || '')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative">
                      {/* Close button */}
                      <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-10"
                      >
                        <XMarkIcon className="w-5 h-5 text-gray-600" />
                      </button>

                      <h4 className="text-xl font-bold text-gray-900 flex items-center mb-6 pr-12">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#D5FC51] to-[#B8E635] rounded-xl flex items-center justify-center mr-3">
                          <TrophyIcon className="w-5 h-5 text-gray-800" />
                        </div>
                        Professional Details
                      </h4>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-[#D5FC51]/10 to-[#B8E635]/10 rounded-xl border border-[#D5FC51]/20">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#D5FC51] to-[#B8E635] rounded-xl flex items-center justify-center">
                            <span className="text-2xl">{getCategoryIcon(applicationDetails?.category || data.category || '')}</span>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 capitalize text-lg">{applicationDetails?.category || data.category}</p>
                            <p className="text-[#D5FC51] font-medium">{applicationDetails?.specialty || data.specialty}</p>
                          </div>
                        </div>

                        {applicationDetails?.experience && (
                          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <ClockIcon className="w-4 h-4 text-indigo-600" />
                            </div>
                            <span className="text-gray-800 font-medium">{applicationDetails.experience} years experience</span>
                          </div>
                        )}

                        {applicationDetails?.price && (
                          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                              <CurrencyDollarIcon className="w-4 h-4 text-emerald-600" />
                            </div>
                            <span className="text-gray-800 font-bold text-lg">${applicationDetails.price}/session</span>
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
                          <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700">{applicationDetails.description}</p>
                          </div>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-4">
                        {applicationDetails.qualifications && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Qualifications</h4>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-gray-700">{applicationDetails.qualifications}</p>
                            </div>
                          </div>
                        )}

                        {applicationDetails.availability && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Availability</h4>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-gray-700">{applicationDetails.availability}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {applicationDetails.photoUrl && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Profile Photo</h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <img
                              src={applicationDetails.photoUrl}
                              alt="Trainer profile"
                              className="w-32 h-32 rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D5FC51] focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">Admin Decision</h4>
                    <div className="flex space-x-4">
                      <button
                        onClick={handleApprove}
                        disabled={isProcessing}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                      >
                        {isProcessing ? (
                          <div className="relative">
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                          </div>
                        ) : (
                          <>
                            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                              <TrophyIcon className="w-5 h-5" />
                            </div>
                            <span className="text-lg">Approve Trainer</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleReject}
                        disabled={isProcessing}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                      >
                        {isProcessing ? (
                          <div className="relative">
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                          </div>
                        ) : (
                          <>
                            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                              <XMarkIcon className="w-5 h-5" />
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
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{notification.message}</p>
              </div>

              {data && Object.keys(data).length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Additional Details</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-sm text-gray-600 whitespace-pre-wrap">
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
          <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
            <button
              onClick={onClose}
              className="w-full bg-[#D5FC51] hover:bg-[#c5ec41] text-black font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
