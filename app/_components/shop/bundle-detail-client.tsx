"use client";

import { useState, useEffect, useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ShoppingCartIcon, 
  CubeIcon, 
  TagIcon,
  CheckIcon,
  ArrowLeftIcon 
} from "@heroicons/react/24/outline";
import { addToCart } from "@/app/lib/shop-actions";

interface BundleItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    salePrice?: number | null;
    images: string[];
    slug: string;
    description: string;
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
  items: BundleItem[];
}

interface BundleDetailClientProps {
  bundle: Bundle;
}

export default function BundleDetailClient({ bundle }: BundleDetailClientProps) {
  const initialState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useActionState(addToCart, initialState);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

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
  const originalValue = bundle.items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  const currentPrice = bundle.salePrice || bundle.price;
  const savings = originalValue - currentPrice;
  const savingsPercentage = originalValue > 0 ? (savings / originalValue) * 100 : 0;

  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-12">
        {/* Back button */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Bundle Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-[#D5FC51]/5 to-[#D5FC51]/10 border border-[#D5FC51]/20">
              {bundle.images && bundle.images.length > 0 ? (
                <Image
                  src={bundle.images[selectedImage]}
                  alt={bundle.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <CubeIcon className="h-24 w-24 text-gray-400" />
                </div>
              )}
              
              {/* Bundle badge */}
              <div className="absolute top-4 left-4 flex items-center gap-1 bg-[#D5FC51] px-3 py-1 rounded-full">
                <CubeIcon className="h-4 w-4 text-[#2A2A2A]" />
                <span className="text-xs font-bold text-[#2A2A2A] uppercase tracking-wide">Bundle</span>
              </div>
            </div>

            {/* Thumbnail Images */}
            {bundle.images && bundle.images.length > 1 && (
              <div className="flex gap-2">
                {bundle.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 w-20 overflow-hidden rounded-md border-2 ${
                      selectedImage === index ? "border-[#D5FC51]" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${bundle.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bundle Info */}
          <div className="space-y-6">
            {/* Bundle badge and name */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TagIcon className="h-4 w-4 text-[#D5FC51]" />
                <span className="text-sm font-medium text-[#D5FC51] uppercase tracking-wide">
                  {bundle.items.length} Items Bundle
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{bundle.name}</h1>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{bundle.description}</p>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(currentPrice)}
                </span>
                {originalValue > currentPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(originalValue)}
                  </span>
                )}
              </div>
              
              {savings > 0 && (
                <div className="text-green-600 font-medium">
                  You save {formatPrice(savings)} ({Math.round(savingsPercentage)}% off)
                </div>
              )}
            </div>

            {/* Add to Cart */}
            <form onSubmit={handleAddToCart} className="space-y-4">
              <input type="hidden" name="bundleId" value={bundle.id} />
              <input type="hidden" name="quantity" value="1" />

              <button
                type="submit"
                disabled={isAdding || showSuccess}
                className={`w-full py-4 px-6 text-sm font-bold tracking-wide uppercase transition-all border-2 ${
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

              {showSuccess && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckIcon className="h-4 w-4" />
                  <span className="text-sm">Bundle added to cart successfully!</span>
                </div>
              )}
            </form>

            {/* Bundle Contents */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h3>
              <div className="space-y-3">
                {bundle.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="relative h-12 w-12 overflow-hidden rounded-md bg-white">
                      {item.product.images && item.product.images.length > 0 ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="text-xs text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/shop/product/${item.product.slug}`}
                        className="font-medium text-gray-900 hover:text-[#D5FC51]"
                      >
                        {item.quantity}x {item.product.name}
                      </Link>
                      <div className="text-sm text-gray-500">
                        {formatPrice(item.product.price)} each
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
