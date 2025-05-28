"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCardIcon,
  ArrowLeftIcon,
  CalendarDaysIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

interface Membership {
  id: string;
  name: string | null;
  userId: string;
  membershipType: string;
  status: string;
  startDate: string;
  endDate: string;
  daysActive: number;
  daysRemaining: number;
  price: number;
  currency: string;
  createdAt: string;
}

export default function MembershipsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [stats, setStats] = useState({
    totalMemberships: 0,
    activeMemberships: 0,
    expiredMemberships: 0,
    monthlyRevenue: 0
  });

  useEffect(() => {
    if (!session) {
      router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    fetchMemberships();
  }, [session, router]);

  const fetchMemberships = async () => {
    try {
      // Fetch all memberships from the API
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();

        // Fetch detailed memberships data
        const membershipsResponse = await fetch('/api/admin/memberships');
        if (membershipsResponse.ok) {
          const membershipsData = await membershipsResponse.json();
          setMemberships(membershipsData.memberships || []);

          // Calculate stats
          const total = membershipsData.memberships?.length || 0;
          const active = membershipsData.memberships?.filter((m: Membership) => m.status === 'active').length || 0;
          const expired = membershipsData.memberships?.filter((m: Membership) => m.status === 'expired').length || 0;
          const revenue = membershipsData.memberships?.reduce((sum: number, m: Membership) => sum + Number(m.price), 0) || 0;

          setStats({
            totalMemberships: total,
            activeMemberships: active,
            expiredMemberships: expired,
            monthlyRevenue: revenue
          });
        }
      }
    } catch (error) {
      console.error('Error fetching memberships:', error);
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
            <p className="text-gray-400">Loading memberships...</p>
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
              <h1 className="text-4xl font-bold text-white mb-2">Memberships</h1>
              <p className="text-gray-400 text-lg">Manage user memberships and subscriptions</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Total Memberships</p>
            <p className="text-2xl font-bold text-white">{stats.totalMemberships}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Memberships</p>
                <p className="text-2xl font-bold text-white">{stats.activeMemberships}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Expired Memberships</p>
                <p className="text-2xl font-bold text-white">{stats.expiredMemberships}</p>
              </div>
              <XCircleIcon className="h-8 w-8 text-red-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">${stats.monthlyRevenue.toFixed(2)}</p>
              </div>
              <CreditCardIcon className="h-8 w-8 text-[#D5FC51]" />
            </div>
          </div>
        </div>

        {/* Memberships List */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-bold text-white">All Memberships</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Member</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Start Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">End Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {memberships.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <CreditCardIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No memberships found</p>
                        <p className="text-sm">Memberships will appear here once users purchase them.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  memberships.map((membership) => (
                    <tr key={membership.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-[#D5FC51]/20 rounded-full flex items-center justify-center mr-3">
                            <UserIcon className="h-5 w-5 text-[#D5FC51]" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{membership.name || 'Unknown User'}</p>
                            <p className="text-gray-400 text-sm">ID: {membership.userId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                          membership.membershipType.toLowerCase() === 'premium'
                            ? 'bg-[#D5FC51]/20 text-[#D5FC51]'
                            : membership.membershipType.toLowerCase() === 'elite'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {membership.membershipType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(membership.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(membership.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                          membership.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {membership.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className={`text-sm font-medium ${
                            membership.daysRemaining > 7 ? 'text-green-400' :
                            membership.daysRemaining > 0 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {membership.daysRemaining > 0 ? `${membership.daysRemaining} days` : 'Expired'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
