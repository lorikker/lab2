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
  PhoneIcon
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
  status: 'pending' | 'approved' | 'rejected';
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
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');
  const [selectedApplication, setSelectedApplication] = useState<TrainerApplication | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  // Category names mapping
  const getCategoryName = (category: string) => {
    const categories: {[key: string]: string} = {
      'diet': 'Diet & Nutrition',
      'online': 'Online Training',
      'physical': 'Physical Training',
      'programs': 'Workout Programs'
    };
    return categories[category] || category;
  };

  useEffect(() => {
    // Check if user is admin (you can implement your own admin check logic)
    if (!session) {
      router.push('/login');
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
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplicationAction = async (applicationId: string, action: 'approve' | 'reject') => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/admin/approve-trainer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId,
          action,
          adminId: session?.user?.id || session?.user?.email,
          adminNotes: adminNotes
        }),
      });

      if (response.ok) {
        alert(`Application ${action}d successfully!`);
        setSelectedApplication(null);
        setAdminNotes('');
        fetchApplications();
      } else {
        alert(`Failed to ${action} application`);
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
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'approved': return 'text-green-400 bg-green-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ClockIcon className="h-4 w-4" />;
      case 'approved': return <CheckCircleIcon className="h-4 w-4" />;
      case 'rejected': return <XCircleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Trainer Applications</h1>
            <p className="text-gray-400">Review and manage trainer applications</p>
          </div>
          <Link
            href="/admin"
            className="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-colors"
          >
            Back to Admin
          </Link>
        </div>

        {/* Status Filter */}
        <div className="flex space-x-4 mb-8">
          {['pending', 'approved', 'rejected', 'all'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-[#D5FC51] text-black'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D5FC51] mx-auto mb-4"></div>
            <p className="text-gray-400">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No applications found for status: {selectedStatus}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {applications.map((application) => (
              <div key={application.id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-gray-800/70 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    {application.photoUrl ? (
                      <img
                        src={application.photoUrl}
                        alt={application.name}
                        className="w-12 h-12 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                        <UserIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-white">{application.name}</h3>
                      <p className="text-[#D5FC51] text-sm">{getCategoryName(application.category)}</p>
                      <p className="text-gray-400 text-xs">{application.specialty}</p>
                    </div>
                  </div>
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    <span className="ml-1">{application.status}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-300 text-sm">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    {application.email}
                  </div>
                  <div className="flex items-center text-gray-300 text-sm">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    {application.phone}
                  </div>
                  <div className="text-gray-300 text-sm">
                    <strong>Experience:</strong> {application.experience}
                  </div>
                  <div className="text-gray-300 text-sm">
                    <strong>Price:</strong> {application.price}
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {application.description}
                </p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedApplication(application)}
                    className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-xl hover:bg-gray-600 transition-colors flex items-center justify-center"
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                  {application.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApplicationAction(application.id, 'approve')}
                        disabled={isProcessing}
                        className="bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleApplicationAction(application.id, 'reject')}
                        disabled={isProcessing}
                        className="bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        <XCircleIcon className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  Applied: {new Date(application.appliedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-white">Application Details</h2>
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
                      <label className="block text-gray-400 text-sm mb-1">Name</label>
                      <p className="text-white">{selectedApplication.name}</p>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Category</label>
                      <p className="text-[#D5FC51]">{getCategoryName(selectedApplication.category)}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Specialty</label>
                    <p className="text-white">{selectedApplication.specialty}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Email</label>
                      <p className="text-white">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Phone</label>
                      <p className="text-white">{selectedApplication.phone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Experience</label>
                      <p className="text-white">{selectedApplication.experience}</p>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Price</label>
                      <p className="text-white">{selectedApplication.price}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Description</label>
                    <p className="text-white">{selectedApplication.description}</p>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Qualifications</label>
                    <p className="text-white">{selectedApplication.qualifications}</p>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Availability</label>
                    <p className="text-white">{selectedApplication.availability}</p>
                  </div>

                  {selectedApplication.status === 'pending' && (
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Admin Notes (Optional)</label>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="w-full p-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-[#D5FC51] focus:outline-none"
                        rows={3}
                        placeholder="Add notes about your decision..."
                      />
                    </div>
                  )}

                  {selectedApplication.status === 'pending' && (
                    <div className="flex space-x-4 pt-4">
                      <button
                        onClick={() => handleApplicationAction(selectedApplication.id, 'approve')}
                        disabled={isProcessing}
                        className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                      >
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        {isProcessing ? 'Processing...' : 'Approve Application'}
                      </button>
                      <button
                        onClick={() => handleApplicationAction(selectedApplication.id, 'reject')}
                        disabled={isProcessing}
                        className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                      >
                        <XCircleIcon className="h-5 w-5 mr-2" />
                        {isProcessing ? 'Processing...' : 'Reject Application'}
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
