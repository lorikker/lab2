import { Metadata } from "next";
import { ChartBarIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Reports | SixStar Fitness",
};

export default function ReportsPage() {
  return (
    <main className="p-4 md:p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
      </div>
      
      <div className="mt-4 rounded-md bg-white p-6 shadow">
        <div className="flex items-center gap-2">
          <ChartBarIcon className="h-6 w-6 text-gray-600" />
          <h2 className="text-xl font-medium text-gray-900">Fitness Analytics</h2>
        </div>
        
        <p className="mt-2 text-sm text-gray-600">
          View analytics and reports for the fitness center.
        </p>
        
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Membership Stats */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-medium text-gray-900">Membership</h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-[#D5FC51]">247</p>
                <p className="text-sm text-gray-500">Active members</p>
              </div>
              <p className="text-sm font-medium text-green-600">+12% ↑</p>
            </div>
          </div>
          
          {/* Class Attendance */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-medium text-gray-900">Class Attendance</h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-[#D5FC51]">89%</p>
                <p className="text-sm text-gray-500">Average attendance</p>
              </div>
              <p className="text-sm font-medium text-green-600">+5% ↑</p>
            </div>
          </div>
          
          {/* Revenue */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-medium text-gray-900">Monthly Revenue</h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-[#D5FC51]">$12,450</p>
                <p className="text-sm text-gray-500">This month</p>
              </div>
              <p className="text-sm font-medium text-green-600">+8% ↑</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Monthly Activity</h3>
          <div className="h-64 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">Chart visualization will be displayed here</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
