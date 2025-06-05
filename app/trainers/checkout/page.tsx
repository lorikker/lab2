"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// Trainer data (same as booking page)
const trainersData = {
  "1": {
    id: 1,
    name: "Sarah Johnson",
    specialty: "Weight Loss Nutrition",
    experience: "5 years",
    rating: 4.9,
    price: "$80/session",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face",
    description:
      "Certified nutritionist with 5+ years helping clients achieve sustainable weight loss through personalized meal plans and lifestyle changes.",
  },
  "2": {
    id: 2,
    name: "Mike Chen",
    specialty: "Sports Nutrition",
    experience: "7 years",
    rating: 4.8,
    price: "$90/session",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    description:
      "Sports nutrition specialist working with professional athletes and fitness enthusiasts to optimize performance through targeted nutrition strategies.",
  },
  "3": {
    id: 3,
    name: "Emma Wilson",
    specialty: "Virtual Fitness Coaching",
    experience: "4 years",
    rating: 4.6,
    price: "$70/session",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop&crop=face",
    description:
      "Virtual fitness coach specializing in home workouts, online motivation, and creating effective exercise routines for busy professionals.",
  },
  "4": {
    id: 4,
    name: "David Rodriguez",
    specialty: "Remote Strength Training",
    experience: "6 years",
    rating: 4.7,
    price: "$85/session",
    image:
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=400&fit=crop&crop=face",
    description:
      "Remote strength training expert helping clients build muscle and strength using minimal equipment in home gym setups.",
  },
  "5": {
    id: 5,
    name: "Alex Thompson",
    specialty: "Strength & Conditioning",
    experience: "8 years",
    rating: 5.0,
    price: "$100/session",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=400&fit=crop&crop=face",
    description:
      "Elite strength and conditioning coach with 8+ years training professional athletes, powerlifters, and serious fitness enthusiasts.",
  },
  "6": {
    id: 6,
    name: "Lisa Martinez",
    specialty: "Functional Fitness",
    experience: "5 years",
    rating: 4.8,
    price: "$75/session",
    image:
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop&crop=face",
    description:
      "Functional fitness specialist focusing on real-world movement patterns, mobility, and injury prevention for everyday activities.",
  },
  "7": {
    id: 7,
    name: "Ryan Foster",
    specialty: "Program Design",
    experience: "6 years",
    rating: 4.9,
    price: "$120/program",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    description:
      "Program design specialist creating comprehensive, science-based workout plans tailored to individual goals, from beginner to advanced levels.",
  },
  "8": {
    id: 8,
    name: "Jessica Kim",
    specialty: "HIIT Programs",
    experience: "4 years",
    rating: 4.7,
    price: "$95/program",
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop&crop=face",
    description:
      "HIIT specialist designing high-intensity interval training programs that maximize fat loss and cardiovascular fitness in minimal time.",
  },
};

