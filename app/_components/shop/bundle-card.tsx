"use client";

import { useState, useEffect, useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon, CubeIcon, TagIcon } from "@heroicons/react/24/outline";
import { addToCart } from "@/app/lib/shop-actions";

interface BundleItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
}

interface Bundle {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  images: string[];
  featured: boolean;
  slug: string;
  items?: BundleItem[];
}

export default function BundleCard({ bundle }: { bundle: Bundle }) {
  const initialState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useActionState(addToCart, initialState);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAdding(true);

    const formData = new FormData(e.currentTarget);
    dispatch(formData);
  };

  // Handle state changes
  useEffect(() => {
    if (state.success) {
      // Dispatch a custom event to notify the cart icon to update
      const event = new CustomEvent("cartUpdated");
      window.dispatchEvent(event);

      setShowSuccess(true);
      setIsAdding(false);

      // Hide success message after 3 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      return () => clearTimeout(timer);
    } else if (state.message) {
      // If there was an error
      setIsAdding(false);
    }
  }, [state]);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Calculate original value and savings
  const originalValue = bundle.items?.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0) || 0;

  const currentPrice = bundle.salePrice || bundle.price;
  const savings = originalValue - currentPrice;
  const savingsPercentage = originalValue > 0 ? (savings / originalValue) * 100 : 0;

  return (
    <div className="group relative flex flex-col bg-gradient-to-br from-[#D5FC51]/5 to-[#D5FC51]/10 border border-[#D5FC51]/20 transition-all hover:shadow-lg hover:border-[#D5FC51]/40">
      {/* Bundle indicator */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-[#D5FC51] px-2 py-1 rounded-full">
        <CubeIcon className="h-3 w-3 text-[#2A2A2A]" />
        <span className="text-[10px] font-bold text-[#2A2A2A] uppercase tracking-wide">Bundle</span>
      </div>

      {/* Sale indicator */}
      {bundle.salePrice && (
        <div className="absolute top-3 right-3 z-10 bg-red-500 text-white px-2 py-1 rounded-full">
          <span className="text-[10px] font-bold uppercase tracking-wide">Sale</span>
        </div>
      )}

      {/* Bundle image */}
      <Link
        href={`/shop/bundle/${bundle.slug}`}
        className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
      >
        {bundle.images && bundle.images.length > 0 ? (
          <Image
            src={bundle.images[0]}
            alt={bundle.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <CubeIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Bundle info */}
      <div className="flex flex-1 flex-col p-4">
        {/* Bundle badge */}
        <div className="mb-2 flex items-center gap-1">
          <TagIcon className="h-3 w-3 text-[#D5FC51]" />
          <span className="text-[10px] font-medium tracking-wide text-[#D5FC51] uppercase">
            {bundle.items?.length || 0} Items Bundle
          </span>
        </div>

        {/* Bundle name */}
        <Link href={`/shop/bundle/${bundle.slug}`} className="mb-2">
          <h3 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-[#2A2A2A]">
            {bundle.name}
          </h3>
        </Link>

        {/* Bundle description */}
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {bundle.description}
        </p>

        {/* Pricing with savings */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-sm font-bold text-gray-900">
              {formatPrice(currentPrice)}
            </span>
            {originalValue > currentPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(originalValue)}
              </span>
            )}
          </div>
          
          {savings > 0 && (
            <div className="text-xs text-green-600 font-medium">
              Save {formatPrice(savings)} ({Math.round(savingsPercentage)}% off)
            </div>
          )}
        </div>

        {/* Add to cart button - distinct styling */}
        <form onSubmit={handleAddToCart} className="mt-4">
          <input type="hidden" name="bundleId" value={bundle.id} />
          <input type="hidden" name="quantity" value="1" />

          <button
            type="submit"
            disabled={isAdding || showSuccess}
            className={`w-full py-2.5 text-[10px] font-bold tracking-wide uppercase transition-all border-2 ${
              showSuccess
                ? "bg-green-500 border-green-500 text-white"
                : "bg-[#D5FC51] border-[#D5FC51] text-[#2A2A2A] hover:bg-[#2A2A2A] hover:text-[#D5FC51] hover:border-[#2A2A2A]"
            }`}
          >
            {showSuccess
              ? "Added to cart"
              : isAdding
                ? "Adding..."
                : "Add bundle to cart"}
          </button>
        </form>

        {/* Bundle items preview */}
        {bundle.items && bundle.items.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#D5FC51]/20">
            <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Includes:</div>
            <div className="space-y-1">
              {bundle.items.slice(0, 2).map((item) => (
                <div key={item.id} className="text-xs text-gray-600">
                  {item.quantity}x {item.product.name}
                </div>
              ))}
              {bundle.items.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{bundle.items.length - 2} more items
                </div>
              )}
            </div>
          </div>
        )}

        {/* Success feedback */}
        {showSuccess && (
          <div className="mt-2 flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-green-500"></div>
            <span className="text-[10px] text-gray-500">Bundle added to cart</span>
          </div>
        )}
      </div>
    </div>
  );
}
