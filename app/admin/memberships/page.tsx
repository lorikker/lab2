"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/24/outline";

interface PaidMembership {
  id: string;
  name: string;
  userId: string;
  orderNumber: string;
  membershipType: string;
  status: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentIntentId?: string;
  invoiceNumber?: string;
  paymentDate: string;
  membershipStartDate?: string;
  membershipEndDate?: string;
  userEmail: string;
  createdAt: string;
}

interface ActiveMembership {
  id: string;
  name: string;
  userId: string;
  membershipType: string;
  status: string;
  startDate: string;
  endDate: string;
  daysActive: number;
  daysRemaining: number;
  price: number;
  currency: string;
  userEmail: string;
  createdAt: string;
}

export default function AdminMembershipsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [paidMemberships, setPaidMemberships] = useState<PaidMembership[]>([]);
  const [activeMemberships, setActiveMemberships] = useState<ActiveMembership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<"paid" | "active">("paid");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMembership, setSelectedMembership] = useState<PaidMembership | null>(null);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user?.role !== "ADMIN") {
      router.push("/");
      return;
    }

    fetchPaidMemberships();
    fetchActiveMemberships();
  }, [session, router]);

  const fetchPaidMemberships = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/paid-memberships");
      if (response.ok) {
        const data = await response.json();
        setPaidMemberships(data.paidMemberships || []);
      } else {
        console.error("Failed to fetch paid memberships");
      }
    } catch (error) {
      console.error("Error fetching paid memberships:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActiveMemberships = async () => {
    try {
      const response = await fetch("/api/admin/memberships");
      if (response.ok) {
        const data = await response.json();
        setActiveMemberships(data.memberships || []);
      } else {
        console.error("Failed to fetch active memberships");
      }
    } catch (error) {
      console.error("Error fetching active memberships:", error);
    }
  };

  // Filter functions
  const filteredPaidMemberships = paidMemberships.filter(membership => {
    const matchesSearch = searchTerm === "" ||
      membership.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membership.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membership.membershipType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membership.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || membership.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredActiveMemberships = activeMemberships.filter(membership => {
    const matchesSearch = searchTerm === "" ||
      membership.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membership.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membership.membershipType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || membership.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "EXPIRED":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case "PENDING":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <CreditCardIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "EXPIRED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#D5FC51]"></div>
            <p className="text-gray-600">Loading memberships...</p>
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
              <h1 className="mb-2 text-4xl font-bold text-[#2A2A2A]">Paid Memberships</h1>
              <p className="text-lg text-gray-600">
                View all membership payments and active subscriptions from the database
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-[#2A2A2A]">{paidMemberships.length}</p>
              </div>
              <ReceiptPercentIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Memberships</p>
                <p className="text-2xl font-bold text-[#2A2A2A]">
                  {activeMemberships.filter(m => m.status === "ACTIVE").length}
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-[#2A2A2A]">
                  {formatCurrency(
                    paidMemberships.reduce((sum, m) => sum + m.amount, 0),
                    paidMemberships[0]?.currency || "USD"
                  )}
                </p>
              </div>
              <BanknotesIcon className="h-8 w-8 text-[#D5FC51]" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-[#2A2A2A]">
                  {paidMemberships.filter(m => {
                    const paymentDate = new Date(m.paymentDate);
                    const now = new Date();
                    return paymentDate.getMonth() === now.getMonth() &&
                           paymentDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <CalendarDaysIcon className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setSelectedTab("paid")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === "paid"
                  ? "border-[#D5FC51] text-[#2A2A2A]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Paid Memberships ({paidMemberships.length})
            </button>
            <button
              onClick={() => setSelectedTab("active")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === "active"
                  ? "border-[#D5FC51] text-[#2A2A2A]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Active Memberships ({activeMemberships.length})
            </button>
          </nav>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search memberships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-[#D5FC51] focus:outline-none focus:ring-2 focus:ring-[#D5FC51]/20"
              />
            </div>
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none rounded-lg border border-gray-300 pl-10 pr-8 py-2 focus:border-[#D5FC51] focus:outline-none focus:ring-2 focus:ring-[#D5FC51]/20"
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="EXPIRED">Expired</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Memberships Grid */}
        {selectedTab === "paid" ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPaidMemberships.map((membership) => (
              <div key={membership.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                {/* Member Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 flex-shrink-0 rounded-full bg-[#D5FC51]/20 flex items-center justify-center">
                      <span className="text-[#2A2A2A] font-medium">
                        {membership.name ? membership.name.charAt(0).toUpperCase() : "?"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2A2A2A]">{membership.name}</h3>
                      <p className="text-sm text-gray-600">{membership.userEmail}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(membership.status)}`}>
                    {membership.status}
                  </span>
                </div>

                {/* Payment Details */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Order #:</span>
                    <span className="text-sm font-medium text-[#2A2A2A]">{membership.orderNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Plan:</span>
                    <span className="text-sm font-medium text-[#2A2A2A]">{membership.membershipType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="text-sm font-medium text-[#2A2A2A]">
                      {formatCurrency(membership.amount, membership.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payment Date:</span>
                    <span className="text-sm font-medium text-[#2A2A2A]">
                      {formatDate(membership.paymentDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Method:</span>
                    <span className="text-sm font-medium text-[#2A2A2A]">{membership.paymentMethod}</span>
                  </div>
                  {membership.invoiceNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Invoice:</span>
                      <span className="text-sm font-medium text-[#2A2A2A]">{membership.invoiceNumber}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setSelectedMembership(membership)}
                    className="flex items-center rounded-lg bg-blue-50 px-4 py-2 text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    <EyeIcon className="mr-2 h-4 w-4" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredActiveMemberships.map((membership) => (
              <div key={membership.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                {/* Member Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 flex-shrink-0 rounded-full bg-[#D5FC51]/20 flex items-center justify-center">
                      <span className="text-[#2A2A2A] font-medium">
                        {membership.name ? membership.name.charAt(0).toUpperCase() : "?"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2A2A2A]">{membership.name}</h3>
                      <p className="text-sm text-gray-600">{membership.userEmail}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(membership.status)}`}>
                    {membership.status}
                  </span>
                </div>

                {/* Membership Details */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Plan:</span>
                    <span className="text-sm font-medium text-[#2A2A2A]">{membership.membershipType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Start Date:</span>
                    <span className="text-sm font-medium text-[#2A2A2A]">{formatDate(membership.startDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">End Date:</span>
                    <span className="text-sm font-medium text-[#2A2A2A]">{formatDate(membership.endDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Days Remaining:</span>
                    <span className="text-sm font-medium text-[#2A2A2A]">{membership.daysRemaining}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="text-sm font-medium text-[#2A2A2A]">
                      {formatCurrency(membership.price, membership.currency)}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => console.log("View active membership:", membership.id)}
                    className="flex items-center rounded-lg bg-green-50 px-4 py-2 text-green-700 hover:bg-green-100 transition-colors"
                  >
                    <EyeIcon className="mr-2 h-4 w-4" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {((selectedTab === "paid" && filteredPaidMemberships.length === 0) ||
          (selectedTab === "active" && filteredActiveMemberships.length === 0)) && (
          <div className="py-16 text-center">
            <CreditCardIcon className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">No memberships found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : selectedTab === "paid"
                ? "No paid memberships have been recorded yet."
                : "No active memberships found."}
            </p>
          </div>
        )}

        {/* Payment Detail Modal */}
        {selectedMembership && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#2A2A2A]">Payment Details</h2>
                <button
                  onClick={() => setSelectedMembership(null)}
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Information */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-[#2A2A2A]">Customer Information</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium text-[#2A2A2A]">{selectedMembership.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-[#2A2A2A]">{selectedMembership.userEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-[#2A2A2A]">Payment Information</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-600">Order Number</p>
                      <p className="font-medium text-[#2A2A2A]">{selectedMembership.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-medium text-[#2A2A2A]">
                        {formatCurrency(selectedMembership.amount, selectedMembership.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium text-[#2A2A2A]">{selectedMembership.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Date</p>
                      <p className="font-medium text-[#2A2A2A]">{formatDate(selectedMembership.paymentDate)}</p>
                    </div>
                    {selectedMembership.paymentIntentId && (
                      <div>
                        <p className="text-sm text-gray-600">Payment Intent ID</p>
                        <p className="font-medium text-[#2A2A2A] text-xs break-all">
                          {selectedMembership.paymentIntentId}
                        </p>
                      </div>
                    )}
                    {selectedMembership.invoiceNumber && (
                      <div>
                        <p className="text-sm text-gray-600">Invoice Number</p>
                        <p className="font-medium text-[#2A2A2A]">{selectedMembership.invoiceNumber}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Membership Information */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-[#2A2A2A]">Membership Information</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-600">Plan Type</p>
                      <p className="font-medium text-[#2A2A2A]">{selectedMembership.membershipType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(selectedMembership.status)}`}>
                        {selectedMembership.status}
                      </span>
                    </div>
                    {selectedMembership.membershipStartDate && (
                      <div>
                        <p className="text-sm text-gray-600">Membership Start</p>
                        <p className="font-medium text-[#2A2A2A]">{formatDate(selectedMembership.membershipStartDate)}</p>
                      </div>
                    )}
                    {selectedMembership.membershipEndDate && (
                      <div>
                        <p className="text-sm text-gray-600">Membership End</p>
                        <p className="font-medium text-[#2A2A2A]">{formatDate(selectedMembership.membershipEndDate)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Transaction Details */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-[#2A2A2A]">Transaction Details</h3>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <div>
                        <p className="text-sm text-gray-600">Created At</p>
                        <p className="font-medium text-[#2A2A2A]">{formatDate(selectedMembership.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">User ID</p>
                        <p className="font-medium text-[#2A2A2A] text-xs">{selectedMembership.userId}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
