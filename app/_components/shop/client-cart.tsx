"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import CartItemList from "@/app/_components/shop/cart-item-list";
import CartSummary from "@/app/_components/shop/cart-summary";

export default function ClientCart() {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cart");

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const cartData = await response.json();
      setCart(cartData);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to load your cart. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();

    // Listen for cart update events
    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    // Set up a polling interval to refresh the cart every 30 seconds
    const intervalId = setInterval(fetchCart, 30000);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      clearInterval(intervalId);
    };
  }, []);

  // Function to manually refresh the cart
  const handleRefresh = () => {
    fetchCart();
  };

  if (isLoading && !cart) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#D5FC51] border-t-transparent"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 rounded-md bg-[#D5FC51] px-4 py-2 font-medium text-[#2A2A2A]"
        >
          Try Again
        </button>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        {isLoading && (
          <div className="flex items-center text-sm text-gray-500">
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border border-[#D5FC51] border-t-transparent"></div>
            Refreshing...
          </div>
        )}
        <div className="ml-auto">
          <button
            onClick={handleRefresh}
            className="flex items-center rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-600 hover:bg-gray-200"
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <ShoppingBagIcon className="mb-4 h-16 w-16 text-gray-300" />
          <h2 className="mb-2 text-xl font-medium text-[#2A2A2A]">
            Your cart is empty
          </h2>
          <p className="mb-6 text-gray-600">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            href="/shop"
            className="rounded-md bg-[#D5FC51] px-6 py-3 font-medium text-[#2A2A2A] transition-colors hover:bg-[#D5FC51]/80"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CartItemList cart={cart} />
          </div>
          <div>
            <CartSummary cart={cart} />
          </div>
        </div>
      )}
    </>
  );
}
