"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

export default function CartIcon() {
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getCartItemCount() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/cart");

        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }

        const cart = await response.json();

        if (cart) {
          // Calculate total number of items in cart
          const count = cart.items.reduce(
            (total, item) => total + item.quantity,
            0,
          );
          setItemCount(count);
        } else {
          setItemCount(0);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        setItemCount(0);
      } finally {
        setIsLoading(false);
      }
    }

    getCartItemCount();

    // Set up an interval to refresh the cart count every 30 seconds
    const intervalId = setInterval(getCartItemCount, 30000);

    // Listen for custom cart update events
    const handleCartUpdate = () => {
      getCartItemCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  return (
    <Link
      href="/shop/cart"
      className="relative flex items-center rounded-md p-2 text-white hover:text-[#D5FC51]"
      title="View Cart"
    >
      <ShoppingBagIcon className="h-6 w-6" />
      {!isLoading && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#D5FC51] text-xs font-bold text-[#2A2A2A]">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
