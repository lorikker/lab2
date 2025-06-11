"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

interface TrainingSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

interface DashboardStats {
  totalSessions: number;
  todaySessions: number;
  upcomingSessions: number;
  completedSessions: number;
}

export default function ManageTrainersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalSessions: 0,
    todaySessions: 0,
    upcomingSessions: 0,
    completedSessions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [updatingSession, setUpdatingSession] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("USER");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    // Check if user has access (ADMIN or TRAINER)
    if (session.user?.role !== "ADMIN" && session.user?.role !== "TRAINER") {
      router.push("/");
      return;
    }

    fetchTrainerData();
  }, [session, router]);

  const updateSessionStatus = async (sessionId: string, status: string, notes?: string) => {
    if (!session?.user?.email) return;

    setUpdatingSession(sessionId);
    try {
      const response = await fetch(`/api/admin/trainer-sessions/${sessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          notes,
          userEmail: session.user.email
        }),
      });

      if (response.ok) {
        // Refresh data
        await fetchTrainerData();
      } else {
        console.error('Failed to update session status');
      }
    } catch (error) {
      console.error('Error updating session status:', error);
    } finally {
      setUpdatingSession(null);
    }
  };

  const fetchTrainerData = async () => {
    try {
      if (!session?.user?.email) {
        setIsLoading(false);
        return;
      }

      // Fetch real data from API
      const response = await fetch(
        `/api/admin/trainer-sessions?userEmail=${encodeURIComponent(session.user.email)}&userRole=${session.user.role || 'USER'}`
      );

      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
        setStats(data.stats || {
          totalSessions: 0,
          todaySessions: 0,
          upcomingSessions: 0,
          completedSessions: 0,
        });
        setUserRole(data.userRole || "USER");
        setUserName(data.userName || "");
      } else {
        // Fallback to mock data if API fails
        const mockSessions: TrainingSession[] = [
          {
            id: "1",
            userId: "user1",
            userName: "John Doe",
            userEmail: "john@example.com",
            date: new Date().toISOString().split('T')[0], // Today
            time: "09:00",
            duration: "60 min",
            type: "Personal Training",
            status: "scheduled",
            notes: "Focus on upper body strength"
          },
          {
            id: "2",
            userId: "user2",
            userName: "Jane Smith",
            userEmail: "jane@example.com",
            date: new Date().toISOString().split('T')[0], // Today
            time: "14:00",
            duration: "45 min",
            type: "Cardio Session",
            status: "scheduled",
            notes: "HIIT workout"
          }
        ];

        setSessions(mockSessions);
        setStats({
          totalSessions: mockSessions.length,
          todaySessions: mockSessions.length,
          upcomingSessions: mockSessions.length,
          completedSessions: 0,
        });
      }

    } catch (error) {
      console.error("Error fetching trainer data:", error);
      // Use empty data on error
      setSessions([]);
      setStats({
        totalSessions: 0,
        todaySessions: 0,
        upcomingSessions: 0,
        completedSessions: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getSessionsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return sessions.filter(session => session.date === dateString);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#D5FC51]"></div>
            <p className="text-gray-600">Loading trainer dashboard...</p>
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
              <h1 className="mb-2 text-4xl font-bold text-[#2A2A2A]">
                {userRole === 'ADMIN' ? 'Admin' : 'Trainer'} Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                {userRole === 'ADMIN'
                  ? 'Manage all training sessions and schedules'
                  : `Welcome ${userName}, manage your training sessions`
                }
              </p>
              {userRole === 'ADMIN' && (
                <div className="mt-2 rounded-lg bg-blue-50 px-3 py-2">
                  <p className="text-sm text-blue-700">
                    👑 Admin View: You can see all trainers' sessions
                  </p>
                </div>
              )}
              {userRole === 'TRAINER' && (
                <div className="mt-2 rounded-lg bg-green-50 px-3 py-2">
                  <p className="text-sm text-green-700">
                    💪 Trainer View: Your personal schedule
                  </p>
                </div>
              )}
            </div>
          </div>
          <button className="flex items-center rounded-lg bg-[#D5FC51] px-4 py-2 text-[#2A2A2A] font-medium hover:opacity-90 transition-opacity">
            <PlusIcon className="mr-2 h-5 w-5" />
            Add Session
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-[#2A2A2A]">{stats.totalSessions}</p>
              </div>
              <CalendarDaysIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Sessions</p>
                <p className="text-2xl font-bold text-[#2A2A2A]">{stats.todaySessions}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-[#D5FC51]" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-[#2A2A2A]">{stats.upcomingSessions}</p>
              </div>
              <UserGroupIcon className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-[#2A2A2A]">{stats.completedSessions}</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            href="/admin/manage-trainers/trainers"
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-[#D5FC51]/50"
          >
            <div className="flex items-center">
              <UserGroupIcon className="mr-3 h-8 w-8 text-[#D5FC51]" />
              <div>
                <h3 className="font-bold text-[#2A2A2A]">All Trainers</h3>
                <p className="text-sm text-gray-600">View and manage trainers</p>
              </div>
            </div>
          </Link>

          <button className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-[#D5FC51]/50">
            <div className="flex items-center">
              <CalendarDaysIcon className="mr-3 h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-bold text-[#2A2A2A]">Schedule Session</h3>
                <p className="text-sm text-gray-600">Book new training session</p>
              </div>
            </div>
          </button>

          <button className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-[#D5FC51]/50">
            <div className="flex items-center">
              <ChartBarIcon className="mr-3 h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-bold text-[#2A2A2A]">Reports</h3>
                <p className="text-sm text-gray-600">View training analytics</p>
              </div>
            </div>
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#2A2A2A]">Training Schedule</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                  >
                    ←
                  </button>
                  <span className="text-lg font-medium text-[#2A2A2A]">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((day, index) => {
                  if (!day) {
                    return <div key={index} className="p-2"></div>;
                  }

                  const daySessions = getSessionsForDate(day);
                  const isToday = day.toDateString() === new Date().toDateString();
                  const isSelected = day.toDateString() === selectedDate.toDateString();

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        relative p-2 text-sm rounded-lg transition-colors min-h-[60px] flex flex-col items-center justify-start
                        ${isToday ? 'bg-[#D5FC51] text-[#2A2A2A] font-bold' : ''}
                        ${isSelected && !isToday ? 'bg-blue-100 text-blue-800' : ''}
                        ${!isToday && !isSelected ? 'hover:bg-gray-100' : ''}
                      `}
                    >
                      <span className="mb-1">{day.getDate()}</span>
                      {daySessions.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {daySessions.slice(0, 2).map((session, i) => (
                            <div
                              key={i}
                              className={`
                                w-2 h-2 rounded-full
                                ${session.status === 'scheduled' ? 'bg-blue-500' : ''}
                                ${session.status === 'completed' ? 'bg-green-500' : ''}
                                ${session.status === 'cancelled' ? 'bg-red-500' : ''}
                              `}
                            />
                          ))}
                          {daySessions.length > 2 && (
                            <span className="text-xs text-gray-600">+{daySessions.length - 2}</span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Session Details */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-[#2A2A2A]">
                {formatDate(selectedDate)}
              </h3>
              
              <div className="space-y-4">
                {getSessionsForDate(selectedDate).length > 0 ? (
                  getSessionsForDate(selectedDate).map((session) => (
                    <div key={session.id} className="rounded-lg border border-gray-200 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-[#2A2A2A]">{session.time}</span>
                        <span className={`
                          rounded-full px-2 py-1 text-xs font-medium
                          ${session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}
                          ${session.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                          ${session.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {session.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{session.userName}</p>
                      <p className="text-xs text-gray-600">{session.userEmail}</p>
                      <p className="mt-1 text-sm text-gray-700">{session.type}</p>
                      <p className="text-xs text-gray-500">{session.duration}</p>
                      {session.notes && (
                        <p className="mt-2 text-xs text-gray-600 italic">{session.notes}</p>
                      )}
                      
                      <div className="mt-3 flex space-x-2">
                        {session.status === 'scheduled' && (
                          <>
                            <button
                              onClick={() => updateSessionStatus(session.id, 'completed')}
                              disabled={updatingSession === session.id}
                              className="flex items-center rounded-md bg-green-50 px-2 py-1 text-xs text-green-700 hover:bg-green-100 disabled:opacity-50"
                            >
                              <CheckCircleIcon className="mr-1 h-3 w-3" />
                              {updatingSession === session.id ? 'Updating...' : 'Complete'}
                            </button>
                            <button
                              onClick={() => updateSessionStatus(session.id, 'cancelled')}
                              disabled={updatingSession === session.id}
                              className="flex items-center rounded-md bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100 disabled:opacity-50"
                            >
                              <XCircleIcon className="mr-1 h-3 w-3" />
                              Cancel
                            </button>
                          </>
                        )}
                        {session.status === 'completed' && (
                          <button
                            onClick={() => updateSessionStatus(session.id, 'scheduled')}
                            disabled={updatingSession === session.id}
                            className="flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                          >
                            <ClockIcon className="mr-1 h-3 w-3" />
                            Reschedule
                          </button>
                        )}
                        {session.status === 'cancelled' && (
                          <button
                            onClick={() => updateSessionStatus(session.id, 'scheduled')}
                            disabled={updatingSession === session.id}
                            className="flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                          >
                            <ClockIcon className="mr-1 h-3 w-3" />
                            Reactivate
                          </button>
                        )}
                        <button className="flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100">
                          <EyeIcon className="mr-1 h-3 w-3" />
                          View
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <CalendarDaysIcon className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                    <p className="text-gray-500">No sessions scheduled for this day</p>
                    <button className="mt-2 text-sm text-[#D5FC51] hover:underline">
                      Add a session
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule Overview */}
        <div className="mt-8">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-[#2A2A2A]">Today's Schedule Overview</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {sessions
                .filter(session => session.date === new Date().toISOString().split('T')[0])
                .map((session) => (
                  <div key={session.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-lg font-bold text-[#2A2A2A]">{session.time}</span>
                      <span className={`
                        rounded-full px-2 py-1 text-xs font-medium
                        ${session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}
                        ${session.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                        ${session.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {session.status}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900">{session.userName}</p>
                    <p className="text-sm text-gray-600">{session.type}</p>
                    <p className="text-xs text-gray-500">{session.duration}</p>

                    <div className="mt-3 flex space-x-1">
                      <button className="flex-1 rounded-md bg-[#D5FC51] px-2 py-1 text-xs text-[#2A2A2A] hover:opacity-90">
                        Start
                      </button>
                      <button className="flex-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200">
                        Reschedule
                      </button>
                    </div>
                  </div>
                ))}

              {sessions.filter(session => session.date === new Date().toISOString().split('T')[0]).length === 0 && (
                <div className="col-span-full py-8 text-center">
                  <ClockIcon className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                  <p className="text-gray-500">No sessions scheduled for today</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-[#2A2A2A]">This Week's Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sessions Completed</span>
                <span className="text-lg font-bold text-green-600">12/15</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Client Satisfaction</span>
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-lg font-bold text-[#2A2A2A]">4.8</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Revenue Generated</span>
                <span className="text-lg font-bold text-[#D5FC51]">$960</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">No-shows</span>
                <span className="text-lg font-bold text-red-600">2</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-[#2A2A2A]">Upcoming Milestones</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-700">100th session milestone - 8 sessions away</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-700">Perfect week streak - 3 days to go</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-700">Monthly revenue goal - $240 remaining</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <span className="text-sm text-gray-700">Client retention goal - 95% achieved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
