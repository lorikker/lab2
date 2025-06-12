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

interface TrainerBooking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  trainerId: string;
  trainerName: string;
  trainerEmail: string;
  trainerCategory: string;
  trainerPhoto: string;
  sessionType: string;
  date: string;
  time: string;
  amount: number;
  currency: string;
  status: "confirmed" | "completed" | "cancelled" | "scheduled";
  notes?: string;
  createdAt: string;
}

interface BookingStats {
  totalBookings: number;
  scheduledBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  uniqueTrainers: number;
  uniqueClients: number;
}

export default function ManageTrainersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState<TrainerBooking[]>([]);
  const [bookingsByDate, setBookingsByDate] = useState<Record<string, TrainerBooking[]>>({});
  const [stats, setStats] = useState<BookingStats>({
    totalBookings: 0,
    scheduledBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    uniqueTrainers: 0,
    uniqueClients: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<TrainerBooking | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
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

      // Fetch trainer bookings calendar data
      const response = await fetch(
        `/api/admin/trainer-bookings-calendar?month=${month}&year=${year}`
      );

      if (response.ok) {
        const data = await response.json();

        setBookings(data.bookings || []);
        setBookingsByDate(data.bookingsByDate || {});

        // Update stats to match new format
        setStats({
          totalBookings: data.stats?.totalBookings || 0,
          scheduledBookings: data.stats?.scheduledBookings || 0,
          completedBookings: data.stats?.completedBookings || 0,
          cancelledBookings: data.stats?.cancelledBookings || 0,
          totalRevenue: data.stats?.totalRevenue || 0,
          uniqueTrainers: data.stats?.uniqueTrainers || 0,
          uniqueClients: data.stats?.uniqueClients || 0,
        });

        setUserRole(session.user.role || "USER");
        setUserName(session.user.name || "");
      } else {
        // Fallback to empty data if API fails
        setBookings([]);
        setBookingsByDate({});
        setStats({
          totalBookings: 0,
          scheduledBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          totalRevenue: 0,
          uniqueTrainers: 0,
          uniqueClients: 0,
        });
      }

    } catch (error) {
      console.error("Error fetching trainer data:", error);
      // Use empty data on error
      setBookings([]);
      setBookingsByDate({});
      setStats({
        totalBookings: 0,
        scheduledBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
        uniqueTrainers: 0,
        uniqueClients: 0,
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

  const getBookingsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return bookingsByDate[dateString] || [];
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
              href="/admin"
              className="mr-4 rounded-lg p-2 text-gray-600 hover:bg-white hover:text-[#D5FC51] transition-colors"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="mb-2 text-4xl font-bold text-[#2A2A2A]">
                {userRole === 'ADMIN' ? 'Trainer Management' : 'My Schedule'}
              </h1>
              <p className="text-lg text-gray-600">
                {userRole === 'ADMIN'
                  ? 'Manage all trainer bookings and schedules'
                  : `Welcome ${userName}, view and manage your training sessions`
                }
              </p>
              {userRole === 'ADMIN' && (
                <div className="mt-2 rounded-lg bg-blue-50 px-3 py-2">
                  <p className="text-sm text-blue-700">
                    👑 Admin View: You can see all trainers' bookings
                  </p>
                </div>
              )}
              {userRole === 'TRAINER' && (
                <div className="mt-2 rounded-lg bg-green-50 px-3 py-2">
                  <p className="text-sm text-green-700">
                    💪 Trainer View: Your personal booking schedule
                  </p>
                </div>
              )}
            </div>
          </div>
          <button className="flex items-center rounded-lg bg-[#D5FC51] px-4 py-2 text-[#2A2A2A] font-medium hover:opacity-90 transition-opacity">
            <PlusIcon className="mr-2 h-5 w-5" />
            {userRole === 'ADMIN' ? 'Add Session' : 'Block Time'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {userRole === 'ADMIN' ? 'Total Bookings' : 'My Bookings'}
                </p>
                <p className="text-2xl font-bold text-[#2A2A2A]">{stats.totalBookings}</p>
              </div>
              <CalendarDaysIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {userRole === 'ADMIN' ? 'Scheduled' : 'Upcoming'}
                </p>
                <p className="text-2xl font-bold text-[#2A2A2A]">{stats.scheduledBookings}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-[#D5FC51]" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {userRole === 'ADMIN' ? 'Active Trainers' : 'Completed'}
                </p>
                <p className="text-2xl font-bold text-[#2A2A2A]">
                  {userRole === 'ADMIN' ? stats.uniqueTrainers : stats.completedBookings}
                </p>
              </div>
              <UserGroupIcon className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {userRole === 'ADMIN' ? 'Total Revenue' : 'My Revenue'}
                </p>
                <p className="text-2xl font-bold text-[#2A2A2A]">${stats.totalRevenue}</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>



        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#2A2A2A]">
                  {userRole === 'ADMIN' ? 'All Trainer Bookings' : 'My Training Schedule'}
                </h2>
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

                  const dayBookings = getBookingsForDate(day);
                  const isToday = day.toDateString() === new Date().toDateString();
                  const isSelected = day.toDateString() === selectedDate.toDateString();

                  // Check if logged-in trainer has appointments on this date (only for TRAINER role)
                  // For trainers accessing admin page, check if any booking belongs to them
                  const hasMyAppointments = userRole === 'TRAINER' && dayBookings.some(booking =>
                    booking.trainerEmail === session?.user?.email || booking.trainerId === session?.user?.id
                  );

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        relative p-2 text-sm rounded-lg transition-all duration-300 min-h-[80px] flex flex-col items-center justify-start
                        ${isSelected ? 'bg-[#D5FC51] text-[#2A2A2A] font-bold' : ''}
                        ${hasMyAppointments && !isSelected ? 'bg-gradient-to-br from-red-500 to-red-600 text-white font-bold shadow-lg ring-2 ring-red-500/50 hover:from-red-600 hover:to-red-700' : ''}
                        ${isToday && !isSelected && !hasMyAppointments ? 'bg-blue-100 text-blue-700 font-medium' : ''}
                        ${!isToday && !isSelected && !hasMyAppointments ? 'hover:bg-gray-100' : ''}
                      `}
                    >
                      <span className={`mb-1 ${hasMyAppointments ? 'drop-shadow-sm font-bold' : ''}`}>
                        {day.getDate()}
                      </span>
                      {dayBookings.length > 0 && (
                        <div className="w-full space-y-1">
                          {dayBookings.slice(0, 2).map((booking, i) => (
                            <div
                              key={i}
                              className={`
                                w-full text-xs px-1 py-0.5 rounded text-white truncate
                                ${booking.status === 'confirmed' || booking.status === 'scheduled' ? 'bg-blue-500' : ''}
                                ${booking.status === 'completed' ? 'bg-green-500' : ''}
                                ${booking.status === 'cancelled' ? 'bg-red-500' : ''}
                              `}
                              title={`${booking.time} - ${booking.userName} with ${booking.trainerName}`}
                            >
                              {booking.time} {booking.userName.split(' ')[0]}
                            </div>
                          ))}
                          {dayBookings.length > 2 && (
                            <div className="text-xs text-gray-600 text-center">
                              +{dayBookings.length - 2} more
                            </div>
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
                {getBookingsForDate(selectedDate).length > 0 ? (
                  getBookingsForDate(selectedDate).map((booking) => (
                    <div key={booking.id} className="rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="font-medium text-[#2A2A2A]">{booking.time}</span>
                        <span className={`
                          rounded-full px-2 py-1 text-xs font-medium
                          ${booking.status === 'confirmed' || booking.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}
                          ${booking.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                          ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {booking.status}
                        </span>
                      </div>

                      {/* Client Information */}
                      <div className="mb-3 rounded-md bg-gray-50 p-3">
                        <p className="text-sm font-medium text-gray-900">👤 Client</p>
                        <p className="text-sm font-medium text-[#2A2A2A]">{booking.userName}</p>
                        <p className="text-xs text-gray-600">{booking.userEmail}</p>
                      </div>

                      {/* Trainer Information */}
                      <div className="mb-3 rounded-md bg-blue-50 p-3">
                        <p className="text-sm font-medium text-blue-900">💪 Trainer</p>
                        <p className="text-sm font-medium text-blue-800">{booking.trainerName}</p>
                        <p className="text-xs text-blue-600">{booking.trainerCategory}</p>
                      </div>

                      {/* Session Details */}
                      <div className="mb-3">
                        <p className="text-sm text-gray-700">📋 {booking.sessionType}</p>
                        <p className="text-sm font-medium text-green-600">${booking.amount} {booking.currency}</p>
                      </div>

                      {booking.notes && (
                        <div className="mb-3 rounded-md bg-yellow-50 p-2">
                          <p className="text-xs text-yellow-800">📝 {booking.notes}</p>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowBookingModal(true);
                          }}
                          className="flex items-center rounded-md bg-[#D5FC51] px-3 py-1 text-xs text-[#2A2A2A] hover:opacity-90"
                        >
                          <EyeIcon className="mr-1 h-3 w-3" />
                          View Details
                        </button>
                        {booking.status === 'confirmed' && (
                          <button className="flex items-center rounded-md bg-green-50 px-2 py-1 text-xs text-green-700 hover:bg-green-100">
                            <CheckCircleIcon className="mr-1 h-3 w-3" />
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <CalendarDaysIcon className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                    <p className="text-gray-500">No bookings scheduled for this day</p>
                    <button className="mt-2 text-sm text-[#D5FC51] hover:underline">
                      Add a booking
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
            <h2 className="mb-6 text-xl font-bold text-[#2A2A2A]">
              {userRole === 'ADMIN' ? "Today's All Bookings" : "Today's My Sessions"}
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {getBookingsForDate(new Date()).map((booking) => (
                <div key={booking.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-[#2A2A2A]">{booking.time}</span>
                    <span className={`
                      rounded-full px-2 py-1 text-xs font-medium
                      ${booking.status === 'confirmed' || booking.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}
                      ${booking.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="font-medium text-gray-900">{booking.userName}</p>
                  <p className="text-sm text-gray-600">{booking.sessionType}</p>
                  <p className="text-xs text-gray-500">with {booking.trainerName}</p>
                  <p className="text-xs font-medium text-green-600">${booking.amount}</p>

                  <div className="mt-3 flex space-x-1">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowBookingModal(true);
                      }}
                      className="flex-1 rounded-md bg-[#D5FC51] px-2 py-1 text-xs text-[#2A2A2A] hover:opacity-90"
                    >
                      View Details
                    </button>
                    {booking.status === 'confirmed' && (
                      <button className="flex-1 rounded-md bg-green-100 px-2 py-1 text-xs text-green-700 hover:bg-green-200">
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {getBookingsForDate(new Date()).length === 0 && (
                <div className="col-span-full py-8 text-center">
                  <ClockIcon className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                  <p className="text-gray-500">No bookings scheduled for today</p>
                </div>
              )}
            </div>
          </div>
        </div>



        {/* Booking Details Modal */}
        {showBookingModal && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-w-2xl w-full mx-4 bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#2A2A2A]">Booking Details</h2>
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Booking Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-900">Status</span>
                    <span className={`
                      rounded-full px-4 py-2 text-sm font-medium
                      ${selectedBooking.status === 'confirmed' || selectedBooking.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}
                      ${selectedBooking.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      ${selectedBooking.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </span>
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="text-lg font-medium text-[#2A2A2A]">
                        {new Date(selectedBooking.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="text-lg font-medium text-[#2A2A2A]">{selectedBooking.time}</p>
                    </div>
                  </div>

                  {/* Client Information */}
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h3 className="text-lg font-medium text-[#2A2A2A] mb-3">👤 Client Information</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium text-gray-900">{selectedBooking.userName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-gray-700">{selectedBooking.userEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* Trainer Information */}
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h3 className="text-lg font-medium text-blue-900 mb-3">💪 Trainer Information</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-blue-600">Name</p>
                        <p className="font-medium text-blue-900">{selectedBooking.trainerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-600">Email</p>
                        <p className="text-blue-800">{selectedBooking.trainerEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-600">Category</p>
                        <p className="text-blue-800">{selectedBooking.trainerCategory}</p>
                      </div>
                    </div>
                  </div>

                  {/* Session Information */}
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <h3 className="text-lg font-medium text-green-900 mb-3">📋 Session Information</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-green-600">Session Type</p>
                        <p className="font-medium text-green-900">{selectedBooking.sessionType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-600">Amount</p>
                        <p className="text-lg font-bold text-green-800">${selectedBooking.amount} {selectedBooking.currency}</p>
                      </div>
                      {selectedBooking.notes && (
                        <div>
                          <p className="text-sm text-green-600">Notes</p>
                          <p className="text-green-800">{selectedBooking.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Booking Information */}
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">📅 Booking Information</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Booking ID</p>
                        <p className="font-mono text-sm text-gray-800">{selectedBooking.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Created At</p>
                        <p className="text-gray-800">
                          {new Date(selectedBooking.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-[#D5FC51] text-[#2A2A2A] rounded-lg hover:opacity-90">
                    Edit Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
