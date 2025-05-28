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
  CheckIcon
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
    membershipDuration: 30
  });

  useEffect(() => {
    // Check if user is admin
    if (!session) {
      router.push('/login');
      return;
    }

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [session, router]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // Here you would save to database
    alert('Settings saved successfully!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D5FC51] mx-auto mb-4"></div>
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              href="/admin"
              className="mr-4 p-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Platform Settings</h1>
              <p className="text-gray-400 text-lg">Configure your SixStar Fitness platform</p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Settings */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center mb-6">
              <GlobeAltIcon className="h-6 w-6 text-[#D5FC51] mr-3" />
              <h3 className="text-xl font-bold text-white">General Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-[#D5FC51] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Site Description</label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                  rows={3}
                  className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-[#D5FC51] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center mb-6">
              <UserIcon className="h-6 w-6 text-[#D5FC51] mr-3" />
              <h3 className="text-xl font-bold text-white">User Management</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Allow User Registration</p>
                  <p className="text-gray-400 text-sm">Enable new users to register</p>
                </div>
                <button
                  onClick={() => handleSettingChange('allowRegistration', !settings.allowRegistration)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.allowRegistration ? 'bg-[#D5FC51]' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.allowRegistration ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Email Verification</p>
                  <p className="text-gray-400 text-sm">Require email verification for new accounts</p>
                </div>
                <button
                  onClick={() => handleSettingChange('requireEmailVerification', !settings.requireEmailVerification)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.requireEmailVerification ? 'bg-[#D5FC51]' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.requireEmailVerification ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center mb-6">
              <ShieldCheckIcon className="h-6 w-6 text-[#D5FC51] mr-3" />
              <h3 className="text-xl font-bold text-white">System Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Maintenance Mode</p>
                  <p className="text-gray-400 text-sm">Put the site in maintenance mode</p>
                </div>
                <button
                  onClick={() => handleSettingChange('maintenanceMode', !settings.maintenanceMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Enable Notifications</p>
                  <p className="text-gray-400 text-sm">Allow system notifications</p>
                </div>
                <button
                  onClick={() => handleSettingChange('enableNotifications', !settings.enableNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.enableNotifications ? 'bg-[#D5FC51]' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.enableNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Business Settings */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center mb-6">
              <CreditCardIcon className="h-6 w-6 text-[#D5FC51] mr-3" />
              <h3 className="text-xl font-bold text-white">Business Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Trainers per Category</label>
                <input
                  type="number"
                  value={settings.maxTrainersPerCategory}
                  onChange={(e) => handleSettingChange('maxTrainersPerCategory', parseInt(e.target.value))}
                  className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-[#D5FC51] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Default Membership Duration (days)</label>
                <input
                  type="number"
                  value={settings.membershipDuration}
                  onChange={(e) => handleSettingChange('membershipDuration', parseInt(e.target.value))}
                  className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-[#D5FC51] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSaveSettings}
            className="inline-flex items-center bg-[#D5FC51] text-[#2A2A2A] font-bold px-8 py-4 rounded-xl hover:bg-[#D5FC51]/90 transition-colors shadow-lg hover:shadow-xl"
          >
            <CheckIcon className="h-5 w-5 mr-2" />
            Save Settings
          </button>
        </div>

        {/* Back Button */}
        <div className="mt-4 text-center">
          <Link
            href="/admin"
            className="inline-flex items-center text-gray-400 hover:text-[#D5FC51] transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
