"use client";

import { useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import CouponForm from "./coupon-form";
// CouponCard component inline
function CouponCard({
  coupon,
  onEdit,
  onDelete,
  loading,
  expired = false,
}: {
  coupon: Coupon;
  onEdit: () => void;
  onDelete: () => void;
  loading: boolean;
  expired?: boolean;
}) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatDiscount = (discount: number, isPercent: boolean) => {
    return isPercent ? `${discount}%` : `$${discount}`;
  };

  const usagePercentage = coupon.maxUses
    ? (coupon.currentUses / coupon.maxUses) * 100
    : 0;

  return (
    <div
      className={`rounded-lg border p-4 ${expired ? "border-gray-200 bg-gray-50" : "border-gray-300 bg-white"} shadow-sm`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <code
              className={`rounded px-2 py-1 font-mono text-sm ${expired ? "bg-gray-200 text-gray-500" : "bg-[#D5FC51] text-[#2A2A2A]"}`}
            >
              {coupon.code}
            </code>
            {expired && (
              <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-600">
                Expired
              </span>
            )}
          </div>

          <div className="mt-2">
            <p
              className={`text-lg font-semibold ${expired ? "text-gray-500" : "text-gray-900"}`}
            >
              {formatDiscount(coupon.discount, coupon.isPercent)} off
            </p>
            <p
              className={`text-sm ${expired ? "text-gray-400" : "text-gray-600"}`}
            >
              Valid: {formatDate(coupon.startDate)} -{" "}
              {formatDate(coupon.endDate)}
            </p>
          </div>

          {coupon.maxUses && (
            <div className="mt-3">
              <div className="flex justify-between text-sm">
                <span className={expired ? "text-gray-400" : "text-gray-600"}>
                  Uses: {coupon.currentUses}/{coupon.maxUses}
                </span>
                <span className={expired ? "text-gray-400" : "text-gray-600"}>
                  {Math.round(usagePercentage)}%
                </span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full ${expired ? "bg-gray-300" : "bg-[#D5FC51]"}`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="ml-2 flex gap-1">
          <button
            onClick={onEdit}
            disabled={loading}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            disabled={loading}
            className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-50"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface Coupon {
  id: string;
  code: string;
  discount: number;
  isPercent: boolean;
  maxUses: number | null;
  currentUses: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface CouponsManagementProps {
  initialCoupons: Coupon[];
}

export default function CouponsManagement({
  initialCoupons,
}: CouponsManagementProps) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddCoupon = () => {
    setEditingCoupon(null);
    setShowForm(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/coupons/${couponId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCoupons(coupons.filter((coupon) => coupon.id !== couponId));
      } else {
        alert("Failed to delete coupon");
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      alert("Error deleting coupon");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = (coupon: Coupon) => {
    if (editingCoupon) {
      // Update existing coupon
      setCoupons(coupons.map((c) => (c.id === coupon.id ? coupon : c)));
    } else {
      // Add new coupon
      setCoupons([coupon, ...coupons]);
    }
    setShowForm(false);
    setEditingCoupon(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCoupon(null);
  };

  const activeCoupons = coupons.filter(
    (coupon) => new Date(coupon.endDate) > new Date(),
  );
  const expiredCoupons = coupons.filter(
    (coupon) => new Date(coupon.endDate) <= new Date(),
  );

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Coupons ({coupons.length})
          </h2>
          <p className="text-sm text-gray-600">
            {activeCoupons.length} active, {expiredCoupons.length} expired
          </p>
        </div>
        <button
          onClick={handleAddCoupon}
          className="flex items-center gap-2 rounded-md bg-[#D5FC51] px-4 py-2 text-sm font-medium text-[#2A2A2A] transition-colors hover:bg-[#D5FC51]/80"
        >
          <PlusIcon className="h-4 w-4" />
          Add Coupon
        </button>
      </div>

      {/* Coupon Form Modal */}
      {showForm && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <CouponForm
              coupon={editingCoupon}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}

      {/* Active Coupons */}
      {activeCoupons.length > 0 && (
        <div>
          <h3 className="text-md mb-4 font-medium text-gray-900">
            Active Coupons
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                onEdit={() => handleEditCoupon(coupon)}
                onDelete={() => handleDeleteCoupon(coupon.id)}
                loading={loading}
              />
            ))}
          </div>
        </div>
      )}

      {/* Expired Coupons */}
      {expiredCoupons.length > 0 && (
        <div>
          <h3 className="text-md mb-4 font-medium text-gray-500">
            Expired Coupons
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {expiredCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                onEdit={() => handleEditCoupon(coupon)}
                onDelete={() => handleDeleteCoupon(coupon.id)}
                loading={loading}
                expired
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {coupons.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No coupons</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first discount coupon.
          </p>
          <div className="mt-6">
            <button
              onClick={handleAddCoupon}
              className="inline-flex items-center gap-2 rounded-md bg-[#D5FC51] px-4 py-2 text-sm font-medium text-[#2A2A2A] transition-colors hover:bg-[#D5FC51]/80"
            >
              <PlusIcon className="h-4 w-4" />
              Add Coupon
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
