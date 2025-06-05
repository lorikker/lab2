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
  TrashIcon,
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
      router.push("/login");
      return;
    }

    fetchNotifications();
  }, [session, router]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/admin/notifications?limit=50");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "trainer_application":
        return <UserGroupIcon className="h-5 w-5 text-blue-400" />;
      case "trainer_approved":
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case "trainer_removed":
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      default:
        return <BellIcon className="h-5 w-5 text-[#D5FC51]" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#D5FC51]"></div>
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
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/admin"
              className="mr-4 rounded-xl bg-gray-700 p-2 text-white transition-colors hover:bg-gray-600"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="mb-2 text-4xl font-bold text-white">
                All Notifications
              </h1>
              <p className="text-lg text-gray-400">
                Manage your admin notifications
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Total Notifications</p>
            <p className="text-2xl font-bold text-white">
              {notifications.length}
            </p>
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="py-16 text-center">
            <BellIcon className="mx-auto mb-4 h-16 w-16 text-gray-600" />
            <h3 className="mb-2 text-xl font-bold text-white">
              No Notifications
            </h3>
            <p className="text-gray-400">
              You don't have any notifications yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#D5FC51]/50"
              >
                <div className="flex items-start space-x-4">
                  <div className="mt-1 flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-2 text-lg font-bold text-white">
                          {notification.title}
                        </h3>
                        <p className="mb-3 leading-relaxed text-gray-300">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{formatDate(notification.createdAt)}</span>
                          <span className="rounded-full bg-gray-700 px-2 py-1 text-xs">
                            {notification.type.replace("_", " ").toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <button className="ml-4 p-2 text-gray-400 transition-colors hover:text-red-400">
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
            className="inline-flex items-center rounded-xl bg-[#D5FC51] px-6 py-3 font-bold text-[#2A2A2A] transition-colors hover:bg-[#D5FC51]/90"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
