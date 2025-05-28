"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TrashIcon,
  EyeIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  StarIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

interface ApprovedTrainer {
  id: number;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  category: string;
  specialty: string;
  experience: string;
  rating: number;
  price: string;
  description: string;
  qualifications?: string;
  availability?: string;
  photoUrl?: string;
  isActive: boolean;
  approvedAt: string;
  approvedBy: string;
}

export default function ManageTrainersPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [trainers, setTrainers] = useState<ApprovedTrainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTrainer, setSelectedTrainer] = useState<ApprovedTrainer | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [removeReason, setRemoveReason] = useState('');

  useEffect(() => {
    // Check if user is admin
    if (!session) {
      router.push('/login');
      return;
    }

    fetchTrainers();
  }, [session, router]);

  const fetchTrainers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/approved-trainers?active=true');
      if (response.ok) {
        const data = await response.json();
        setTrainers(data.trainers || []);
      }
    } catch (error) {
      console.error('Error fetching trainers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTrainer = async (trainerId: number) => {
    setIsRemoving(true);
    try {
      const response = await fetch('/api/admin/remove-trainer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trainerId: trainerId,
          adminId: session?.user?.id || session?.user?.email,
          reason: removeReason
        }),
      });

      if (response.ok) {
        alert('Trainer status removed successfully! User has been converted back to regular user.');
        setSelectedTrainer(null);
        setRemoveReason('');
        fetchTrainers();
      } else {
        alert('Failed to remove trainer status');
      }
    } catch (error) {
      console.error('Error removing trainer:', error);
      alert('Failed to remove trainer');
    } finally {
      setIsRemoving(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Manage Trainers</h1>
            <p className="text-gray-400">View and manage approved trainers</p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/admin/trainer-applications"
              className="bg-[#D5FC51] text-black px-4 py-2 rounded-xl hover:bg-[#D5FC51]/90 transition-colors"
            >
              View Applications
            </Link>
            <Link
              href="/admin"
              className="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-colors"
            >
              Back to Admin
            </Link>
          </div>
        </div>

        {/* Trainers List */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D5FC51] mx-auto mb-4"></div>
            <p className="text-gray-400">Loading trainers...</p>
          </div>
        ) : trainers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No approved trainers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {trainers.map((trainer) => (
              <div key={trainer.id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-gray-800/70 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    {trainer.photoUrl ? (
                      <img
                        src={trainer.photoUrl}
                        alt={trainer.name}
                        className="w-12 h-12 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                        <UserIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-white">{trainer.name}</h3>
                      <p className="text-[#D5FC51] text-sm">{getCategoryName(trainer.category)}</p>
                      <p className="text-gray-400 text-xs">{trainer.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-yellow-400">
                    <StarIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">{trainer.rating}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-300 text-sm">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    {trainer.email}
                  </div>
                  {trainer.phone && (
                    <div className="flex items-center text-gray-300 text-sm">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      {trainer.phone}
                    </div>
                  )}
                  <div className="text-gray-300 text-sm">
                    <strong>Experience:</strong> {trainer.experience}
                  </div>
                  <div className="text-gray-300 text-sm">
                    <strong>Price:</strong> {trainer.price}
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {trainer.description}
                </p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedTrainer(trainer)}
                    className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-xl hover:bg-gray-600 transition-colors flex items-center justify-center"
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTrainer(trainer);
                      setRemoveReason('');
                    }}
                    className="bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-red-700 transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  Approved: {new Date(trainer.approvedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trainer Detail/Remove Modal */}
        {selectedTrainer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-white">Trainer Details</h2>
                  <button
                    onClick={() => setSelectedTrainer(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Name</label>
                      <p className="text-white">{selectedTrainer.name}</p>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Category</label>
                      <p className="text-[#D5FC51]">{getCategoryName(selectedTrainer.category)}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Specialty</label>
                    <p className="text-white">{selectedTrainer.specialty}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Email</label>
                      <p className="text-white">{selectedTrainer.email}</p>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Phone</label>
                      <p className="text-white">{selectedTrainer.phone || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Experience</label>
                      <p className="text-white">{selectedTrainer.experience}</p>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Price</label>
                      <p className="text-white">{selectedTrainer.price}</p>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Rating</label>
                      <p className="text-white flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        {selectedTrainer.rating}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Description</label>
                    <p className="text-white">{selectedTrainer.description}</p>
                  </div>

                  {selectedTrainer.qualifications && (
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Qualifications</label>
                      <p className="text-white">{selectedTrainer.qualifications}</p>
                    </div>
                  )}

                  {selectedTrainer.availability && (
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Availability</label>
                      <p className="text-white">{selectedTrainer.availability}</p>
                    </div>
                  )}

                  {/* Remove Trainer Section */}
                  <div className="border-t border-gray-600 pt-6">
                    <h3 className="text-lg font-bold text-white mb-4">Remove Trainer Status</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      This will remove the trainer status and convert them back to a regular user. They will no longer appear on the trainers page.
                    </p>
                    <div className="mb-4">
                      <label className="block text-gray-400 text-sm mb-2">Reason for Removal (Optional)</label>
                      <textarea
                        value={removeReason}
                        onChange={(e) => setRemoveReason(e.target.value)}
                        className="w-full p-3 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-[#D5FC51] focus:outline-none"
                        rows={3}
                        placeholder="Explain why this trainer status is being removed..."
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleRemoveTrainer(selectedTrainer.id)}
                        disabled={isRemoving}
                        className="bg-red-600 text-white py-3 px-6 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                      >
                        <TrashIcon className="h-5 w-5 mr-2" />
                        {isRemoving ? 'Removing Trainer Status...' : 'Remove Trainer Status'}
                      </button>
                      <button
                        onClick={() => setSelectedTrainer(null)}
                        className="bg-gray-600 text-white py-3 px-6 rounded-xl hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
