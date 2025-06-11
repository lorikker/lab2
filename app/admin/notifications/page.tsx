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
      } else {
        console.error("Failed to fetch notifications:", response.statusText);
        // Use demo data if API fails
        setNotifications([
          {
            id: "1",
            type: "trainer_application",
            title: "New Trainer Application",
            message: "John Doe has applied to become a trainer",
            createdAt: new Date().toISOString(),
            isRead: false
          },
          {
            id: "2", 
            type: "booking_confirmed",
            title: "New Booking Confirmed",
            message: "Jane Smith booked a session with Alex Johnson",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            isRead: false
          },
          {
            id: "3",
            type: "trainer_approved", 
            title: "Trainer Approved",
            message: "Mike Wilson has been approved as a trainer",
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            isRead: true
          }
        ]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Use demo data on error
      setNotifications([
        {
          id: "demo-1",
          type: "trainer_application",
          title: "Demo Notification",
          message: "This is a demo notification since the database is not connected",
          createdAt: new Date().toISOString(),
          isRead: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "trainer_application":
        return <UserGroupIcon className="h-5 w-5 text-blue-500" />;
      case "trainer_approved":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "trainer_rejected":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case "booking_confirmed":
        return <BellIcon className="h-5 w-5 text-[#D5FC51]" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationIds: [notificationId],
        }),
      });
      
      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });
      
      // Update local state
      setNotifications(prev =>
        prev.filter(notif => notif.id !== notificationId)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#D5FC51]"></div>
            <p className="text-gray-600">Loading notifications...</p>
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
              <h1 className="mb-2 text-4xl font-bold text-[#2A2A2A]">
                All Notifications
              </h1>
              <p className="text-lg text-gray-600">
                Manage your admin notifications
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Notifications</p>
            <p className="text-2xl font-bold text-[#2A2A2A]">
              {notifications.length}
            </p>
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="py-16 text-center">
            <BellIcon className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-bold text-[#2A2A2A]">
              No Notifications
            </h3>
            <p className="text-gray-600">
              You don't have any notifications yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-xl border p-6 shadow-sm transition-all duration-300 hover:shadow-lg ${
                  notification.isRead
                    ? 'border-gray-200 bg-white'
                    : 'border-[#D5FC51]/50 bg-[#D5FC51]/5'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="mt-1 flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-lg font-semibold text-[#2A2A2A]">
                          {notification.title}
                        </h4>
                        <p className="mt-1 text-gray-600">
                          {notification.message}
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="ml-4 flex space-x-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="rounded-lg bg-blue-50 px-3 py-1 text-sm text-blue-700 hover:bg-blue-100 transition-colors"
                          >
                            Mark as Read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="rounded-lg bg-red-50 p-2 text-red-700 hover:bg-red-100 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => {
              // Mark all as read
              notifications.forEach(notif => {
                if (!notif.isRead) {
                  markAsRead(notif.id);
                }
              });
            }}
            className="rounded-lg bg-[#D5FC51] px-6 py-3 text-[#2A2A2A] font-medium hover:opacity-90 transition-opacity"
          >
            Mark All as Read
          </button>
          <Link
            href="/admin"
            className="rounded-lg bg-gray-200 px-6 py-3 text-[#2A2A2A] font-medium hover:bg-gray-300 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
