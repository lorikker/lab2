"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  StarIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface TrainerDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  specialty: string;
  experience: string;
  rating: number;
  totalSessions: number;
  completedSessions: number;
  price: string;
  isActive: boolean;
  photoUrl?: string;
  joinedDate: string;
  bio: string;
  qualifications: string[];
  availability: string[];
  monthlyRevenue: number;
  clientRetention: number;
}

interface Session {
  id: string;
  clientName: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  status: "completed" | "scheduled" | "cancelled";
  rating?: number;
  notes?: string;
}

export default function TrainerDetailsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const trainerId = params.id as string;
  
  const [trainer, setTrainer] = useState<TrainerDetails | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "sessions" | "performance">("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user?.role !== "ADMIN" && session.user?.role !== "TRAINER") {
      router.push("/");
      return;
    }

    fetchTrainerDetails();
  }, [session, router, trainerId]);

  const fetchTrainerDetails = async () => {
    try {
      // Mock data for demonstration
      const mockTrainer: TrainerDetails = {
        id: trainerId,
        name: "Alex Johnson",
        email: "alex@sixstarfitness.com",
        phone: "+1 (555) 123-4567",
        category: "Physical Training",
        specialty: "Strength & Conditioning",
        experience: "5 years",
        rating: 4.8,
        totalSessions: 156,
        completedSessions: 142,
        price: "$80/session",
        isActive: true,
        photoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        joinedDate: "2023-01-15",
        bio: "Certified personal trainer with 5+ years of experience helping clients achieve their fitness goals. Specializes in strength training, muscle building, and athletic performance.",
        qualifications: [
          "NASM Certified Personal Trainer",
          "Precision Nutrition Level 1",
          "Functional Movement Screen Certified",
          "CPR/AED Certified"
        ],
        availability: ["Monday 6:00-20:00", "Tuesday 6:00-20:00", "Wednesday 6:00-20:00", "Thursday 6:00-20:00", "Friday 6:00-18:00", "Saturday 8:00-16:00"],
        monthlyRevenue: 3200,
        clientRetention: 92
      };

      const mockSessions: Session[] = [
        {
          id: "1",
          clientName: "John Doe",
          date: "2024-01-15",
          time: "09:00",
          duration: "60 min",
          type: "Strength Training",
          status: "completed",
          rating: 5,
          notes: "Great progress on deadlifts"
        },
        {
          id: "2",
          clientName: "Jane Smith",
          date: "2024-01-15",
          time: "14:00",
          duration: "45 min",
          type: "HIIT Training",
          status: "scheduled"
        },
        {
          id: "3",
          clientName: "Mike Wilson",
          date: "2024-01-16",
          time: "10:30",
          duration: "60 min",
          type: "Functional Training",
          status: "scheduled"
        }
      ];

      setTrainer(mockTrainer);
      setSessions(mockSessions);
    } catch (error) {
      console.error("Error fetching trainer details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#D5FC51]"></div>
            <p className="text-gray-600">Loading trainer details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="py-16 text-center">
            <p className="text-gray-600">Trainer not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <Link
            href="/admin/manage-trainers/trainers"
            className="mr-4 rounded-lg p-2 text-gray-600 hover:bg-white hover:text-[#D5FC51] transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <div className="flex-1">
            <h1 className="mb-2 text-4xl font-bold text-[#2A2A2A]">Trainer Details</h1>
            <p className="text-lg text-gray-600">View and manage trainer information</p>
          </div>
        </div>

        {/* Trainer Profile Card */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-start space-y-6 md:flex-row md:space-y-0 md:space-x-8">
            <div className="relative">
              <img
                src={trainer.photoUrl || "/default-avatar.png"}
                alt={trainer.name}
                className="h-32 w-32 rounded-full object-cover"
              />
              <div className={`absolute -bottom-2 -right-2 h-6 w-6 rounded-full border-4 border-white ${
                trainer.isActive ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
            </div>
            
            <div className="flex-1">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#2A2A2A]">{trainer.name}</h2>
                  <p className="text-gray-600">{trainer.email}</p>
                  <p className="text-gray-600">{trainer.phone}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                  trainer.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {trainer.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium text-[#2A2A2A]">{trainer.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Specialty</p>
                  <p className="font-medium text-[#2A2A2A]">{trainer.specialty}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="font-medium text-[#2A2A2A]">{trainer.experience}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-medium text-[#2A2A2A]">{trainer.rating}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sessions</p>
                  <p className="font-medium text-[#2A2A2A]">{trainer.completedSessions}/{trainer.totalSessions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-medium text-[#2A2A2A]">{trainer.price}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600">Bio</p>
                <p className="text-[#2A2A2A]">{trainer.bio}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: UserIcon },
              { id: "sessions", label: "Sessions", icon: CalendarDaysIcon },
              { id: "performance", label: "Performance", icon: ChartBarIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center border-b-2 py-2 px-1 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#D5FC51] text-[#D5FC51]'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <tab.icon className="mr-2 h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-[#2A2A2A]">Qualifications</h3>
              <ul className="space-y-2">
                {trainer.qualifications.map((qual, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircleIcon className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-[#2A2A2A]">{qual}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-[#2A2A2A]">Availability</h3>
              <ul className="space-y-2">
                {trainer.availability.map((time, index) => (
                  <li key={index} className="flex items-center">
                    <ClockIcon className="mr-2 h-4 w-4 text-blue-500" />
                    <span className="text-[#2A2A2A]">{time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "sessions" && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              <h3 className="mb-4 text-lg font-bold text-[#2A2A2A]">Recent Sessions</h3>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[#2A2A2A]">{session.clientName}</p>
                        <p className="text-sm text-gray-600">{session.type}</p>
                        <p className="text-sm text-gray-500">{session.date} at {session.time} ({session.duration})</p>
                      </div>
                      <div className="text-right">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                          session.status === 'completed' ? 'bg-green-100 text-green-800' :
                          session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {session.status}
                        </span>
                        {session.rating && (
                          <div className="mt-1 flex items-center">
                            <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 text-sm text-[#2A2A2A]">{session.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {session.notes && (
                      <p className="mt-2 text-sm text-gray-600 italic">{session.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-[#2A2A2A]">${trainer.monthlyRevenue}</p>
                </div>
                <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Client Retention</p>
                  <p className="text-2xl font-bold text-[#2A2A2A]">{trainer.clientRetention}%</p>
                </div>
                <UserIcon className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-[#2A2A2A]">
                    {Math.round((trainer.completedSessions / trainer.totalSessions) * 100)}%
                  </p>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-[#D5FC51]" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
