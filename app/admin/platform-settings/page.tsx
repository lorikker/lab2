"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CogIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  BellIcon,
  UserIcon,
  CreditCardIcon,
  GlobeAltIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

export default function PlatformSettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    siteName: "SixStar Fitness",
    siteDescription: "Professional Fitness Training Platform",
    allowRegistration: true,
    requireEmailVerification: false,
    enableNotifications: true,
    maintenanceMode: false,
    maxTrainersPerCategory: 10,
    membershipDuration: 30,
  });

  useEffect(() => {
    // Check if user is admin
    if (!session) {
      router.push("/login");
      return;
    }

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [session, router]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettings = () => {
    // Here you would save to database
    alert("Settings saved successfully!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#D5FC51]"></div>
            <p className="text-gray-400">Loading platform settings...</p>
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
                Platform Settings
              </h1>
              <p className="text-lg text-gray-400">
                Configure your SixStar Fitness platform
              </p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* General Settings */}
          <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center">
              <GlobeAltIcon className="mr-3 h-6 w-6 text-[#D5FC51]" />
              <h3 className="text-xl font-bold text-white">General Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) =>
                    handleSettingChange("siteName", e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 text-white focus:border-[#D5FC51] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Site Description
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) =>
                    handleSettingChange("siteDescription", e.target.value)
                  }
                  rows={3}
                  className="w-full rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 text-white focus:border-[#D5FC51] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center">
              <UserIcon className="mr-3 h-6 w-6 text-[#D5FC51]" />
              <h3 className="text-xl font-bold text-white">User Management</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">
                    Allow User Registration
                  </p>
                  <p className="text-sm text-gray-400">
                    Enable new users to register
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleSettingChange(
                      "allowRegistration",
                      !settings.allowRegistration,
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.allowRegistration ? "bg-[#D5FC51]" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.allowRegistration
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Email Verification</p>
                  <p className="text-sm text-gray-400">
                    Require email verification for new accounts
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleSettingChange(
                      "requireEmailVerification",
                      !settings.requireEmailVerification,
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.requireEmailVerification
                      ? "bg-[#D5FC51]"
                      : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.requireEmailVerification
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center">
              <ShieldCheckIcon className="mr-3 h-6 w-6 text-[#D5FC51]" />
              <h3 className="text-xl font-bold text-white">System Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Maintenance Mode</p>
                  <p className="text-sm text-gray-400">
                    Put the site in maintenance mode
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleSettingChange(
                      "maintenanceMode",
                      !settings.maintenanceMode,
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.maintenanceMode ? "bg-red-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.maintenanceMode
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Enable Notifications</p>
                  <p className="text-sm text-gray-400">
                    Allow system notifications
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleSettingChange(
                      "enableNotifications",
                      !settings.enableNotifications,
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.enableNotifications
                      ? "bg-[#D5FC51]"
                      : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.enableNotifications
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Business Settings */}
          <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center">
              <CreditCardIcon className="mr-3 h-6 w-6 text-[#D5FC51]" />
              <h3 className="text-xl font-bold text-white">
                Business Settings
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Max Trainers per Category
                </label>
                <input
                  type="number"
                  value={settings.maxTrainersPerCategory}
                  onChange={(e) =>
                    handleSettingChange(
                      "maxTrainersPerCategory",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 text-white focus:border-[#D5FC51] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Default Membership Duration (days)
                </label>
                <input
                  type="number"
                  value={settings.membershipDuration}
                  onChange={(e) =>
                    handleSettingChange(
                      "membershipDuration",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 text-white focus:border-[#D5FC51] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSaveSettings}
            className="inline-flex items-center rounded-xl bg-[#D5FC51] px-8 py-4 font-bold text-[#2A2A2A] shadow-lg transition-colors hover:bg-[#D5FC51]/90 hover:shadow-xl"
          >
            <CheckIcon className="mr-2 h-5 w-5" />
            Save Settings
          </button>
        </div>

        {/* Back Button */}
        <div className="mt-4 text-center">
          <Link
            href="/admin"
            className="inline-flex items-center text-gray-400 transition-colors hover:text-[#D5FC51]"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
