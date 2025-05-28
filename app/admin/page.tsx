"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  UserIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  CreditCardIcon
} from "@heroicons/react/24/outline";

interface DashboardStats {
  totalUsers: number;
  totalTrainers: number;
  pendingApplications: number;
  totalNotifications: number;
  totalMemberships: number;
  activeMemberships: number;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  data?: any;
}

interface RecentActivity {
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
  recentApplications: Array<{
    id: number;
    name: string;
    email: string;
    category: string;
    status: string;
    createdAt: string;
  }>;
  recentMemberships: Array<{
    id: number;
    name: string;
    membershipType: string;
    startDate: string;
    endDate: string;
    createdAt: string;
  }>;
  monthlyStats: {
    newUsers: number;
    newTrainers: number;
    newMemberships: number;
    pendingApplications: number;
  };
}

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalTrainers: 0,
    pendingApplications: 0,
    totalNotifications: 0,
    totalMemberships: 0,
    activeMemberships: 0
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activity, setActivity] = useState<RecentActivity>({
    recentUsers: [],
    recentApplications: [],
    recentMemberships: [],
    monthlyStats: {
      newUsers: 0,
      newTrainers: 0,
      newMemberships: 0,
      pendingApplications: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!session) {
      router.push('/login');
      return;
    }

    fetchDashboardData();
  }, [session, router]);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [statsResponse, notificationsResponse, activityResponse] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/notifications?limit=5'),
        fetch('/api/admin/activity')
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }

      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json();
        setNotifications(notificationsData.notifications || []);
      }

      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setActivity(activityData);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D5FC51] mx-auto mb-4"></div>
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400 text-lg">Manage your SixStar Fitness platform</p>
        </div>

        {/* Stats Cards - Clickable */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            href="/dashboard/users"
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-[#D5FC51]/50 transition-all duration-300 group hover:scale-105 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm group-hover:text-[#D5FC51] transition-colors">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500 mt-1">Click to view all users</p>
              </div>
              <UserIcon className="h-8 w-8 text-[#D5FC51] group-hover:scale-110 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/manage-trainers"
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-[#D5FC51]/50 transition-all duration-300 group hover:scale-105 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm group-hover:text-[#D5FC51] transition-colors">Active Trainers</p>
                <p className="text-2xl font-bold text-white">{stats.totalTrainers}</p>
                <p className="text-xs text-gray-500 mt-1">Click to manage trainers</p>
              </div>
              <UserGroupIcon className="h-8 w-8 text-[#D5FC51] group-hover:scale-110 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/trainer-applications"
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 group hover:scale-105 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm group-hover:text-yellow-500 transition-colors">Pending Applications</p>
                <p className="text-2xl font-bold text-white">{stats.pendingApplications}</p>
                <p className="text-xs text-gray-500 mt-1">Click to review applications</p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-500 group-hover:scale-110 transition-transform" />
            </div>
          </Link>

          <button
            onClick={() => {
              // Scroll to notifications section
              const notificationsSection = document.getElementById('notifications-section');
              if (notificationsSection) {
                notificationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-[#D5FC51]/50 transition-all duration-300 group hover:scale-105 cursor-pointer text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm group-hover:text-[#D5FC51] transition-colors">Notifications</p>
                <p className="text-2xl font-bold text-white">{stats.totalNotifications}</p>
                <p className="text-xs text-gray-500 mt-1">Click to view notifications</p>
              </div>
              <BellIcon className="h-8 w-8 text-[#D5FC51] group-hover:scale-110 transition-transform" />
            </div>
          </button>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Manage Trainers */}
          <Link
            href="/admin/manage-trainers"
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-[#D5FC51]/50 transition-all duration-300 group hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <UserGroupIcon className="h-8 w-8 text-[#D5FC51] mr-3" />
              <h3 className="text-xl font-bold text-white">Manage Trainers</h3>
            </div>
            <p className="text-gray-400 mb-4">
              View, edit, and remove approved trainers from the platform.
            </p>
            <div className="flex items-center text-[#D5FC51] group-hover:text-white transition-colors">
              <span className="text-sm font-medium">Manage Trainers →</span>
            </div>
          </Link>

          {/* Trainer Applications */}
          <Link
            href="/admin/trainer-applications"
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-[#D5FC51]/50 transition-all duration-300 group hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <DocumentTextIcon className="h-8 w-8 text-[#D5FC51] mr-3" />
              <h3 className="text-xl font-bold text-white">Trainer Applications</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Review and approve pending trainer applications.
            </p>
            <div className="flex items-center text-[#D5FC51] group-hover:text-white transition-colors">
              <span className="text-sm font-medium">View Applications →</span>
            </div>
          </Link>

          {/* User Management */}
          <Link
            href="/dashboard/users"
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-[#D5FC51]/50 transition-all duration-300 group hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <UserIcon className="h-8 w-8 text-[#D5FC51] mr-3" />
              <h3 className="text-xl font-bold text-white">User Management</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Manage user accounts, roles, and permissions.
            </p>
            <div className="flex items-center text-[#D5FC51] group-hover:text-white transition-colors">
              <span className="text-sm font-medium">Manage Users →</span>
            </div>
          </Link>

          {/* Reports */}
          <Link
            href="/dashboard/reports"
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-[#D5FC51]/50 transition-all duration-300 group hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <ChartBarIcon className="h-8 w-8 text-[#D5FC51] mr-3" />
              <h3 className="text-xl font-bold text-white">Reports & Analytics</h3>
            </div>
            <p className="text-gray-400 mb-4">
              View platform analytics and generate reports.
            </p>
            <div className="flex items-center text-[#D5FC51] group-hover:text-white transition-colors">
              <span className="text-sm font-medium">View Reports →</span>
            </div>
          </Link>

          {/* Settings */}
          <Link
            href="/admin/platform-settings"
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-[#D5FC51]/50 transition-all duration-300 group hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <CogIcon className="h-8 w-8 text-[#D5FC51] mr-3" />
              <h3 className="text-xl font-bold text-white">Platform Settings</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Configure platform settings and preferences.
            </p>
            <div className="flex items-center text-[#D5FC51] group-hover:text-white transition-colors">
              <span className="text-sm font-medium">Manage Settings →</span>
            </div>
          </Link>

          {/* Quick Actions */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center mb-4">
              <CheckCircleIcon className="h-8 w-8 text-[#D5FC51] mr-3" />
              <h3 className="text-xl font-bold text-white">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <Link
                href="/admin/trainer-applications"
                className="block text-sm text-gray-400 hover:text-[#D5FC51] transition-colors"
              >
                • Review pending applications
              </Link>
              <Link
                href="/admin/manage-trainers"
                className="block text-sm text-gray-400 hover:text-[#D5FC51] transition-colors"
              >
                • Remove inactive trainers
              </Link>
              <Link
                href="/dashboard/users"
                className="block text-sm text-gray-400 hover:text-[#D5FC51] transition-colors"
              >
                • Update user roles
              </Link>
            </div>
          </div>
        </div>

        {/* Real-time Activity & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Notifications */}
          <div id="notifications-section" className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <BellIcon className="h-6 w-6 text-[#D5FC51] mr-3" />
                <h3 className="text-xl font-bold text-white">Recent Notifications</h3>
              </div>
              <Link
                href="/admin/notifications"
                className="text-[#D5FC51] hover:text-white text-sm font-medium transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.slice(0, 4).map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-xl">
                    <div className="flex-shrink-0">
                      {notification.type === 'trainer_application' && (
                        <UserGroupIcon className="h-5 w-5 text-blue-400" />
                      )}
                      {notification.type === 'trainer_approved' && (
                        <CheckCircleIcon className="h-5 w-5 text-green-400" />
                      )}
                      {notification.type === 'trainer_removed' && (
                        <XCircleIcon className="h-5 w-5 text-red-400" />
                      )}
                      {!['trainer_application', 'trainer_approved', 'trainer_removed'].includes(notification.type) && (
                        <BellIcon className="h-5 w-5 text-[#D5FC51]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{notification.title}</p>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BellIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No recent notifications</p>
                </div>
              )}
            </div>
          </div>

          {/* Monthly Statistics */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center mb-6">
              <ArrowTrendingUpIcon className="h-6 w-6 text-[#D5FC51] mr-3" />
              <h3 className="text-xl font-bold text-white">Monthly Growth</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">New Users</p>
                    <p className="text-2xl font-bold text-white">{activity.monthlyStats.newUsers}</p>
                  </div>
                  <UserIcon className="h-8 w-8 text-blue-400" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
              </div>
              <div className="bg-gray-700/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">New Trainers</p>
                    <p className="text-2xl font-bold text-white">{activity.monthlyStats.newTrainers}</p>
                  </div>
                  <UserGroupIcon className="h-8 w-8 text-green-400" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
              </div>
              <div className="bg-gray-700/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Memberships</p>
                    <p className="text-2xl font-bold text-white">{activity.monthlyStats.newMemberships}</p>
                  </div>
                  <CreditCardIcon className="h-8 w-8 text-[#D5FC51]" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
              </div>
              <div className="bg-gray-700/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Pending</p>
                    <p className="text-2xl font-bold text-white">{activity.monthlyStats.pendingApplications}</p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-yellow-400" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Applications</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Users */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 text-[#D5FC51] mr-2" />
                <h4 className="text-lg font-bold text-white">New Users</h4>
              </div>
              <Link href="/dashboard/users" className="text-[#D5FC51] hover:text-white text-sm">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {activity.recentUsers.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center space-x-3 p-2 bg-gray-700/20 rounded-lg">
                  <div className="w-8 h-8 bg-[#D5FC51]/20 rounded-full flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-[#D5FC51]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' :
                    user.role === 'TRAINER' ? 'bg-green-500/20 text-green-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <DocumentTextIcon className="h-5 w-5 text-[#D5FC51] mr-2" />
                <h4 className="text-lg font-bold text-white">Trainer Applications</h4>
              </div>
              <Link href="/admin/trainer-applications" className="text-[#D5FC51] hover:text-white text-sm">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {activity.recentApplications.slice(0, 3).map((application) => (
                <div key={application.id} className="flex items-center space-x-3 p-2 bg-gray-700/20 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <UserGroupIcon className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{application.name}</p>
                    <p className="text-xs text-gray-400 truncate">{application.category}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    application.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                    application.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {application.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Memberships */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CreditCardIcon className="h-5 w-5 text-[#D5FC51] mr-2" />
                <h4 className="text-lg font-bold text-white">Recent Memberships</h4>
              </div>
              <Link href="/dashboard/memberships" className="text-[#D5FC51] hover:text-white text-sm">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {activity.recentMemberships.slice(0, 3).map((membership) => (
                <div key={membership.id} className="flex items-center space-x-3 p-2 bg-gray-700/20 rounded-lg">
                  <div className="w-8 h-8 bg-[#D5FC51]/20 rounded-full flex items-center justify-center">
                    <CreditCardIcon className="h-4 w-4 text-[#D5FC51]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{membership.name}</p>
                    <p className="text-xs text-gray-400 truncate">{membership.membershipType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">
                      {new Date(membership.endDate).toLocaleDateString()}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      new Date(membership.endDate) > new Date()
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {new Date(membership.endDate) > new Date() ? 'Active' : 'Expired'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* System Status & Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* System Health */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <ShieldCheckIcon className="h-6 w-6 text-green-400 mr-3" />
              <h4 className="text-lg font-bold text-white">System Health</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Database</span>
                <span className="text-sm text-green-400">Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">API</span>
                <span className="text-sm text-green-400">Healthy</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Storage</span>
                <span className="text-sm text-[#D5FC51]">85% Used</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <CogIcon className="h-6 w-6 text-[#D5FC51] mr-3" />
              <h4 className="text-lg font-bold text-white">Quick Actions</h4>
            </div>
            <div className="space-y-2">
              <Link href="/admin/backup" className="block text-sm text-gray-400 hover:text-[#D5FC51] transition-colors">
                • Create Backup
              </Link>
              <Link href="/admin/maintenance" className="block text-sm text-gray-400 hover:text-[#D5FC51] transition-colors">
                • Maintenance Mode
              </Link>
              <Link href="/admin/logs" className="block text-sm text-gray-400 hover:text-[#D5FC51] transition-colors">
                • View System Logs
              </Link>
            </div>
          </div>

          {/* Platform Info */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <CalendarDaysIcon className="h-6 w-6 text-blue-400 mr-3" />
              <h4 className="text-lg font-bold text-white">Platform Info</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Version</span>
                <span className="text-sm text-white">v2.1.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Uptime</span>
                <span className="text-sm text-green-400">99.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Last Update</span>
                <span className="text-sm text-gray-300">2 days ago</span>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400 mr-3" />
              <h4 className="text-lg font-bold text-white">Support</h4>
            </div>
            <div className="space-y-2">
              <Link href="/admin/help" className="block text-sm text-gray-400 hover:text-[#D5FC51] transition-colors">
                • Documentation
              </Link>
              <Link href="/admin/contact" className="block text-sm text-gray-400 hover:text-[#D5FC51] transition-colors">
                • Contact Support
              </Link>
              <Link href="/admin/feedback" className="block text-sm text-gray-400 hover:text-[#D5FC51] transition-colors">
                • Send Feedback
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
