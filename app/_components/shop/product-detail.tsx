"use client";

import { useState, useEffect, useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  StarIcon,
  ShoppingCartIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import { addToCart } from "@/app/lib/shop-actions";
import { Product } from "@/app/lib/shop-data";

export default function ProductDetail({ product }: { product: Product }) {
  const initialState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useActionState(addToCart, initialState);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.images[0] || "");
  const [isAdding, setIsAdding] = useState(false);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

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
      setIsAdding(false);
    } else if (state.message) {
      // If there was an error
      setIsAdding(false);
    }
  }, [state]);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {/* Product images */}
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200">
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>

        {/* Thumbnail gallery */}
        {product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border ${
                  selectedImage === image
                    ? "border-[#D5FC51]"
                    : "border-gray-200"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product info */}
      <div>
        {/* Category */}
        {product.category && (
          <Link
            href={`/shop/category/${product.category.slug}`}
            className="text-sm font-medium text-gray-500 hover:text-[#D5FC51]"
          >
            {product.category.name}
          </Link>
        )}

        {/* Product name */}
        <h1 className="mt-2 text-3xl font-bold text-[#2A2A2A]">
          {product.name}
        </h1>

        {/* Price */}
        <div className="mt-4 flex items-center">
          {product.salePrice ? (
            <>
              <span className="text-2xl font-bold text-[#2A2A2A]">
                {formatPrice(product.salePrice)}
              </span>
              <span className="ml-2 text-lg text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
              <span className="ml-2 rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                Save{" "}
                {Math.round(
                  ((product.price - product.salePrice) / product.price) * 100,
                )}
                %
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-[#2A2A2A]">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Inventory status */}
        <div className="mt-4">
          {product.inventory > 0 ? (
            <div className="flex items-center text-sm text-green-600">
              <CheckIcon className="mr-1 h-4 w-4" />
              <span>In stock</span>
              {product.inventory <= 5 && (
                <span className="ml-1">(Only {product.inventory} left)</span>
              )}
            </div>
          ) : (
            <div className="text-sm text-red-600">Out of stock</div>
          )}
        </div>

        {/* Description */}
        <div className="mt-6 text-gray-700">
          <p>{product.description}</p>
        </div>

        {/* Add to cart form */}
        <form onSubmit={handleAddToCart} className="mt-8">
          <input type="hidden" name="productId" value={product.id} />

          <div className="mb-4">
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Quantity
            </label>
            <div className="mt-1 flex items-center">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={product.inventory === 0}
                className="rounded-l-md border border-gray-300 bg-white px-3 py-2 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                max={product.inventory}
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.min(
                      product.inventory,
                      Math.max(1, parseInt(e.target.value) || 1),
                    ),
                  )
                }
                disabled={product.inventory === 0}
                className="w-16 border-y border-gray-300 px-3 py-2 text-center focus:outline-none disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() =>
                  setQuantity(Math.min(product.inventory, quantity + 1))
                }
                disabled={
                  product.inventory === 0 || quantity >= product.inventory
                }
                className="rounded-r-md border border-gray-300 bg-white px-3 py-2 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isAdding || product.inventory === 0}
            className={`flex w-full items-center justify-center rounded-md px-6 py-3 text-base font-medium ${
              product.inventory === 0
                ? "cursor-not-allowed bg-gray-300 text-gray-500"
                : "bg-[#D5FC51] text-[#2A2A2A] hover:bg-[#D5FC51]/80"
            }`}
          >
            <ShoppingCartIcon className="mr-2 h-5 w-5" />
            {product.inventory === 0
              ? "Out of Stock"
              : isAdding
                ? "Adding to Cart..."
                : "Add to Cart"}
          </button>

          {/* Success/error message */}
          {state.message && (
            <div
              className={`mt-3 text-sm ${
                state.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {state.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
