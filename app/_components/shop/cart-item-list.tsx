"use client";

import { useState, useEffect, useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TrashIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { updateCartItem, removeCartItem } from "@/app/lib/shop-actions";
import { Cart } from "@/app/lib/shop-data";

export default function CartItemList({ cart }: { cart: Cart }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="p-6">
        <h2 className="mb-4 text-xl font-semibold text-[#2A2A2A]">
          Cart Items
        </h2>

        <div className="divide-y divide-gray-200">
          {cart.items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CartItem({ item }: { item: any }) {
  const updateInitialState = { message: null, errors: {}, success: false };
  const [updateState, updateDispatch] = useActionState(
    updateCartItem,
    updateInitialState,
  );

  const removeInitialState = { message: null, errors: {}, success: false };
  const [removeState, removeDispatch] = useActionState(
    removeCartItem,
    removeInitialState,
  );

  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const product = item.product;
  const bundle = item.bundle;

  const name = product ? product.name : bundle ? bundle.name : "Unknown Item";
  const price = product
    ? product.salePrice || product.price
    : bundle
      ? bundle.salePrice || bundle.price
      : 0;
  const image =
    product && product.images && product.images.length > 0
      ? product.images[0]
      : bundle && bundle.images && bundle.images.length > 0
        ? bundle.images[0]
        : null;
  const slug = product
    ? `/shop/product/${product.slug}`
    : bundle
      ? `/shop/bundle/${bundle.slug}`
      : "#";

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity === quantity) return;

    setQuantity(newQuantity);
    setIsUpdating(true);

    const formData = new FormData();
    formData.append("cartItemId", item.id);
    formData.append("quantity", newQuantity.toString());

    updateDispatch(formData);
  };

  // Handle update state changes
  useEffect(() => {
    if (updateState.success) {
      // Dispatch a custom event to notify the cart icon to update
      const event = new CustomEvent("cartUpdated");
      window.dispatchEvent(event);
      setIsUpdating(false);
    } else if (updateState.message) {
      setIsUpdating(false);
    }
  }, [updateState]);

  const handleRemove = () => {
    setIsRemoving(true);

    const formData = new FormData();
    formData.append("cartItemId", item.id);

    removeDispatch(formData);
  };

  // Handle remove state changes
  useEffect(() => {
    if (removeState.success) {
      // Dispatch a custom event to notify the cart icon to update
      const event = new CustomEvent("cartUpdated");
      window.dispatchEvent(event);
      setIsRemoving(false);
    } else if (removeState.message) {
      setIsRemoving(false);
    }
  }, [removeState]);

  return (
    <div className="py-6 first:pt-0 last:pb-0">
      <div className="flex items-center gap-4">
        {/* Product image */}
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          {image ? (
            <Image src={image} alt={name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-xs text-gray-400">No image</span>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-1 flex-col">
          <Link
            href={slug}
            className="text-lg font-medium text-[#2A2A2A] hover:text-[#D5FC51]"
          >
            {name}
          </Link>

          <div className="mt-1 text-sm text-gray-500">
            {formatPrice(price)} each
          </div>
        </div>

        {/* Quantity controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={isUpdating || quantity <= 1}
            className="rounded-full border border-gray-300 p-1 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-50"
          >
            <MinusIcon className="h-4 w-4" />
          </button>

          <span className="w-8 text-center text-sm font-medium">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={isUpdating}
            className="rounded-full border border-gray-300 p-1 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-50"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="w-24 text-right font-medium text-[#2A2A2A]">
          {formatPrice(price * quantity)}
        </div>

        {/* Remove button */}
        <button
          type="button"
          onClick={handleRemove}
          disabled={isRemoving}
          className="ml-2 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500 disabled:opacity-50"
          title="Remove item"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Update/remove status messages */}
      {(updateState.message || removeState.message) && (
        <div
          className={`mt-2 text-xs ${updateState.success || removeState.success ? "text-green-500" : "text-red-500"}`}
        >
          {updateState.message || removeState.message}
        </div>
      )}
    </div>
  );
}
