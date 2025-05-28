"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChartBarIcon,
  ArrowLeftIcon,
  UserIcon,
  UserGroupIcon,
  CreditCardIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon
} from "@heroicons/react/24/outline";

interface ReportData {
  totalUsers: number;
  totalTrainers: number;
  totalMemberships: number;
  monthlyRevenue: number;
  userGrowth: number;
  trainerGrowth: number;
  membershipGrowth: number;
  revenueGrowth: number;
}

export default function ReportsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData>({
    totalUsers: 0,
    totalTrainers: 0,
    totalMemberships: 0,
    monthlyRevenue: 0,
    userGrowth: 0,
    trainerGrowth: 0,
    membershipGrowth: 0,
    revenueGrowth: 0
  });

  useEffect(() => {
    if (!session) {
      router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    fetchReportData();
  }, [session, router]);

  const fetchReportData = async () => {
    try {
      // Fetch stats from admin API
      const [statsResponse, membershipsResponse, growthResponse] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/memberships'),
        fetch('/api/admin/growth')
      ]);

      let totalUsers = 0, totalTrainers = 0, totalMemberships = 0;
      let monthlyRevenue = 0;
      let userGrowth = 0, trainerGrowth = 0, membershipGrowth = 0, revenueGrowth = 0;

      if (statsResponse.ok) {
        const data = await statsResponse.json();
        totalUsers = data.totalUsers || 0;
        totalTrainers = data.totalTrainers || 0;
        totalMemberships = data.totalMemberships || 0;
      }

      if (membershipsResponse.ok) {
        const membershipsData = await membershipsResponse.json();
        monthlyRevenue = membershipsData.memberships?.reduce((sum: number, m: any) => sum + Number(m.price), 0) || 0;
      }

      if (growthResponse.ok) {
        const growthData = await growthResponse.json();
        userGrowth = growthData.userGrowth || 0;
        trainerGrowth = growthData.trainerGrowth || 0;
        membershipGrowth = growthData.membershipGrowth || 0;
        revenueGrowth = growthData.revenueGrowth || 0;
      }

      setReportData({
        totalUsers,
        totalTrainers,
        totalMemberships,
        monthlyRevenue,
        userGrowth,
        trainerGrowth,
        membershipGrowth,
        revenueGrowth
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
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
            <p className="text-gray-400">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              href="/admin"
              className="mr-4 p-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Reports & Analytics</h1>
              <p className="text-gray-400 text-lg">Platform performance and insights</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{reportData.totalUsers}</p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+{reportData.userGrowth}%</span>
                </div>
              </div>
              <UserIcon className="h-8 w-8 text-[#D5FC51]" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Trainers</p>
                <p className="text-2xl font-bold text-white">{reportData.totalTrainers}</p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+{reportData.trainerGrowth}%</span>
                </div>
              </div>
              <UserGroupIcon className="h-8 w-8 text-[#D5FC51]" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Memberships</p>
                <p className="text-2xl font-bold text-white">{reportData.totalMemberships}</p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+{reportData.membershipGrowth}%</span>
                </div>
              </div>
              <CalendarDaysIcon className="h-8 w-8 text-[#D5FC51]" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">${reportData.monthlyRevenue.toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+{reportData.revenueGrowth}%</span>
                </div>
              </div>
              <CreditCardIcon className="h-8 w-8 text-[#D5FC51]" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">User Growth</h3>
            <div className="h-64 bg-gray-700/30 rounded-xl flex items-center justify-center">
              <p className="text-gray-400">Chart placeholder - User growth over time</p>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Revenue Trends</h3>
            <div className="h-64 bg-gray-700/30 rounded-xl flex items-center justify-center">
              <p className="text-gray-400">Chart placeholder - Revenue trends</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/admin"
            className="inline-flex items-center bg-[#D5FC51] text-[#2A2A2A] font-bold px-6 py-3 rounded-xl hover:bg-[#D5FC51]/90 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