export default function TrainerCheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const trainerId = searchParams.get("trainer");
  const sessionType = searchParams.get("sessionType");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "US",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const trainer = trainersData[trainerId as keyof typeof trainersData];

  useEffect(() => {
    if (!trainerId || !trainer) {
      router.push("/trainers");
      return;
    }

    // Pre-fill form with session data if available
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        firstName: session.user.name?.split(" ")[0] || "",
        lastName: session.user.name?.split(" ")[1] || "",
        email: session.user.email || "",
      }));
    }
  }, [trainerId, trainer, router, session]);

  if (!trainer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">
            Invalid Booking
          </h1>
          <Link href="/trainers" className="text-[#D5FC51] hover:underline">
            ← Back to Trainers
          </Link>
        </div>
      </div>
    );
  }

  // Calculate price based on session type
  const basePrice = parseInt(trainer.price.replace(/[^0-9]/g, ""));
  const totalPrice = sessionType === "package" ? basePrice * 3 : basePrice; // 25% discount for package (4 for price of 3)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // Format specific fields
    let formattedValue = value;
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
    } else if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d{2})/, "$1/$2");
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    if (!formData.cardNumber.trim())
      newErrors.cardNumber = "Card number is required";
    if (!formData.expiryDate.trim())
      newErrors.expiryDate = "Expiry date is required";
    if (!formData.cvv.trim()) newErrors.cvv = "CVV is required";
    if (!formData.cardName.trim())
      newErrors.cardName = "Cardholder name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create payment intent with Stripe
      const response = await fetch("/api/create-trainer-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalPrice,
          trainerId: trainer.id,
          trainerName: trainer.name,
          sessionType: sessionType,
          date: date,
          time: time,
          userId: session?.user?.id || "guest-user",
          customerEmail: formData.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { paymentIntentId, invoiceNumber, orderNumber } =
        await response.json();

      // Process the booking
      const bookingResponse = await fetch("/api/process-trainer-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntentId,
          userId: session?.user?.id || "guest-user",
          customerEmail: formData.email,
        }),
      });

      if (!bookingResponse.ok) {
        throw new Error("Failed to process booking");
      }

      // Redirect to payment success page
      const queryParams = new URLSearchParams({
        trainer: trainer.id.toString(),
        sessionType: sessionType || "",
        date: date || "",
        time: time || "",
        amount: totalPrice.toString(),
        paymentIntentId: paymentIntentId,
        invoiceNumber: invoiceNumber,
        orderNumber: orderNumber,
      }).toString();

      router.push(`/trainers/payment?${queryParams}`);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Payment failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href={`/trainers/book/${trainerId}?sessionType=${sessionType}&date=${date}&time=${time}`}
          className="mb-8 inline-flex items-center text-[#D5FC51] transition-colors hover:text-green-400"
        >
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Back to Booking
        </Link>

        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-center text-3xl font-bold text-white">
            Complete Your Trainer Booking
          </h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Booking Summary */}
            <div className="h-fit rounded-2xl bg-gray-800/50 p-6 backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-bold text-white">
                Booking Summary
              </h2>

              <div className="mb-6 flex items-center">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="mr-4 h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {trainer.name}
                  </h3>
                  <p className="text-[#D5FC51]">{trainer.specialty}</p>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Session Type:</span>
                  <span>
                    {sessionType === "package"
                      ? "Package Deal (4 sessions)"
                      : "Single Session"}
                  </span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Date:</span>
                  <span>{date}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Time:</span>
                  <span>{time}</span>
                </div>
                {sessionType === "package" && (
                  <div className="flex justify-between text-gray-300">
                    <span>Regular Price:</span>
                    <span className="line-through">${basePrice * 4}</span>
                  </div>
                )}
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between text-lg font-bold text-[#D5FC51]">
                    <span>Total:</span>
                    <span>
                      ${totalPrice}
                      {sessionType === "package" ? " (25% savings)" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="rounded-2xl bg-gray-800/50 p-6 backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-bold text-white">
                Payment Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border bg-gray-700 p-3 ${errors.firstName ? "border-red-500" : "border-gray-600"} text-white focus:border-[#D5FC51] focus:outline-none`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border bg-gray-700 p-3 ${errors.lastName ? "border-red-500" : "border-gray-600"} text-white focus:border-[#D5FC51] focus:outline-none`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl border bg-gray-700 p-3 ${errors.email ? "border-red-500" : "border-gray-600"} text-white focus:border-[#D5FC51] focus:outline-none`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl border bg-gray-700 p-3 ${errors.phone ? "border-red-500" : "border-gray-600"} text-white focus:border-[#D5FC51] focus:outline-none`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Address Information */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl border bg-gray-700 p-3 ${errors.address ? "border-red-500" : "border-gray-600"} text-white focus:border-[#D5FC51] focus:outline-none`}
                    placeholder="123 Main Street"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border bg-gray-700 p-3 ${errors.city ? "border-red-500" : "border-gray-600"} text-white focus:border-[#D5FC51] focus:outline-none`}
                      placeholder="New York"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border bg-gray-700 p-3 ${errors.zipCode ? "border-red-500" : "border-gray-600"} text-white focus:border-[#D5FC51] focus:outline-none`}
                      placeholder="10001"
                    />
                    {errors.zipCode && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.zipCode}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-600 bg-gray-700 p-3 text-white focus:border-[#D5FC51] focus:outline-none"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="IT">Italy</option>
                    <option value="ES">Spain</option>
                    <option value="NL">Netherlands</option>
                    <option value="AL">Albania</option>
                    <option value="XK">Kosovo</option>
                    <option value="MK">North Macedonia</option>
                    <option value="ME">Montenegro</option>
                    <option value="RS">Serbia</option>
                    <option value="BA">Bosnia and Herzegovina</option>
                    <option value="HR">Croatia</option>
                    <option value="SI">Slovenia</option>
                  </select>
                </div>

                {/* Payment Information */}
                <div className="mt-6 border-t border-gray-600 pt-6">
                  <h3 className="mb-4 text-lg font-bold text-white">
                    Payment Details
                  </h3>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border bg-gray-700 p-3 ${errors.cardNumber ? "border-red-500" : "border-gray-600"} text-white focus:border-[#D5FC51] focus:outline-none`}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                    />
                    {errors.cardNumber && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className={`w-full rounded-xl border bg-gray-700 p-3 ${errors.expiryDate ? "border-red-500" : "border-gray-600"} text-white focus:border-[#D5FC51] focus:outline-none`}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      {errors.expiryDate && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.expiryDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className={`w-full rounded-xl border bg-gray-700 p-3 ${errors.cvv ? "border-red-500" : "border-gray-600"} text-white focus:border-[#D5FC51] focus:outline-none`}
                        placeholder="123"
                        maxLength={3}
                      />
                      {errors.cvv && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.cvv}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-medium text-white">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border bg-gray-700 p-3 ${errors.cardName ? "border-red-500" : "border-gray-600"} text-white focus:border-[#D5FC51] focus:outline-none`}
                      placeholder="John Doe"
                    />
                    {errors.cardName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.cardName}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full rounded-xl px-6 py-4 text-lg font-bold transition-all duration-300 ${
                    isLoading
                      ? "cursor-not-allowed bg-gray-600 text-gray-400"
                      : "transform bg-[#D5FC51] text-black shadow-lg hover:scale-105 hover:bg-[#D5FC51]/90 hover:shadow-xl"
                  }`}
                >
                  {isLoading
                    ? "Processing..."
                    : `Pay $${totalPrice} - Complete Booking`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
