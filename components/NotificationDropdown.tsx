"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useWebSocket } from "@/hooks/useWebSocket";
import {
  BellIcon,
  CheckIcon,
  XMarkIcon,
  UserPlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import NotificationModal from "./NotificationModal";

interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  isAdmin: boolean;
  createdAt: string;
}

export default function NotificationDropdown() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!session?.user) return;

    setIsLoading(true);
    try {
      // Check if user is admin by fetching user data from database
      const userResponse = await fetch(`/api/user?email=${session.user.email}`);
      let isAdmin = false;

      if (userResponse.ok) {
        const userData = await userResponse.json();
        isAdmin = userData.user?.role === "ADMIN";
      }

      const userId = session.user.email; // Use email as userId

      const response = await fetch(
        `/api/notifications?userId=${userId}&isAdmin=${isAdmin}`,
      );
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(
          data.notifications?.filter((n: Notification) => !n.isRead).length ||
            0,
        );
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationIds: [notificationId],
        }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!session?.user) return;

    try {
      const userId = session.user.email; // Use email as userId
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          markAllAsRead: true,
        }),
      });

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
    setIsOpen(false);

    // Mark as read if not already read
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  // Handle trainer approval
  const handleApproveTrainer = async (applicationId: string) => {
    setIsProcessing(true);
    try {
      console.log("Sending approval request:", {
        applicationId: applicationId,
        action: "approve",
        adminId: session?.user?.email,
        adminNotes: "",
      });

      const response = await fetch("/api/admin/approve-trainer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: applicationId,
          action: "approve",
          adminId: session?.user?.email,
          adminNotes: "",
        }),
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (response.ok) {
        setIsModalOpen(false);
        setSelectedNotification(null);
        fetchNotifications(); // Refresh notifications
        alert("Trainer application approved successfully!");
      } else {
        console.error("API Error:", responseData);
        alert(
          `Failed to approve trainer application: ${responseData.error || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Error approving trainer:", error);
      alert("Error approving trainer application");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle trainer rejection
  const handleRejectTrainer = async (applicationId: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/admin/approve-trainer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: applicationId,
          action: "reject",
          adminId: session?.user?.email,
          adminNotes: "Application rejected by admin",
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setSelectedNotification(null);
        fetchNotifications(); // Refresh notifications
        alert("Trainer application rejected");
      } else {
        alert("Failed to reject trainer application");
      }
    } catch (error) {
      console.error("Error rejecting trainer:", error);
      alert("Error rejecting trainer application");
    } finally {
      setIsProcessing(false);
    }
  };

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "trainer_application":
        return <UserPlusIcon className="h-5 w-5 text-blue-400" />;
      case "trainer_approved":
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case "trainer_rejected":
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      case "trainer_removed":
        return <TrashIcon className="h-5 w-5 text-orange-400" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  // Format time ago
  const timeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // WebSocket connection for real-time notifications
  const { isConnected } = useWebSocket({
    onNotification: (newNotification) => {
      console.log("Received real-time notification:", newNotification);
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    },
  });

  // Fetch notifications on component mount and when session changes
  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
      // No more polling - WebSocket handles real-time updates!
    }
  }, [session]);

  if (!session?.user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative cursor-pointer p-2 text-gray-400 transition-colors hover:text-white"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-gray-600 bg-[#2A2A2A] shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-600 p-4">
            <h3 className="text-lg font-bold text-white">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-[#D5FC51] transition-colors hover:text-green-400 hover:underline"
                  style={{ cursor: 'pointer' }}
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 transition-colors hover:text-white"
                style={{ cursor: 'pointer' }}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="mx-auto h-6 w-6 animate-spin rounded-full border-b-2 border-[#D5FC51]"></div>
                <p className="mt-2 text-sm text-white">
                  Loading notifications...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center">
                <BellIcon className="mx-auto mb-2 h-8 w-8 text-gray-500" />
                <p className="text-white">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-b border-gray-600 p-4 transition-colors hover:bg-gray-600/50 ${
                    !notification.isRead ? "bg-gray-600/30" : ""
                  }`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm font-medium ${!notification.isRead ? "text-white" : "text-gray-300"}`}
                        >
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <div className="h-2 w-2 flex-shrink-0 rounded-full bg-[#D5FC51]"></div>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-white">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-xs text-gray-300">
                        {timeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-600 p-3 text-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // You can add navigation to a full notifications page here
                }}
                className="text-sm text-[#D5FC51] transition-colors hover:text-green-400 hover:underline"
                style={{ cursor: 'pointer' }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Notification Modal */}
      <NotificationModal
        notification={selectedNotification}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNotification(null);
        }}
        onApprove={handleApproveTrainer}
        onReject={handleRejectTrainer}
        isProcessing={isProcessing}
      />
    </div>
  );
}
