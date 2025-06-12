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
            className="group cursor-pointer rounded-2xl bg-[#FFFFFF] border-2 border-[#D9D9D9]/50 p-8 transition-all duration-200 hover:border-[#D5FC51] hover:shadow-md"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <UserIcon className="h-7 w-7 text-[#2A2A2A] group-hover:text-[#D5FC51] transition-colors" />
                <span className="text-sm font-semibold text-[#2A2A2A] uppercase tracking-wider">Users</span>
              </div>
              <div>
                <p className="text-4xl font-medium text-[#2A2A2A] mb-1">
                  {stats.totalUsers}
                </p>
                <p className="text-sm text-[#2A2A2A] font-medium">
                  Total registered
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/manage-trainers"
            className="group cursor-pointer rounded-2xl bg-[#FFFFFF] border-2 border-[#D9D9D9]/50 p-8 transition-all duration-200 hover:border-[#D5FC51] hover:shadow-md"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <UserGroupIcon className="h-7 w-7 text-[#2A2A2A] group-hover:text-[#D5FC51] transition-colors" />
                <span className="text-sm font-semibold text-[#2A2A2A] uppercase tracking-wider">Trainers</span>
              </div>
              <div>
                <p className="text-4xl font-medium text-[#2A2A2A] mb-1">
                  {stats.totalTrainers}
                </p>
                <p className="text-sm text-[#2A2A2A] font-medium">
                  Active trainers
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/trainer-applications"
            className="group cursor-pointer rounded-2xl bg-[#FFFFFF] border-2 border-[#D9D9D9]/50 p-8 transition-all duration-200 hover:border-[#D5FC51] hover:shadow-md"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <ClockIcon className="h-7 w-7 text-[#2A2A2A] group-hover:text-[#D5FC51] transition-colors" />
                <span className="text-sm font-semibold text-[#2A2A2A] uppercase tracking-wider">Pending</span>
              </div>
              <div>
                <p className="text-4xl font-medium text-[#2A2A2A] mb-1">
                  {stats.pendingApplications}
                </p>
                <p className="text-sm text-[#2A2A2A] font-medium">
                  Applications
                </p>
              </div>
            </div>
          </Link>

          <button
            onClick={() => router.push("/admin/notifications")}
            className="group cursor-pointer rounded-2xl bg-[#FFFFFF] border-2 border-[#D9D9D9]/50 p-8 text-left transition-all duration-200 hover:border-[#D5FC51] hover:shadow-md"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <BellIcon className="h-7 w-7 text-[#2A2A2A] group-hover:text-[#D5FC51] transition-colors" />
                <span className="text-sm font-semibold text-[#2A2A2A] uppercase tracking-wider">Alerts</span>
              </div>
              <div>
                <p className="text-4xl font-medium text-[#2A2A2A] mb-1">
                  {stats.totalNotifications}
                </p>
                <p className="text-sm text-[#2A2A2A] font-medium">
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
            className="group rounded-3xl bg-[#FFFFFF] border-2 border-[#D9D9D9]/50 p-10 transition-all duration-200 hover:border-[#D5FC51] hover:shadow-md"
          >
            <div className="mb-6 flex items-center justify-between">
              <UserGroupIcon className="h-10 w-10 text-[#2A2A2A] group-hover:text-[#D5FC51] transition-colors" />
              <span className="text-sm font-semibold text-[#2A2A2A] uppercase tracking-wider">Management</span>
            </div>
            <h3 className="text-2xl font-medium text-[#2A2A2A] mb-3">Manage Trainers</h3>
            <p className="text-[#2A2A2A] font-normal leading-relaxed mb-6">
              View, edit, and remove approved trainers from the platform.
            </p>
            <div className="flex items-center text-[#D5FC51] group-hover:text-[#2A2A2A] transition-colors">
              <span className="mr-2 font-medium">View trainers</span>
              <ArrowTrendingUpIcon className="h-5 w-5" />
            </div>
          </Link>

          {/* Trainer Applications */}
          <Link
            href="/admin/trainer-applications"
            className="group rounded-3xl bg-[#FFFFFF] border-2 border-[#D9D9D9]/50 p-10 transition-all duration-200 hover:border-[#D5FC51] hover:shadow-md"
          >
            <div className="mb-6 flex items-center justify-between">
              <DocumentTextIcon className="h-10 w-10 text-[#2A2A2A] group-hover:text-[#D5FC51] transition-colors" />
              <span className="text-sm font-semibold text-[#2A2A2A] uppercase tracking-wider">Applications</span>
            </div>
            <h3 className="text-2xl font-medium text-[#2A2A2A] mb-3">Trainer Applications</h3>
            <p className="text-[#2A2A2A] font-normal leading-relaxed mb-6">
              Review and approve pending trainer applications.
            </p>
            <div className="flex items-center text-[#D5FC51] group-hover:text-[#2A2A2A] transition-colors">
              <span className="mr-2 font-medium">Review applications</span>
              <ArrowTrendingUpIcon className="h-5 w-5" />
            </div>
          </Link>

          {/* User Management */}
          <Link
            href="/dashboard/users"
            className="group rounded-3xl bg-[#FFFFFF] border-2 border-[#D9D9D9]/50 p-10 transition-all duration-200 hover:border-[#D5FC51] hover:shadow-md"
          >
            <div className="mb-6 flex items-center justify-between">
              <UserIcon className="h-10 w-10 text-[#2A2A2A] group-hover:text-[#D5FC51] transition-colors" />
              <span className="text-sm font-semibold text-[#2A2A2A] uppercase tracking-wider">Users</span>
            </div>
            <h3 className="text-2xl font-medium text-[#2A2A2A] mb-3">User Management</h3>
            <p className="text-[#2A2A2A] font-normal leading-relaxed mb-6">
              Manage user accounts, roles, and permissions.
            </p>
            <div className="flex items-center text-[#D5FC51] group-hover:text-[#2A2A2A] transition-colors">
              <span className="mr-2 font-medium">Manage users</span>
              <ArrowTrendingUpIcon className="h-5 w-5" />
            </div>
          </Link>

          {/* Memberships */}
          <Link
            href="/admin/memberships"
            className="group rounded-3xl bg-[#FFFFFF] border-2 border-[#D9D9D9]/50 p-10 transition-all duration-200 hover:border-[#D5FC51] hover:shadow-md"
          >
            <div className="mb-6 flex items-center justify-between">
              <CreditCardIcon className="h-10 w-10 text-[#2A2A2A] group-hover:text-[#D5FC51] transition-colors" />
              <span className="text-sm font-semibold text-[#2A2A2A] uppercase tracking-wider">Memberships</span>
            </div>
            <h3 className="text-2xl font-medium text-[#2A2A2A] mb-3">Membership Plans</h3>
            <p className="text-[#2A2A2A] font-normal leading-relaxed mb-6">
              Manage membership plans and subscriptions.
            </p>
            <div className="flex items-center text-[#D5FC51] group-hover:text-[#2A2A2A] transition-colors">
              <span className="mr-2 font-medium">Manage plans</span>
              <ArrowTrendingUpIcon className="h-5 w-5" />
            </div>
          </Link>

          {/* Shop Management */}
          <Link
            href="/admin/shop"
            className="group rounded-3xl bg-[#FFFFFF] border-2 border-[#D9D9D9]/50 p-10 transition-all duration-200 hover:border-[#D5FC51] hover:shadow-md"
          >
            <div className="mb-6 flex items-center justify-between">
              <ShoppingBagIcon className="h-10 w-10 text-[#2A2A2A] group-hover:text-[#D5FC51] transition-colors" />
              <span className="text-sm font-semibold text-[#2A2A2A] uppercase tracking-wider">Shop</span>
            </div>
            <h3 className="text-2xl font-medium text-[#2A2A2A] mb-3">Shop Management</h3>
            <p className="text-[#2A2A2A] font-normal leading-relaxed mb-6">
              Manage products, categories, and orders.
            </p>
            <div className="flex items-center text-[#D5FC51] group-hover:text-[#2A2A2A] transition-colors">
              <span className="mr-2 font-medium">Manage shop</span>
              <ArrowTrendingUpIcon className="h-5 w-5" />
            </div>
          </Link>

          {/* Promotions */}
          <Link
            href="/admin/promotions"
            className="group rounded-3xl bg-[#FFFFFF] border-2 border-[#D9D9D9]/50 p-10 transition-all duration-200 hover:border-[#D5FC51] hover:shadow-md"
          >
            <div className="mb-6 flex items-center justify-between">
              <ReceiptPercentIcon className="h-10 w-10 text-[#2A2A2A] group-hover:text-[#D5FC51] transition-colors" />
              <span className="text-sm font-semibold text-[#2A2A2A] uppercase tracking-wider">Promotions</span>
            </div>
            <h3 className="text-2xl font-medium text-[#2A2A2A] mb-3">Coupons & Deals</h3>
            <p className="text-[#2A2A2A] font-normal leading-relaxed mb-6">
              Create and manage promotional offers and discount codes.
            </p>
            <div className="flex items-center text-[#D5FC51] group-hover:text-[#2A2A2A] transition-colors">
              <span className="mr-2 font-medium">Manage promotions</span>
              <ArrowTrendingUpIcon className="h-5 w-5" />
            </div>
          </Link>
        </div>

        {/* Real-time Activity & Insights */}
        <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Recent Notifications */}
          <div
            id="notifications-section"
            className="rounded-3xl bg-[#FFFFFF] border-2 border-[#D9D9D9]/50 p-10 transition-all duration-200 hover:border-[#D5FC51] hover:shadow-md"
          >
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-[#D5FC51]/20 p-3">
                  <BellIcon className="h-6 w-6 text-[#D5FC51]" />
                </div>
                <h3 className="text-2xl font-medium text-[#2A2A2A]">
                  Recent Notifications
                </h3>
              </div>
              <Link
                href="/admin/notifications"
                className="cursor-pointer text-sm font-medium text-[#D5FC51] transition-colors hover:text-[#2A2A2A]"
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
                    className="flex items-start space-x-4 rounded-2xl bg-[#F5F5F5] p-4 transition-all duration-200 hover:bg-[#F0F0F0] cursor-pointer border border-[#D9D9D9]/30"
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
                        <p className="truncate text-sm font-medium text-[#2A2A2A]">
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <span className="ml-2 h-2 w-2 rounded-full bg-[#D5FC51]"></span>
                        )}
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-[#2A2A2A]">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-xs text-[#2A2A2A]/70">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-12 text-center">
                  <div className="rounded-full bg-[#F5F5F5] p-6 mx-auto w-fit mb-4">
                    <BellIcon className="h-8 w-8 text-[#2A2A2A]/50" />
                  </div>
                  <p className="text-[#2A2A2A] font-normal">No recent notifications</p>
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
