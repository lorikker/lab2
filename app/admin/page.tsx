"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { grantAdminAccess } from "@/app/_components/dashboard-access-guard";
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
  CreditCardIcon,
  ShoppingBagIcon,
  ReceiptPercentIcon,
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
  isRead: boolean;
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
    activeMemberships: 0,
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
      pendingApplications: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!session) {
      router.push("/login");
      return;
    }

    // Grant admin access when user successfully accesses admin dashboard
    grantAdminAccess();

    fetchDashboardData();
  }, [session, router]);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [statsResponse, notificationsResponse, activityResponse] =
        await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/notifications?limit=5"),
          fetch("/api/admin/activity"),
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
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#D5FC51]"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] pt-20">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-3 text-5xl font-light text-[#2A2A2A]">Dashboard</h1>
          <p className="text-xl text-[#D9D9D9] font-light">
            Manage your SixStar Fitness platform
          </p>
        </div>

        {/* Stats Cards - Minimalistic */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/dashboard/users"
            className="group cursor-pointer rounded-2xl bg-[#FFFFFF] border border-[#D9D9D9]/30 p-8 transition-all duration-200 hover:border-[#D5FC51]/50 hover:shadow-sm"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <UserIcon className="h-6 w-6 text-[#D9D9D9] group-hover:text-[#D5FC51] transition-colors" />
                <span className="text-xs font-medium text-[#D9D9D9] uppercase tracking-wider">Users</span>
              </div>
              <div>
                <p className="text-3xl font-light text-[#2A2A2A] mb-1">
                  {stats.totalUsers}
                </p>
                <p className="text-sm text-[#D9D9D9] font-light">
                  Total registered
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/manage-trainers"
            className="group cursor-pointer rounded-2xl bg-[#FFFFFF] border border-[#D9D9D9]/30 p-8 transition-all duration-200 hover:border-[#D5FC51]/50 hover:shadow-sm"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <UserGroupIcon className="h-6 w-6 text-[#D9D9D9] group-hover:text-[#D5FC51] transition-colors" />
                <span className="text-xs font-medium text-[#D9D9D9] uppercase tracking-wider">Trainers</span>
              </div>
              <div>
                <p className="text-3xl font-light text-[#2A2A2A] mb-1">
                  {stats.totalTrainers}
                </p>
                <p className="text-sm text-[#D9D9D9] font-light">
                  Active trainers
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/trainer-applications"
            className="group cursor-pointer rounded-2xl bg-[#FFFFFF] border border-[#D9D9D9]/30 p-8 transition-all duration-200 hover:border-[#D5FC51]/50 hover:shadow-sm"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <ClockIcon className="h-6 w-6 text-[#D9D9D9] group-hover:text-[#D5FC51] transition-colors" />
                <span className="text-xs font-medium text-[#D9D9D9] uppercase tracking-wider">Pending</span>
              </div>
              <div>
                <p className="text-3xl font-light text-[#2A2A2A] mb-1">
                  {stats.pendingApplications}
                </p>
                <p className="text-sm text-[#D9D9D9] font-light">
                  Applications
                </p>
              </div>
            </div>
          </Link>

          <button
            onClick={() => {
              // Scroll to notifications section
              const notificationsSection = document.getElementById(
                "notifications-section",
              );
              if (notificationsSection) {
                notificationsSection.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }}
            className="group cursor-pointer rounded-2xl bg-[#FFFFFF] border border-[#D9D9D9]/30 p-8 text-left transition-all duration-200 hover:border-[#D5FC51]/50 hover:shadow-sm"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <BellIcon className="h-6 w-6 text-[#D9D9D9] group-hover:text-[#D5FC51] transition-colors" />
                <span className="text-xs font-medium text-[#D9D9D9] uppercase tracking-wider">Alerts</span>
              </div>
              <div>
                <p className="text-3xl font-light text-[#2A2A2A] mb-1">
                  {stats.totalNotifications}
                </p>
                <p className="text-sm text-[#D9D9D9] font-light">
                  Notifications
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Main Actions */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Manage Trainers */}
          <Link
            href="/admin/manage-trainers"
            className="group rounded-3xl bg-[#FFFFFF] border border-[#D9D9D9]/20 p-10 transition-all duration-200 hover:border-[#D5FC51]/30 hover:shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <UserGroupIcon className="h-8 w-8 text-[#D5FC51]" />
              <span className="text-xs font-medium text-[#D9D9D9] uppercase tracking-wider">Management</span>
            </div>
            <h3 className="text-2xl font-light text-[#2A2A2A] mb-3">Manage Trainers</h3>
            <p className="text-[#D9D9D9] font-light leading-relaxed mb-6">
              View, edit, and remove approved trainers from the platform.
            </p>
            <div className="flex items-center text-[#D5FC51] group-hover:text-[#2A2A2A] transition-colors">
              <span className="text-sm font-medium">Manage →</span>
            </div>
          </Link>

          {/* Trainer Applications */}
          <Link
            href="/admin/trainer-applications"
            className="group rounded-3xl bg-[#FFFFFF] border border-[#D9D9D9]/20 p-10 transition-all duration-200 hover:border-[#D5FC51]/30 hover:shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <DocumentTextIcon className="h-8 w-8 text-[#D5FC51]" />
              <span className="text-xs font-medium text-[#D9D9D9] uppercase tracking-wider">Applications</span>
            </div>
            <h3 className="text-2xl font-light text-[#2A2A2A] mb-3">Trainer Applications</h3>
            <p className="text-[#D9D9D9] font-light leading-relaxed mb-6">
              Review and approve pending trainer applications.
            </p>
            <div className="flex items-center text-[#D5FC51] group-hover:text-[#2A2A2A] transition-colors">
              <span className="text-sm font-medium">Review →</span>
            </div>
          </Link>

          {/* User Management */}
          <Link
            href="/dashboard/users"
            className="group rounded-3xl bg-[#FFFFFF] border border-[#D9D9D9]/20 p-10 transition-all duration-200 hover:border-[#D5FC51]/30 hover:shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <UserIcon className="h-8 w-8 text-[#D5FC51]" />
              <span className="text-xs font-medium text-[#D9D9D9] uppercase tracking-wider">Users</span>
            </div>
            <h3 className="text-2xl font-light text-[#2A2A2A] mb-3">User Management</h3>
            <p className="text-[#D9D9D9] font-light leading-relaxed mb-6">
              Manage user accounts, roles, and permissions.
            </p>
            <div className="flex items-center text-[#D5FC51] group-hover:text-[#2A2A2A] transition-colors">
              <span className="text-sm font-medium">Manage →</span>
            </div>
          </Link>

          {/* Shop Management */}
          <Link
            href="/admin/shop"
            className="group rounded-xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#D5FC51]/50"
          >
            <div className="mb-4 flex items-center">
              <ShoppingBagIcon className="mr-3 h-8 w-8 text-[#D5FC51]" />
              <h3 className="text-xl font-bold text-[#2A2A2A]">Shop Management</h3>
            </div>
            <p className="mb-4 text-gray-600">
              Manage products, categories, bundles, and coupons.
            </p>
            <div className="flex items-center text-[#D5FC51] transition-colors group-hover:text-[#2A2A2A]">
              <span className="text-sm font-medium">Manage Shop →</span>
            </div>
          </Link>

          {/* Order Bills */}
          <Link
            href="/admin/order-bills"
            className="group rounded-xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#D5FC51]/50"
          >
            <div className="mb-4 flex items-center">
              <ReceiptPercentIcon className="mr-3 h-8 w-8 text-[#D5FC51]" />
              <h3 className="text-xl font-bold text-[#2A2A2A]">Order Bills</h3>
            </div>
            <p className="mb-4 text-gray-600">
              View and manage customer orders and billing.
            </p>
            <div className="flex items-center text-[#D5FC51] transition-colors group-hover:text-[#2A2A2A]">
              <span className="text-sm font-medium">View Orders →</span>
            </div>
          </Link>

          {/* Reports */}
          <Link
            href="/dashboard/reports"
            className="group rounded-xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#D5FC51]/50"
          >
            <div className="mb-4 flex items-center">
              <ChartBarIcon className="mr-3 h-8 w-8 text-[#D5FC51]" />
              <h3 className="text-xl font-bold text-[#2A2A2A]">
                Reports & Analytics
              </h3>
            </div>
            <p className="mb-4 text-gray-600">
              View platform analytics and generate reports.
            </p>
            <div className="flex items-center text-[#D5FC51] transition-colors group-hover:text-[#2A2A2A]">
              <span className="text-sm font-medium">View Reports →</span>
            </div>
          </Link>

          {/* Settings */}
          <Link
            href="/admin/platform-settings"
            className="group rounded-xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#D5FC51]/50"
          >
            <div className="mb-4 flex items-center">
              <CogIcon className="mr-3 h-8 w-8 text-[#D5FC51]" />
              <h3 className="text-xl font-bold text-[#2A2A2A]">
                Platform Settings
              </h3>
            </div>
            <p className="mb-4 text-gray-600">
              Configure platform settings and preferences.
            </p>
            <div className="flex items-center text-[#D5FC51] transition-colors group-hover:text-[#2A2A2A]">
              <span className="text-sm font-medium">Manage Settings →</span>
            </div>
          </Link>


          {/* Quick Actions */}
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
            <div className="mb-4 flex items-center">
              <CheckCircleIcon className="mr-3 h-8 w-8 text-[#D5FC51]" />
              <h3 className="text-xl font-bold text-[#2A2A2A]">Quick Actions</h3>
            </div>
            <div className="space-y-3">
              <Link
                href="/admin/trainer-applications"
                className="block text-sm text-gray-600 transition-colors hover:text-[#D5FC51]"
              >
                • Review pending applications
              </Link>
              <Link
                href="/admin/shop/products"
                className="block text-sm text-gray-600 transition-colors hover:text-[#D5FC51]"
              >
                • Add new products
              </Link>
              <Link
                href="/admin/order-bills"
                className="block text-sm text-gray-600 transition-colors hover:text-[#D5FC51]"
              >
                • Process pending orders
              </Link>
              <Link
                href="/dashboard/users"
                className="block text-sm text-gray-600 transition-colors hover:text-[#D5FC51]"
              >
                • Update user roles
              </Link>
            </div>
          </div>
        </div>

        {/* Real-time Activity & Insights */}
        <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Recent Notifications */}
          <div
            id="notifications-section"
            className="rounded-3xl bg-[#2A2A2A] p-10"
          >
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-[#D5FC51]/20 p-3">
                  <BellIcon className="h-6 w-6 text-[#D5FC51]" />
                </div>
                <h3 className="text-2xl font-light text-[#FFFFFF]">
                  Recent Notifications
                </h3>
              </div>
              <Link
                href="/admin/notifications"
                className="cursor-pointer text-sm font-medium text-[#D5FC51] transition-colors hover:text-[#FFFFFF]"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.slice(0, 4).map((notification) => (
                  <Link
                    key={notification.id}
                    href="/admin/notifications"
                    className="flex items-start space-x-4 rounded-2xl bg-[#FFFFFF]/5 p-4 transition-all duration-200 hover:bg-[#FFFFFF]/10 cursor-pointer border border-[#FFFFFF]/10"
                  >
                    <div className="flex-shrink-0">
                      {notification.type === "trainer_application" && (
                        <UserGroupIcon className="h-5 w-5 text-blue-500" />
                      )}
                      {notification.type === "trainer_approved" && (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      )}
                      {notification.type === "trainer_removed" && (
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                      )}
                      {notification.type === "booking_confirmed" && (
                        <CalendarDaysIcon className="h-5 w-5 text-[#D5FC51]" />
                      )}
                      {notification.type === "membership_purchased" && (
                        <CreditCardIcon className="h-5 w-5 text-purple-500" />
                      )}
                      {notification.type === "system_alert" && (
                        <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
                      )}
                      {notification.type === "order_created" && (
                        <ShoppingBagIcon className="h-5 w-5 text-blue-500" />
                      )}
                      {![
                        "trainer_application",
                        "trainer_approved",
                        "trainer_removed",
                        "booking_confirmed",
                        "membership_purchased",
                        "system_alert",
                        "order_created"
                      ].includes(notification.type) && (
                        <BellIcon className="h-5 w-5 text-[#D5FC51]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-medium text-[#FFFFFF]">
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <span className="ml-2 h-2 w-2 rounded-full bg-[#D5FC51]"></span>
                        )}
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-[#D9D9D9] font-light">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-xs text-[#D9D9D9]/70 font-light">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-12 text-center">
                  <div className="rounded-full bg-[#D9D9D9]/10 p-6 mx-auto w-fit mb-4">
                    <BellIcon className="h-8 w-8 text-[#D9D9D9]/50" />
                  </div>
                  <p className="text-[#D9D9D9] font-light">No recent notifications</p>
                </div>
              )}
            </div>
          </div>

          {/* Monthly Statistics */}
          <div className="rounded-3xl bg-[#FFFFFF] p-10">
            <div className="mb-8 flex items-center space-x-4">
              <div className="rounded-full bg-[#D5FC51]/20 p-3">
                <ArrowTrendingUpIcon className="h-6 w-6 text-[#D5FC51]" />
              </div>
              <h3 className="text-2xl font-light text-[#2A2A2A]">Monthly Growth</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-2xl bg-[#FFFFFF] border border-[#D9D9D9]/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <UserIcon className="h-6 w-6 text-[#D9D9D9]" />
                  <span className="text-xs font-medium text-[#D9D9D9] uppercase tracking-wider">Users</span>
                </div>
                <div>
                  <p className="text-3xl font-light text-[#2A2A2A] mb-1">
                    {activity.monthlyStats.newUsers}
                  </p>
                  <p className="text-sm text-[#D9D9D9] font-light">Last 30 days</p>
                </div>
              </div>
              <div className="rounded-2xl bg-[#FFFFFF] border border-[#D9D9D9]/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <UserGroupIcon className="h-6 w-6 text-[#D9D9D9]" />
                  <span className="text-xs font-medium text-[#D9D9D9] uppercase tracking-wider">Trainers</span>
                </div>
                <div>
                  <p className="text-3xl font-light text-[#2A2A2A] mb-1">
                    {activity.monthlyStats.newTrainers}
                  </p>
                  <p className="text-sm text-[#D9D9D9] font-light">Last 30 days</p>
                </div>
              </div>
              <div className="rounded-2xl bg-[#D5FC51]/5 border border-[#D5FC51]/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <CreditCardIcon className="h-6 w-6 text-[#D5FC51]" />
                  <span className="text-xs font-medium text-[#D5FC51] uppercase tracking-wider">Memberships</span>
                </div>
                <div>
                  <p className="text-3xl font-light text-[#2A2A2A] mb-1">
                    {activity.monthlyStats.newMemberships}
                  </p>
                  <p className="text-sm text-[#D5FC51]/70 font-light">Last 30 days</p>
                </div>
              </div>
              <div className="rounded-2xl bg-[#FFFFFF] border border-[#D9D9D9]/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <ClockIcon className="h-6 w-6 text-[#D9D9D9]" />
                  <span className="text-xs font-medium text-[#D9D9D9] uppercase tracking-wider">Pending</span>
                </div>
                <div>
                  <p className="text-3xl font-light text-[#2A2A2A] mb-1">
                    {activity.monthlyStats.pendingApplications}
                  </p>
                  <p className="text-sm text-[#D9D9D9] font-light">Applications</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        


      </div>
    </div>
  );
}
