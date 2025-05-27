'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
  const [activeMembership, setActiveMembership] = useState<Membership | null>(null);
  const [membershipHistory, setMembershipHistory] = useState<Membership[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [activeTab, setActiveTab] = useState('active');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchMembershipData();
    }
  }, [status, router]);

  const fetchMembershipData = async () => {
    try {
      setLoading(true);

      // Fetch active membership
      const activeResponse = await fetch('/api/memberships?type=active');
      if (activeResponse.ok) {
        const activeData = await activeResponse.json();
        setActiveMembership(activeData.membership);
      }

      // Fetch membership history
      const historyResponse = await fetch('/api/memberships?type=history');
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setMembershipHistory(historyData.memberships);
      }

      // Fetch payment history
      const paymentsResponse = await fetch('/api/memberships?type=payments');
      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        setPaymentHistory(paymentsData.payments);
      }
    } catch (error) {
      console.error('Error fetching membership data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'expired': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your membership data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Membership Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your SixStar Fitness membership</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active Membership
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Membership History
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Payment History
            </button>
          </nav>
        </div>

        {/* Active Membership Tab */}
        {activeTab === 'active' && (
          <div className="bg-white shadow rounded-lg p-6">
            {activeMembership ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Current Membership</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(activeMembership.status)}`}>
                    {activeMembership.status.charAt(0).toUpperCase() + activeMembership.status.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 capitalize">{activeMembership.membershipType}</h3>
                    <p className="text-blue-600">Membership Type</p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-900">{activeMembership.daysRemaining}</h3>
                    <p className="text-green-600">Days Remaining</p>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-900">{activeMembership.daysActive}</h3>
                    <p className="text-purple-600">Days Active</p>
                  </div>
                  
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-900">${activeMembership.price}</h3>
                    <p className="text-yellow-600">Monthly Price</p>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Membership Period</h4>
                    <p className="text-gray-600">
                      <strong>Start:</strong> {formatDate(activeMembership.startDate)}
                    </p>
                    <p className="text-gray-600">
                      <strong>End:</strong> {formatDate(activeMembership.endDate)}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Payment Details</h4>
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
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Membership</h3>
                <p className="text-gray-600 mb-6">You don't have an active membership. Choose a plan to get started!</p>
                <button
                  onClick={() => router.push('/membership')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Choose a Plan
                </button>
              </div>
            )}
          </div>
        )}

        {/* Membership History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Membership History</h2>
            </div>
            
            {membershipHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Active</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {membershipHistory.map((membership) => (
                      <tr key={membership.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                          {membership.membershipType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(membership.status)}`}>
                            {membership.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(membership.startDate)} - {formatDate(membership.endDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {membership.daysActive} days
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${membership.price} {membership.currency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No membership history found.</p>
              </div>
            )}
          </div>
        )}

        {/* Payment History Tab */}
        {activeTab === 'payments' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
            </div>
            
            {paymentHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.orderNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {payment.membershipType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${payment.amount} {payment.currency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(payment.paymentDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No payment history found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
