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

  // Fetch data when currentDate changes (month navigation)
  useEffect(() => {
    if (session?.user?.email) {
      fetchTrainerData();
    }
  }, [currentDate]);

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

      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      // For trainers, filter by their email to show only their own training appointments
      let apiUrl = `/api/admin/trainer-bookings-calendar?month=${month}&year=${year}`;

      if (session.user.role === 'TRAINER' && session.user.email) {
        // Add user email filter to show only appointments where they are the trainee
        apiUrl += `&userEmail=${encodeURIComponent(session.user.email)}`;
      }

      // Use the new trainer bookings calendar API
      const response = await fetch(apiUrl);

      if (response.ok) {
        const data = await response.json();

        // Transform bookings to sessions format for compatibility
        const transformedSessions = (data.bookings || []).map((booking: any) => ({
          id: booking.id,
          userId: booking.userId,
          userName: booking.userName,
          userEmail: booking.userEmail,
          date: booking.date,
          time: booking.time,
          duration: "60 min", // Default duration
          type: booking.sessionType,
          status: booking.status === 'confirmed' ? 'scheduled' : booking.status,
          notes: booking.notes
        }));

        setSessions(transformedSessions);
        setStats({
          totalSessions: data.stats?.totalBookings || 0,
          todaySessions: transformedSessions.filter(s => s.date === new Date().toISOString().split('T')[0]).length,
          upcomingSessions: data.stats?.scheduledBookings || 0,
          completedSessions: data.stats?.completedBookings || 0,
        });
        setUserRole(session.user.role || "USER");
        setUserName(session.user.name || "");
      } else {
        // Use empty data on error
        setSessions([]);
        setStats({
          totalSessions: 0,
          todaySessions: 0,
          upcomingSessions: 0,
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

  const getStatusColor = (status: string, isMyBooking: boolean = false) => {
    // Special RED highlighting for trainer's own bookings - VERY DISTINCTIVE
    if (isMyBooking && userRole === 'TRAINER') {
      switch (status.toLowerCase()) {
        case 'confirmed':
        case 'scheduled':
          return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-600 shadow-xl ring-4 ring-red-500/50';
        case 'pending':
          return 'bg-gradient-to-r from-red-400 to-orange-500 text-white border-red-500 shadow-xl ring-4 ring-red-400/50';
        case 'cancelled':
          return 'bg-gradient-to-r from-red-700 to-red-800 text-white border-red-800 shadow-xl ring-4 ring-red-700/50';
        case 'completed':
          return 'bg-gradient-to-r from-red-600 to-pink-600 text-white border-red-700 shadow-xl ring-4 ring-red-600/50';
        default:
          return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-600 shadow-xl ring-4 ring-red-500/50';
      }
    }

    // Regular muted colors for admin view or other trainers' bookings
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'scheduled':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'pending':
        return 'bg-gray-50 text-gray-600 border-gray-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-600 border-gray-300';
      case 'completed':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
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
              href="/"
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
                <h2 className="text-xl font-bold text-[#2A2A2A]">Training Calendar</h2>
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
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
                {getDaysInMonth(currentDate).map((date, index) => {
                  if (!date) {
                    return <div key={index} className="p-2"></div>;
                  }

                  const sessionsForDate = getSessionsForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isSelected = date.toDateString() === selectedDate.toDateString();

                  // For trainers, since they only see their own bookings, any session on this date is theirs
                  // For admins, we don't highlight dates in red
                  const hasMyAppointments = userRole === 'TRAINER' && sessionsForDate.length > 0;

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={`relative p-2 text-sm transition-all duration-300 ${
                        isSelected
                          ? 'bg-[#D5FC51] text-[#2A2A2A] font-bold'
                          : hasMyAppointments
                          ? 'bg-gradient-to-br from-red-500 to-red-600 text-white font-bold shadow-lg ring-2 ring-red-500/50 hover:from-red-600 hover:to-red-700'
                          : isToday
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className={hasMyAppointments ? 'drop-shadow-sm' : ''}>
                        {date.getDate()}
                      </span>
                      {hasMyAppointments && (
                        <div className="absolute bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white shadow-md"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sessions for Selected Date */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-[#2A2A2A]">
                Sessions for {formatDate(selectedDate)}
              </h3>

              <div className="space-y-4">
                {getSessionsForDate(selectedDate).length === 0 ? (
                  <p className="text-center text-gray-500">No sessions scheduled</p>
                ) : (
                  getSessionsForDate(selectedDate).map((session) => (
                    <div
                      key={session.id}
                      className={`rounded-lg border p-4 transition-all duration-200 ${
                        userRole === 'TRAINER'
                          ? 'border-red-500 bg-gradient-to-r from-red-50 to-red-100 shadow-xl hover:shadow-2xl ring-2 ring-red-500/30 hover:ring-red-500/50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className={`font-medium ${
                          userRole === 'TRAINER' ? 'text-[#2A2A2A] font-bold' : 'text-[#2A2A2A]'
                        }`}>
                          {session.time}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium border ${
                          getStatusColor(session.status, userRole === 'TRAINER')
                        }`}>
                          {session.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{session.userName}</p>
                      <p className="text-sm text-gray-600">{session.type}</p>
                      <p className="text-sm text-gray-600">{session.duration}</p>
                      {session.notes && (
                        <p className="mt-2 text-sm text-gray-500">{session.notes}</p>
                      )}

                      {session.status === 'scheduled' && (
                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => updateSessionStatus(session.id, 'completed')}
                            disabled={updatingSession === session.id}
                            className="rounded bg-green-500 px-3 py-1 text-xs text-white hover:bg-green-600 disabled:opacity-50"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => updateSessionStatus(session.id, 'cancelled')}
                            disabled={updatingSession === session.id}
                            className="rounded bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
