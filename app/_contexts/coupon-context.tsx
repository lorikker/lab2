"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface Coupon {
  id: string;
  code: string;
  discount: number;
  isPercent: boolean;
}

interface CouponContextType {
  appliedCoupon: Coupon | null;
  discount: number;
  isApplyingCoupon: boolean;
  couponError: string;
  couponSuccess: string;
  applyCoupon: (code: string, cartTotal: number) => Promise<void>;
  removeCoupon: () => void;
  clearMessages: () => void;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export function CouponProvider({ children }: { children: React.ReactNode }) {
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discount, setDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Load coupon from localStorage on mount
  useEffect(() => {
    const savedCoupon = localStorage.getItem("appliedCoupon");
    const savedDiscount = localStorage.getItem("couponDiscount");
    
    if (savedCoupon && savedDiscount) {
      try {
        setAppliedCoupon(JSON.parse(savedCoupon));
        setDiscount(parseFloat(savedDiscount));
      } catch (error) {
        console.error("Error loading saved coupon:", error);
        localStorage.removeItem("appliedCoupon");
        localStorage.removeItem("couponDiscount");
      }
    }
  }, []);

  // Save coupon to localStorage when it changes
  useEffect(() => {
    if (appliedCoupon && discount > 0) {
      localStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon));
      localStorage.setItem("couponDiscount", discount.toString());
    } else {
      localStorage.removeItem("appliedCoupon");
      localStorage.removeItem("couponDiscount");
    }
  }, [appliedCoupon, discount]);

  const applyCoupon = async (code: string, cartTotal: number) => {
    // Reset messages
    setCouponError("");
    setCouponSuccess("");

    // Simple validation
    if (!code.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code.trim(),
          cartTotal,
        }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setCouponSuccess(data.message);
        setDiscount(data.discountAmount);
        setAppliedCoupon(data.coupon);
      } else {
        setCouponError(data.error || "Invalid coupon code");
        setDiscount(0);
        setAppliedCoupon(null);
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponError("Failed to apply coupon. Please try again.");
      setDiscount(0);
      setAppliedCoupon(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponError("");
    setCouponSuccess("");
    localStorage.removeItem("appliedCoupon");
    localStorage.removeItem("couponDiscount");
  };

  const clearMessages = () => {
    setCouponError("");
    setCouponSuccess("");
  };

  return (
    <CouponContext.Provider
      value={{
        appliedCoupon,
        discount,
        isApplyingCoupon,
        couponError,
        couponSuccess,
        applyCoupon,
        removeCoupon,
        clearMessages,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
}

export function useCoupon() {
  const context = useContext(CouponContext);
  if (context === undefined) {
    throw new Error("useCoupon must be used within a CouponProvider");
  }
  return context;
}
