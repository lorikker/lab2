"use client";

import { useState } from "react";
import Link from "next/link";
import { Cart } from "@/app/lib/shop-data";
import { useCoupon } from "@/app/_contexts/coupon-context";

export default function CartSummary({ cart }: { cart: Cart }) {
  const [couponCode, setCouponCode] = useState("");
  const {
    appliedCoupon,
    discount,
    isApplyingCoupon,
    couponError,
    couponSuccess,
    applyCoupon,
    removeCoupon,
    clearMessages,
  } = useCoupon();

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    await applyCoupon(couponCode, cart?.total || 0);
    if (!couponError) {
      setCouponCode(""); // Clear the input on success
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    removeCoupon();
  };

  // Calculate totals
  const subtotal = cart?.total || 0;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = (subtotal - discount) * 0.07; // 7% tax
  const total = subtotal - discount + shipping + tax;

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="p-6">
        <h2 className="mb-4 text-xl font-semibold text-[#2A2A2A]">
          Order Summary
        </h2>

        {/* Coupon form */}
        <div className="mb-6">
          {!appliedCoupon ? (
            <form onSubmit={handleApplyCoupon}>
              <div className="mb-2 flex">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Promo code"
                  disabled={isApplyingCoupon}
                  className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                />
                <button
                  type="submit"
                  disabled={isApplyingCoupon || !couponCode.trim()}
                  className="hover:bg-opacity-90 rounded-r-md bg-[#2A2A2A] px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {isApplyingCoupon ? "Applying..." : "Apply"}
                </button>
              </div>

              {couponError && (
                <p className="text-xs text-red-500">{couponError}</p>
              )}
            </form>
          ) : (
            <div className="rounded-md border border-green-200 bg-green-50 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Coupon Applied: {appliedCoupon.code}
                  </p>
                  <p className="text-xs text-green-600">
                    {appliedCoupon.isPercent
                      ? `${appliedCoupon.discount}% discount`
                      : `$${appliedCoupon.discount} off`}
                  </p>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-xs text-green-700 underline hover:text-green-900"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {couponSuccess && !appliedCoupon && (
            <p className="mt-2 text-xs text-green-500">{couponSuccess}</p>
          )}
        </div>

        {/* Order details */}
        <div className="space-y-3 border-b border-gray-200 pb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium text-green-600">
                -{formatPrice(discount)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">
              {shipping === 0 ? "Free" : formatPrice(shipping)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (7%)</span>
            <span className="font-medium">{formatPrice(tax)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="mt-4 flex justify-between">
          <span className="text-lg font-medium text-[#2A2A2A]">Total</span>
          <span className="text-lg font-bold text-[#2A2A2A]">
            {formatPrice(total)}
          </span>
        </div>

        {/* Checkout button */}
        <div className="mt-6">
          <Link
            href="/shop/checkout"
            className="block w-full rounded-md bg-[#D5FC51] py-3 text-center font-medium text-[#2A2A2A] transition-colors hover:bg-[#D5FC51]/80"
          >
            Proceed to Checkout
          </Link>
        </div>

        {/* Continue shopping */}
        <div className="mt-4 text-center">
          <Link
            href="/shop"
            className="text-sm text-gray-600 hover:text-[#D5FC51]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
