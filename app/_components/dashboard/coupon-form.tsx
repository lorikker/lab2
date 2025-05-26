"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

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

interface CouponFormProps {
  coupon?: Coupon | null;
  onSuccess: (coupon: Coupon) => void;
  onCancel: () => void;
}

export default function CouponForm({ coupon, onSuccess, onCancel }: CouponFormProps) {
  const [formData, setFormData] = useState({
    code: coupon?.code || "",
    discount: coupon?.discount || 0,
    isPercent: coupon?.isPercent ?? true,
    maxUses: coupon?.maxUses || "",
    startDate: coupon?.startDate 
      ? new Date(coupon.startDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    endDate: coupon?.endDate 
      ? new Date(coupon.endDate).toISOString().split('T')[0]
      : "",
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = "Coupon code is required";
    } else if (formData.code.length < 3) {
      newErrors.code = "Coupon code must be at least 3 characters";
    }

    if (!formData.discount || formData.discount <= 0) {
      newErrors.discount = "Discount must be greater than 0";
    }

    if (formData.isPercent && formData.discount > 100) {
      newErrors.discount = "Percentage discount cannot exceed 100%";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const url = coupon ? `/api/coupons/${coupon.id}` : "/api/coupons";
      const method = coupon ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          discount: Number(formData.discount),
          maxUses: formData.maxUses ? Number(formData.maxUses) : null,
        }),
      });

      if (response.ok) {
        const savedCoupon = await response.json();
        onSuccess(savedCoupon);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to save coupon");
      }
    } catch (error) {
      console.error("Error saving coupon:", error);
      alert("Error saving coupon");
    } finally {
      setLoading(false);
    }
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code: result });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          {coupon ? "Edit Coupon" : "Create New Coupon"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Coupon Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Coupon Code
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#D5FC51] focus:outline-none focus:ring-1 focus:ring-[#D5FC51]"
            placeholder="Enter coupon code"
          />
          <button
            type="button"
            onClick={generateCode}
            className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Generate
          </button>
        </div>
        {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
      </div>

      {/* Discount */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Discount
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="number"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#D5FC51] focus:outline-none focus:ring-1 focus:ring-[#D5FC51]"
            placeholder="0"
            min="0"
            step="0.01"
          />
          <select
            value={formData.isPercent ? "percent" : "fixed"}
            onChange={(e) => setFormData({ ...formData, isPercent: e.target.value === "percent" })}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#D5FC51] focus:outline-none focus:ring-1 focus:ring-[#D5FC51]"
          >
            <option value="percent">%</option>
            <option value="fixed">$</option>
          </select>
        </div>
        {errors.discount && <p className="mt-1 text-sm text-red-600">{errors.discount}</p>}
      </div>

      {/* Max Uses */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Maximum Uses (optional)
        </label>
        <input
          type="number"
          value={formData.maxUses}
          onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#D5FC51] focus:outline-none focus:ring-1 focus:ring-[#D5FC51]"
          placeholder="Unlimited"
          min="1"
        />
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#D5FC51] focus:outline-none focus:ring-1 focus:ring-[#D5FC51]"
          />
          {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#D5FC51] focus:outline-none focus:ring-1 focus:ring-[#D5FC51]"
          />
          {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-[#D5FC51] px-4 py-2 text-sm font-medium text-[#2A2A2A] transition-colors hover:bg-[#D5FC51]/80 disabled:opacity-50"
        >
          {loading ? "Saving..." : coupon ? "Update Coupon" : "Create Coupon"}
        </button>
      </div>
    </form>
  );
}
