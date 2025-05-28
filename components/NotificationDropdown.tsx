"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  BellIcon,
  CheckIcon,
  XMarkIcon,
  UserPlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import NotificationModal from './NotificationModal';

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
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
        isAdmin = userData.user?.role === 'ADMIN';
      }

      const userId = session.user.email; // Use email as userId

      const response = await fetch(`/api/notifications?userId=${userId}&isAdmin=${isAdmin}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.notifications?.filter((n: Notification) => !n.isRead).length || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationIds: [notificationId]
        }),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!session?.user) return;

    try {
      const userId = session.user.email; // Use email as userId
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          markAllAsRead: true
        }),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
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
      console.log('Sending approval request:', {
        applicationId: applicationId,
        action: 'approve',
        adminId: session?.user?.email,
        adminNotes: ''
      });

      const response = await fetch('/api/admin/approve-trainer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: applicationId,
          action: 'approve',
          adminId: session?.user?.email,
          adminNotes: ''
        }),
      });

      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (response.ok) {
        setIsModalOpen(false);
        setSelectedNotification(null);
        fetchNotifications(); // Refresh notifications
        alert('Trainer application approved successfully!');
      } else {
        console.error('API Error:', responseData);
        alert(`Failed to approve trainer application: ${responseData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error approving trainer:', error);
      alert('Error approving trainer application');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle trainer rejection
  const handleRejectTrainer = async (applicationId: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/admin/approve-trainer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: applicationId,
          action: 'reject',
          adminId: session?.user?.email,
          adminNotes: 'Application rejected by admin'
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setSelectedNotification(null);
        fetchNotifications(); // Refresh notifications
        alert('Trainer application rejected');
      } else {
        alert('Failed to reject trainer application');
      }
    } catch (error) {
      console.error('Error rejecting trainer:', error);
      alert('Error rejecting trainer application');
    } finally {
      setIsProcessing(false);
    }
  };

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'trainer_application':
        return <UserPlusIcon className="h-5 w-5 text-blue-400" />;
      case 'trainer_approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'trainer_rejected':
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      case 'trainer_removed':
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

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Fetch notifications on component mount and when session changes
  useEffect(() => {
    if (session?.user) {
      fetchNotifications();

      // Set up polling for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
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
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-xl shadow-xl border border-gray-700 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-lg font-bold text-white">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-[#D5FC51] hover:text-green-400 transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#D5FC51] mx-auto"></div>
                <p className="text-gray-400 text-sm mt-2">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center">
                <BellIcon className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer ${
                    !notification.isRead ? 'bg-gray-700/30' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-[#D5FC51] rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
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
            <div className="p-3 border-t border-gray-700 text-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // You can add navigation to a full notifications page here
                }}
                className="text-sm text-[#D5FC51] hover:text-green-400 transition-colors"
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
