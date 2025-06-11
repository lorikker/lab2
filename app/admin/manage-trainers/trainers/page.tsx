"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserGroupIcon,
  StarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

interface Trainer {
  id: string;
  name: string;
  email: string;
  category: string;
  specialty: string;
  experience: string;
  rating: number;
  totalSessions: number;
  price: string;
  isActive: boolean;
  photoUrl?: string;
  joinedDate: string;
}

export default function ManageTrainersListPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [filteredTrainers, setFilteredTrainers] = useState<Trainer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    // Check if user is admin
    if (session.user?.role !== "ADMIN") {
      router.push("/");
      return;
    }

    fetchTrainers();
  }, [session, router]);

  const fetchTrainers = async () => {
    try {
      // Mock data for demonstration
      const mockTrainers: Trainer[] = [
        {
          id: "1",
          name: "Alex Johnson",
          email: "alex@sixstarfitness.com",
          category: "Physical Training",
          specialty: "Strength & Conditioning",
          experience: "5 years",
          rating: 4.8,
          totalSessions: 156,
          price: "$80/session",
          isActive: true,
          photoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
          joinedDate: "2023-01-15"
        },
        {
          id: "2",
          name: "Sarah Williams",
          email: "sarah@sixstarfitness.com",
          category: "Diet & Nutrition",
          specialty: "Weight Loss Nutrition",
          experience: "7 years",
          rating: 4.9,
          totalSessions: 203,
          price: "$90/session",
          isActive: true,
          photoUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400",
          joinedDate: "2022-08-20"
        },
        {
          id: "3",
          name: "Mike Chen",
          email: "mike@sixstarfitness.com",
          category: "Online Training",
          specialty: "HIIT & Cardio",
          experience: "4 years",
          rating: 4.7,
          totalSessions: 89,
          price: "$70/session",
          isActive: true,
          photoUrl: "https://images.unsplash.com/photo-1567013127542-490d757e51cd?w=400",
          joinedDate: "2023-03-10"
        },
        {
          id: "4",
          name: "Emma Davis",
          email: "emma@sixstarfitness.com",
          category: "Workout Programs",
          specialty: "Yoga & Flexibility",
          experience: "6 years",
          rating: 4.6,
          totalSessions: 134,
          price: "$75/session",
          isActive: false,
          photoUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
          joinedDate: "2022-11-05"
        }
      ];

      setTrainers(mockTrainers);
      setFilteredTrainers(mockTrainers);
    } catch (error) {
      console.error("Error fetching trainers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = trainers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(trainer =>
        trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (filterCategory !== "all") {
      filtered = filtered.filter(trainer => trainer.category === filterCategory);
    }

    setFilteredTrainers(filtered);
  }, [searchTerm, filterCategory, trainers]);

  const handleToggleStatus = (trainerId: string) => {
    setTrainers(prev =>
      prev.map(trainer =>
        trainer.id === trainerId
          ? { ...trainer, isActive: !trainer.isActive }
          : trainer
      )
    );
  };

  const handleDeleteTrainer = (trainerId: string) => {
    if (confirm("Are you sure you want to remove this trainer?")) {
      setTrainers(prev => prev.filter(trainer => trainer.id !== trainerId));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#D5FC51]"></div>
            <p className="text-gray-600">Loading trainers...</p>
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
              href="/admin/manage-trainers"
              className="mr-4 rounded-lg p-2 text-gray-600 hover:bg-white hover:text-[#D5FC51] transition-colors"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="mb-2 text-4xl font-bold text-[#2A2A2A]">Manage Trainers</h1>
              <p className="text-lg text-gray-600">
                View and manage all platform trainers
              </p>
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
                placeholder="Search trainers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-[#D5FC51] focus:outline-none focus:ring-2 focus:ring-[#D5FC51]/20"
              />
            </div>
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="appearance-none rounded-lg border border-gray-300 pl-10 pr-8 py-2 focus:border-[#D5FC51] focus:outline-none focus:ring-2 focus:ring-[#D5FC51]/20"
              >
                <option value="all">All Categories</option>
                <option value="Physical Training">Physical Training</option>
                <option value="Diet & Nutrition">Diet & Nutrition</option>
                <option value="Online Training">Online Training</option>
                <option value="Workout Programs">Workout Programs</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredTrainers.length} of {trainers.length} trainers
          </div>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTrainers.map((trainer) => (
            <div key={trainer.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              {/* Trainer Photo and Status */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={trainer.photoUrl || "/default-avatar.png"}
                      alt={trainer.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                      trainer.isActive ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#2A2A2A]">{trainer.name}</h3>
                    <p className="text-sm text-gray-600">{trainer.email}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                  trainer.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {trainer.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Trainer Details */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Category:</span>
                  <span className="text-sm font-medium text-[#2A2A2A]">{trainer.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Specialty:</span>
                  <span className="text-sm font-medium text-[#2A2A2A]">{trainer.specialty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Experience:</span>
                  <span className="text-sm font-medium text-[#2A2A2A]">{trainer.experience}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="text-sm font-medium text-[#2A2A2A]">{trainer.price}</span>
                </div>
              </div>

              {/* Rating and Sessions */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-[#2A2A2A]">{trainer.rating}</span>
                </div>
                <span className="text-sm text-gray-600">{trainer.totalSessions} sessions</span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100 transition-colors">
                  <EyeIcon className="mr-1 h-4 w-4" />
                  View
                </button>
                <button className="flex-1 flex items-center justify-center rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  <PencilIcon className="mr-1 h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleToggleStatus(trainer.id)}
                  className={`flex-1 flex items-center justify-center rounded-lg px-3 py-2 text-sm transition-colors ${
                    trainer.isActive
                      ? 'bg-red-50 text-red-700 hover:bg-red-100'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  {trainer.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDeleteTrainer(trainer.id)}
                  className="rounded-lg bg-red-50 p-2 text-red-700 hover:bg-red-100 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTrainers.length === 0 && (
          <div className="py-16 text-center">
            <UserGroupIcon className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">No trainers found</h3>
            <p className="text-gray-600">
              {searchTerm || filterCategory !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No trainers have been added yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
