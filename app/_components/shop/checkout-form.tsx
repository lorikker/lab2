"use client";

import React, { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import type { Cart } from "@/app/lib/shop-data";
import { createOrder } from "@/app/lib/shop-actions";
import { useCoupon } from "@/app/_contexts/coupon-context";

function getCardType(number: string) {
  const re = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
  };
  if (re.visa.test(number)) return "Visa";
  if (re.mastercard.test(number)) return "MasterCard";
  if (re.amex.test(number)) return "American Express";
  if (re.discover.test(number)) return "Discover";
  return "";
}

export default function CheckoutForm({ cart }: { cart: Cart }) {
  const { appliedCoupon, discount, removeCoupon } = useCoupon();
  const [error, setError] = useState("");

  // Initialize form state with createOrder action
  const initialState = { message: "", errors: {}, success: false };
  const [state, formAction] = useFormState(createOrder, initialState);

  // Clear coupon when order is successful
  useEffect(() => {
    if (state.success) {
      removeCoupon();
    }
  }, [state.success, removeCoupon]);

  // Form state
  const [formData, setFormData] = useState({
    // Shipping info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",

    // Payment info
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",

    // Billing same as shipping
    sameAsShipping: true,

    // Billing info (if different)
    billingFirstName: "",
    billingLastName: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
    billingCountry: "United States",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  // Handle error display from server action
  if (state.message && !state.success) {
    console.log("Checkout form error:", state.message);
    if (error !== state.message) {
      setError(state.message);
    }
  }

  // Debug: Log state changes
  console.log("Checkout form state:", state);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const cardType = getCardType(cardNumber.replace(/\s/g, ""));

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Only digits
    value = value.slice(0, 16); // Max 16 digits
    value = value.replace(/(.{4})/g, "$1 ").trim(); // Format as 1234 5678 9012 3456
    setCardNumber(value);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Only digits
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    setExpiry(value);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Only digits
    value = value.slice(0, 4); // 3 or 4 digits
    setCvc(value);
  };

  return (
    <form action={formAction} className="space-y-8">
      {/* Hidden fields for coupon information */}
      {appliedCoupon && (
        <>
          <input type="hidden" name="couponId" value={appliedCoupon.id} />
          <input type="hidden" name="couponDiscount" value={discount || 0} />
        </>
      )}

      {/* Shipping Information */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-[#2A2A2A]">
          Shipping Information
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700"
            >
              State / Province
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="zipCode"
              className="block text-sm font-medium text-gray-700"
            >
              ZIP / Postal Code
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Country
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
            >
              <option value="Kosovo">Kosovo</option>
              <option value="Albania">Albania</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Japan">Japan</option>
              <option value="China">China</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-[#2A2A2A]">
          Payment Information
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="cardName"
              className="block text-sm font-medium text-gray-700"
            >
              Name on Card
            </label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="cardNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={cardNumber}
              onChange={handleCardNumberChange}
              required
              maxLength={19} // 16 digits + 3 spaces
              placeholder="1234 5678 9012 3456"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
            />
            {cardType && (
              <div className="mt-1 text-sm text-gray-600">
                Card Type: {cardType}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="cardExpiry"
              className="block text-sm font-medium text-gray-700"
            >
              Expiration Date
            </label>
            <input
              type="text"
              id="cardExpiry"
              name="cardExpiry"
              value={expiry}
              onChange={handleExpiryChange}
              required
              maxLength={5} // MM/YY format (5 characters)
              placeholder="MM/YY"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="cardCvc"
              className="block text-sm font-medium text-gray-700"
            >
              CVC
            </label>
            <input
              type="text"
              id="cardCvc"
              name="cardCvc"
              value={cvc}
              onChange={handleCvcChange}
              required
              maxLength={4} // Most cards have 3 digits, Amex has 4
              placeholder="123"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#2A2A2A]">
            Billing Information
          </h2>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="sameAsShipping"
              name="sameAsShipping"
              checked={formData.sameAsShipping}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-[#D5FC51] focus:ring-[#D5FC51]"
            />
            <label
              htmlFor="sameAsShipping"
              className="ml-2 text-sm text-gray-700"
            >
              Same as shipping
            </label>
          </div>
        </div>

        {!formData.sameAsShipping && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Billing address fields */}
            {/* Similar to shipping fields, but with billing prefixes */}
          </div>
        )}
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        <SubmitButton />
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
    </form>
  );
}

// Submit button component that uses the useFormStatus hook
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-[#D5FC51] px-6 py-3 font-medium text-[#2A2A2A] transition-colors hover:bg-[#D5FC51]/80 disabled:opacity-70"
    >
      {pending ? "Processing..." : "Place Order"}
    </button>
  );
}
