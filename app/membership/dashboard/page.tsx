"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Membership {
  id: string;
  membershipType: string;
  status: string;
  startDate: string;
  endDate: string;
  daysActive: number;
  daysRemaining: number;
  price: number;
  currency: string;
  paymentMethod: string;
  createdAt: string;
}

interface Payment {
  id: string;
  orderNumber: string;
  membershipType: string;
  amount: number;
  currency: string;
  paymentDate: string;
  invoiceNumber: string;
  status: string;
}

export default function MembershipDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeMembership, setActiveMembership] = useState<Membership | null>(
    null,
  );
  const [membershipHistory, setMembershipHistory] = useState<Membership[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetchMembershipData();
    }
  }, [status, router]);

  const fetchMembershipData = async () => {
    try {
      setLoading(true);

      // Fetch active membership
      const activeResponse = await fetch("/api/memberships?type=active");
      if (activeResponse.ok) {
        const activeData = await activeResponse.json();
        setActiveMembership(activeData.membership);
      }

      // Fetch membership history
      const historyResponse = await fetch("/api/memberships?type=history");
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setMembershipHistory(historyData.memberships);
      }

      // Fetch payment history
      const paymentsResponse = await fetch("/api/memberships?type=payments");
      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        setPaymentHistory(paymentsData.payments);
      }
    } catch (error) {
      console.error("Error fetching membership data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "expired":
        return "text-red-600 bg-red-100";
      case "cancelled":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your membership data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Membership Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your SixStar Fitness membership
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("active")}
              className={`border-b-2 px-1 py-2 text-sm font-medium ${
                activeTab === "active"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Active Membership
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`border-b-2 px-1 py-2 text-sm font-medium ${
                activeTab === "history"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Membership History
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`border-b-2 px-1 py-2 text-sm font-medium ${
                activeTab === "payments"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Payment History
            </button>
          </nav>
        </div>

        {/* Active Membership Tab */}
        {activeTab === "active" && (
          <div className="rounded-lg bg-white p-6 shadow">
            {activeMembership ? (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Current Membership
                  </h2>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(activeMembership.status)}`}
                  >
                    {activeMembership.status.charAt(0).toUpperCase() +
                      activeMembership.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg bg-blue-50 p-4 text-center">
                    <h3 className="text-lg font-semibold text-blue-900 capitalize">
                      {activeMembership.membershipType}
                    </h3>
                    <p className="text-blue-600">Membership Type</p>
                  </div>

                  <div className="rounded-lg bg-green-50 p-4 text-center">
                    <h3 className="text-lg font-semibold text-green-900">
                      {activeMembership.daysRemaining}
                    </h3>
                    <p className="text-green-600">Days Remaining</p>
                  </div>

                  <div className="rounded-lg bg-purple-50 p-4 text-center">
                    <h3 className="text-lg font-semibold text-purple-900">
                      {activeMembership.daysActive}
                    </h3>
                    <p className="text-purple-600">Days Active</p>
                  </div>

                  <div className="rounded-lg bg-yellow-50 p-4 text-center">
                    <h3 className="text-lg font-semibold text-yellow-900">
                      ${activeMembership.price}
                    </h3>
                    <p className="text-yellow-600">Monthly Price</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 font-medium text-gray-900">
                      Membership Period
                    </h4>
                    <p className="text-gray-600">
                      <strong>Start:</strong>{" "}
                      {formatDate(activeMembership.startDate)}
                    </p>
                    <p className="text-gray-600">
                      <strong>End:</strong>{" "}
                      {formatDate(activeMembership.endDate)}
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-2 font-medium text-gray-900">
                      Payment Details
                    </h4>
                    <p className="text-gray-600">
                      <strong>Method:</strong> {activeMembership.paymentMethod}
                    </p>
                    <p className="text-gray-600">
                      <strong>Currency:</strong> {activeMembership.currency}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  No Active Membership
                </h3>
                <p className="mb-6 text-gray-600">
                  You don't have an active membership. Choose a plan to get
                  started!
                </p>
                <button
                  onClick={() => router.push("/membership")}
                  className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  Choose a Plan
                </button>
              </div>
            )}
          </div>
        )}

        {/* Membership History Tab */}
        {activeTab === "history" && (
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Membership History
              </h2>
            </div>

            {membershipHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Days Active
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {membershipHistory.map((membership) => (
                      <tr key={membership.id}>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 capitalize">
                          {membership.membershipType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(membership.status)}`}
                          >
                            {membership.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                          {formatDate(membership.startDate)} -{" "}
                          {formatDate(membership.endDate)}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                          {membership.daysActive} days
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                          ${membership.price} {membership.currency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-600">No membership history found.</p>
              </div>
            )}
          </div>
        )}

        {/* Payment History Tab */}
        {activeTab === "payments" && (
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Payment History
              </h2>
            </div>

            {paymentHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Order #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                          {payment.orderNumber}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 capitalize">
                          {payment.membershipType}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                          ${payment.amount} {payment.currency}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                          {formatDate(payment.paymentDate)}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                          {payment.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(payment.status)}`}
                          >
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-600">No payment history found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
