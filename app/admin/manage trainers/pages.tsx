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
  XMarkIcon,
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
  const [selectedTrainer, setSelectedTrainer] =
    useState<ApprovedTrainer | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [removeReason, setRemoveReason] = useState("");

  useEffect(() => {
    // Check if user is admin
    if (!session) {
      router.push("/login");
      return;
    }

    fetchTrainers();
  }, [session, router]);

  const fetchTrainers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/approved-trainers?active=true");
      if (response.ok) {
        const data = await response.json();
        setTrainers(data.trainers || []);
      }
    } catch (error) {
      console.error("Error fetching trainers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTrainer = async (trainerId: number) => {
    setIsRemoving(true);
    try {
      const response = await fetch("/api/admin/remove-trainer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trainerId: trainerId,
          adminId: session?.user?.id || session?.user?.email,
          reason: removeReason,
        }),
      });

      if (response.ok) {
        alert(
          "Trainer status removed successfully! User has been converted back to regular user.",
        );
        setSelectedTrainer(null);
        setRemoveReason("");
        fetchTrainers();
      } else {
        alert("Failed to remove trainer status");
      }
    } catch (error) {
      console.error("Error removing trainer:", error);
      alert("Failed to remove trainer");
    } finally {
      setIsRemoving(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">
              Manage Trainers
            </h1>
            <p className="text-gray-400">View and manage approved trainers</p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/admin/trainer-applications"
              className="rounded-xl bg-[#D5FC51] px-4 py-2 text-black transition-colors hover:bg-[#D5FC51]/90"
            >
              View Applications
            </Link>
            <Link
              href="/admin"
              className="rounded-xl bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600"
            >
              Back to Admin
            </Link>
          </div>
        </div>

        {/* Trainers List */}
        {isLoading ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#D5FC51]"></div>
            <p className="text-gray-400">Loading trainers...</p>
          </div>
        ) : trainers.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-gray-400">No approved trainers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {trainers.map((trainer) => (
              <div
                key={trainer.id}
                className="rounded-2xl bg-gray-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/70"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center">
                    {trainer.photoUrl ? (
                      <img
                        src={trainer.photoUrl}
                        alt={trainer.name}
                        className="mr-3 h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-600">
                        <UserIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {trainer.name}
                      </h3>
                      <p className="text-sm text-[#D5FC51]">
                        {getCategoryName(trainer.category)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {trainer.specialty}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-yellow-400">
                    <StarIcon className="mr-1 h-4 w-4" />
                    <span className="text-sm">{trainer.rating}</span>
                  </div>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-300">
                    <EnvelopeIcon className="mr-2 h-4 w-4" />
                    {trainer.email}
                  </div>
                  {trainer.phone && (
                    <div className="flex items-center text-sm text-gray-300">
                      <PhoneIcon className="mr-2 h-4 w-4" />
                      {trainer.phone}
                    </div>
                  )}
                  <div className="text-sm text-gray-300">
                    <strong>Experience:</strong> {trainer.experience}
                  </div>
                  <div className="text-sm text-gray-300">
                    <strong>Price:</strong> {trainer.price}
                  </div>
                </div>

                <p className="mb-4 line-clamp-3 text-sm text-gray-400">
                  {trainer.description}
                </p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedTrainer(trainer)}
                    className="flex flex-1 items-center justify-center rounded-xl bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600"
                  >
                    <EyeIcon className="mr-2 h-4 w-4" />
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTrainer(trainer);
                      setRemoveReason("");
                    }}
                    className="rounded-xl bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-gray-800">
              <div className="p-6">
                <div className="mb-6 flex items-start justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    Trainer Details
                  </h2>
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
                      <label className="mb-1 block text-sm text-gray-400">
                        Name
                      </label>
                      <p className="text-white">{selectedTrainer.name}</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">
                        Category
                      </label>
                      <p className="text-[#D5FC51]">
                        {getCategoryName(selectedTrainer.category)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm text-gray-400">
                      Specialty
                    </label>
                    <p className="text-white">{selectedTrainer.specialty}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">
                        Email
                      </label>
                      <p className="text-white">{selectedTrainer.email}</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">
                        Phone
                      </label>
                      <p className="text-white">
                        {selectedTrainer.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">
                        Experience
                      </label>
                      <p className="text-white">{selectedTrainer.experience}</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">
                        Price
                      </label>
                      <p className="text-white">{selectedTrainer.price}</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">
                        Rating
                      </label>
                      <p className="flex items-center text-white">
                        <StarIcon className="mr-1 h-4 w-4 text-yellow-400" />
                        {selectedTrainer.rating}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm text-gray-400">
                      Description
                    </label>
                    <p className="text-white">{selectedTrainer.description}</p>
                  </div>

                  {selectedTrainer.qualifications && (
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">
                        Qualifications
                      </label>
                      <p className="text-white">
                        {selectedTrainer.qualifications}
                      </p>
                    </div>
                  )}

                  {selectedTrainer.availability && (
                    <div>
                      <label className="mb-1 block text-sm text-gray-400">
                        Availability
                      </label>
                      <p className="text-white">
                        {selectedTrainer.availability}
                      </p>
                    </div>
                  )}

                  {/* Remove Trainer Section */}
                  <div className="border-t border-gray-600 pt-6">
                    <h3 className="mb-4 text-lg font-bold text-white">
                      Remove Trainer Status
                    </h3>
                    <p className="mb-4 text-sm text-gray-400">
                      This will remove the trainer status and convert them back
                      to a regular user. They will no longer appear on the
                      trainers page.
                    </p>
                    <div className="mb-4">
                      <label className="mb-2 block text-sm text-gray-400">
                        Reason for Removal (Optional)
                      </label>
                      <textarea
                        value={removeReason}
                        onChange={(e) => setRemoveReason(e.target.value)}
                        className="w-full rounded-xl border border-gray-600 bg-gray-700 p-3 text-white focus:border-[#D5FC51] focus:outline-none"
                        rows={3}
                        placeholder="Explain why this trainer status is being removed..."
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleRemoveTrainer(selectedTrainer.id)}
                        disabled={isRemoving}
                        className="flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                      >
                        <TrashIcon className="mr-2 h-5 w-5" />
                        {isRemoving
                          ? "Removing Trainer Status..."
                          : "Remove Trainer Status"}
                      </button>
                      <button
                        onClick={() => setSelectedTrainer(null)}
                        className="rounded-xl bg-gray-600 px-6 py-3 text-white transition-colors hover:bg-gray-700"
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
