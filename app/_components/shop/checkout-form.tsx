"use client";

import React, { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import type { Cart } from "@/app/lib/shop-data";
import { useCoupon } from "@/app/_contexts/coupon-context";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

// Use your publishable key (same as memberships)
const stripePromise = loadStripe("pk_test_51RRbsi4Dw9UtbL2HmemN06ONzdm0bUd4NDke0bo6R8UKkHpcJvT5lidPyJSoETcx0MKUFT6nrsE9uNmIhBt3sXgA004ykASqJ2");

export default function CheckoutForm({ cart, userId }: { cart: Cart; userId: string }) {
  const { appliedCoupon, discount, removeCoupon } = useCoupon();
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    sameAsShipping: true,
    billingFirstName: "",
    billingLastName: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
    billingCountry: "United States",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const shippingAddress = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
      phone: formData.phone,
    };
    const billingAddress = formData.sameAsShipping
      ? shippingAddress
      : {
          firstName: formData.billingFirstName,
          lastName: formData.billingLastName,
          address: formData.billingAddress,
          city: formData.billingCity,
          state: formData.billingState,
          zipCode: formData.billingZipCode,
          country: formData.billingCountry,
        };

    // Call your API to create a PaymentIntent
    const response = await fetch("/api/create-store-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: cart.total, // Send amount in dollars, API will convert to cents
        cartItems: cart.items,
        userId: userId,
        customerEmail: formData.email,
        shippingAddress,
        billingAddress,
      }),
    });

    const data = await response.json();

    if (!data.clientSecret) {
      setError(data.error || "Failed to initiate payment.");
      return;
    }

    setClientSecret(data.clientSecret);
  }

  // Show Stripe Elements payment form if clientSecret is set
  if (clientSecret) {
    return (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <StripeCheckoutForm
          clientSecret={clientSecret}
          email={formData.email}
          afterSuccess={() => {
            removeCoupon();
          }}
        />
      </Elements>
    );
  }

  // Main checkout form (shipping/billing)
  return (
    <form onSubmit={handleCheckout} className="space-y-8">
      {/* Coupon info */}
      {appliedCoupon && (
        <>
          <input type="hidden" name="couponId" value={appliedCoupon.id} />
          <input type="hidden" name="couponDiscount" value={discount || 0} />
        </>
      )}

      {/* Shipping Information */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-[#2A2A2A]">Shipping Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none" />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none" />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none" />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
            <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none" />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State / Province</label>
            <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none" />
          </div>
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
            <input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none" />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
            <select id="country" name="country" value={formData.country} onChange={handleChange} required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none">
              <option value="United States">United States</option>
              <option value="Albania">Albania</option>
              <option value="Kosovo">Kosovo</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Japan">Japan</option>
              <option value="China">China</option>
            </select>
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="sameAsShipping"
            name="sameAsShipping"
            checked={formData.sameAsShipping}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-[#D5FC51] focus:ring-[#D5FC51]"
          />
          <label htmlFor="sameAsShipping" className="ml-2 text-sm text-gray-700">
            Billing address same as shipping
          </label>
        </div>
        {!formData.sameAsShipping && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="billingFirstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" id="billingFirstName" name="billingFirstName" value={formData.billingFirstName} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none" />
            </div>
            <div>
              <label htmlFor="billingLastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" id="billingLastName" name="billingLastName" value={formData.billingLastName} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none" />
            </div>
            <div>
              <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700">Address</label>
              <input type="text" id="billingAddress" name="billingAddress" value={formData.billingAddress} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none" />
            </div>
            <div>
              <label htmlFor="billingCity" className="block text-sm font-medium text-gray-700">City</label>
              <input type="text" id="billingCity" name="billingCity" value={formData.billingCity} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none" />
            </div>
            <div>
              <label htmlFor="billingState" className="block text-sm font-medium text-gray-700">State / Province</label>
              <input type="text" id="billingState" name="billingState" value={formData.billingState} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none" />
            </div>
            <div>
              <label htmlFor="billingZipCode" className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
              <input type="text" id="billingZipCode" name="billingZipCode" value={formData.billingZipCode} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none" />
            </div>
            <div>
              <label htmlFor="billingCountry" className="block text-sm font-medium text-gray-700">Country</label>
              <select id="billingCountry" name="billingCountry" value={formData.billingCountry} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none">
                <option value="United States">United States</option>
                <option value="Albania">Albania</option>
                <option value="Kosovo">Kosovo</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Japan">Japan</option>
                <option value="China">China</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-[#D5FC51] px-6 py-3 font-medium text-[#2A2A2A] transition-colors hover:bg-[#D5FC51]/80 disabled:opacity-70"
    >
      {pending ? "Processing..." : "Continue to Payment"}
    </button>
  );
}

function StripeCheckoutForm({
  clientSecret,
  email,
  afterSuccess,
}: {
  clientSecret: string;
  email: string;
  afterSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe is not loaded.");
      setProcessing(false);
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setError("Card information is incomplete.");
      setProcessing(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumberElement,
        billing_details: { email },
      },
    });

    if (result.error) {
      setError(result.error.message || "Payment failed.");
      setProcessing(false);
    } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
      afterSuccess();
      // 1. Create the order in your DB
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: result.paymentIntent.id,
          email,
          // Add any other info you want to save (cart, customer info, etc)
        }),
      });
      const orderData = await orderRes.json();
      setProcessing(false);
      setError(null);
      // 2. Redirect to success page with orderId
      router.push(`/shop/checkout/success?orderId=${orderData.orderId}`);
    } else if (result.paymentIntent && result.paymentIntent.status === "processing") {
      setError("Your payment is processing. Please wait.");
      setProcessing(false);
    } else {
      setError("Payment did not succeed.");
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-[#2A2A2A] mb-6">Payment Information</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name on Card */}
        <div>
          <label className="block text-sm font-medium text-[#2A2A2A] mb-2">
            Name on Card
          </label>
          <input
            type="text"
            placeholder="Enter cardholder name"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#D5FC51] focus:border-transparent"
          />
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-[#2A2A2A] mb-2">
            Card Number
          </label>
          <div className="w-full px-4 py-3 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-[#D5FC51] focus-within:border-transparent">
            <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>

        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#2A2A2A] mb-2">
              Expiration Date
            </label>
            <div className="w-full px-4 py-3 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-[#D5FC51] focus-within:border-transparent">
              <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2A2A2A] mb-2">
              CVC
            </label>
            <div className="w-full px-4 py-3 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-[#D5FC51] focus-within:border-transparent">
              <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={processing}
          className="w-full rounded-md bg-[#D5FC51] px-6 py-3 font-medium text-[#2A2A2A] transition-colors hover:bg-[#D5FC51]/80 disabled:opacity-70"
        >
          {processing ? "Processing..." : "Complete Payment"}
        </button>
      </form>
    </div>
  );
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#2A2A2A",
      fontFamily: '"Inter", sans-serif',
      fontSize: "16px",
      "::placeholder": {
        color: "#9CA3AF",
      },
    },
    invalid: {
      color: "#EF4444",
      iconColor: "#EF4444",
    },
  },
};