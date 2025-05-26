"use client";

import { useState, useEffect, useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { addToCart } from "@/app/lib/shop-actions";
import { Product } from "@/app/lib/shop-data";

export default function ProductCard({ product }: { product: Product }) {
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

  return (
    <div className="group relative flex flex-col bg-white transition-all hover:shadow-sm">
      {/* Minimal sale indicator */}
      {product.salePrice && (
        <div className="absolute top-3 left-3 z-10 h-2 w-2 rounded-full bg-gray-900"></div>
      )}

      {/* Clean product image */}
      <Link
        href={`/shop/product/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-gray-50"
      >
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs text-gray-400">No image</span>
          </div>
        )}
      </Link>

      {/* Minimal product info */}
      <div className="flex flex-1 flex-col py-4">
        {/* Category - subtle and minimal */}
        {product.category && (
          <Link
            href={`/shop/category/${product.category.slug}`}
            className="mb-1 text-[10px] font-medium tracking-wide text-gray-400 uppercase hover:text-gray-600"
          >
            {product.category.name}
          </Link>
        )}

        {/* Product name - clean typography */}
        <Link href={`/shop/product/${product.slug}`} className="mb-2">
          <h3 className="text-sm font-medium text-gray-900 transition-colors group-hover:text-gray-600">
            {product.name}
          </h3>
        </Link>

        {/* Price - minimal styling */}
        <div className="mt-auto">
          {product.salePrice ? (
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-gray-900">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            </div>
          ) : (
            <span className="text-sm font-medium text-gray-900">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Minimal add to cart */}
        <form onSubmit={handleAddToCart} className="mt-3">
          <input type="hidden" name="productId" value={product.id} />
          <input type="hidden" name="quantity" value="1" />

          <button
            type="submit"
            disabled={isAdding || showSuccess || product.inventory === 0}
            className={`w-full py-2 text-[10px] font-medium tracking-wide uppercase transition-colors ${
              product.inventory === 0
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : showSuccess
                  ? "bg-gray-900 text-white"
                  : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {product.inventory === 0
              ? "Out of stock"
              : showSuccess
                ? "Added"
                : isAdding
                  ? "Adding..."
                  : "Add to cart"}
          </button>
        </form>

        {/* Minimal inventory indicator */}
        {product.inventory <= 5 && product.inventory > 0 && (
          <div className="mt-2 flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-orange-400"></div>
            <span className="text-[10px] text-gray-500">
              {product.inventory} left
            </span>
          </div>
        )}

        {/* Success feedback - minimal */}
        {showSuccess && (
          <div className="mt-2 flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-green-500"></div>
            <span className="text-[10px] text-gray-500">Added to cart</span>
          </div>
        )}
      </div>
    </div>
  );
}
