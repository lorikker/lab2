"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  ArrowLeftIcon,
  TrashIcon
} from "@heroicons/react/24/outline";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  data?: any;
  isRead?: boolean;
}

export default function AdminNotificationsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!session) {
      router.push('/login');
      return;
    }

    fetchNotifications();
  }, [session, router]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/admin/notifications?limit=50');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'trainer_application':
        return <UserGroupIcon className="h-5 w-5 text-blue-400" />;
      case 'trainer_approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'trainer_removed':
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      default:
        return <BellIcon className="h-5 w-5 text-[#D5FC51]" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D5FC51] mx-auto mb-4"></div>
            <p className="text-gray-400">Loading notifications...</p>
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
              <h1 className="text-4xl font-bold text-white mb-2">All Notifications</h1>
              <p className="text-gray-400 text-lg">Manage your admin notifications</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Total Notifications</p>
            <p className="text-2xl font-bold text-white">{notifications.length}</p>
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <BellIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Notifications</h3>
            <p className="text-gray-400">You don't have any notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-[#D5FC51]/50 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2">
                          {notification.title}
                        </h3>
                        <p className="text-gray-300 mb-3 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{formatDate(notification.createdAt)}</span>
                          <span className="px-2 py-1 bg-gray-700 rounded-full text-xs">
                            {notification.type.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <button className="ml-4 p-2 text-gray-400 hover:text-red-400 transition-colors">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
