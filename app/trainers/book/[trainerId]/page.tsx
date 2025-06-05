"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

// Mock trainer data (in real app, this would come from API/database)
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
      "Certified nutritionist with 5+ years helping clients achieve sustainable weight loss through personalized meal plans and lifestyle changes. Sarah has helped over 200 clients reach their goals.",
    qualifications: [
      "Certified Nutritionist",
      "Weight Management Specialist",
      "Meal Planning Expert",
    ],
    availability: [
      "Monday 9AM-5PM",
      "Wednesday 10AM-6PM",
      "Friday 8AM-4PM",
      "Saturday 9AM-3PM",
    ],
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
    qualifications: [
      "Sports Nutritionist",
      "Performance Coach",
      "Supplement Specialist",
    ],
    availability: ["Tuesday 8AM-6PM", "Thursday 9AM-7PM", "Saturday 10AM-4PM"],
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
    qualifications: [
      "Certified Personal Trainer",
      "Online Fitness Coach",
      "Motivation Specialist",
    ],
    availability: [
      "Monday 6AM-8PM",
      "Tuesday 6AM-8PM",
      "Wednesday 6AM-8PM",
      "Thursday 6AM-8PM",
    ],
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
    qualifications: [
      "Strength & Conditioning Coach",
      "Home Gym Specialist",
      "Equipment Expert",
    ],
    availability: [
      "Monday 7AM-7PM",
      "Wednesday 7AM-7PM",
      "Friday 7AM-7PM",
      "Sunday 9AM-5PM",
    ],
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
    qualifications: [
      "Elite Strength Coach",
      "Powerlifting Specialist",
      "Athletic Performance Expert",
    ],
    availability: [
      "Tuesday 5AM-9PM",
      "Thursday 5AM-9PM",
      "Saturday 6AM-6PM",
      "Sunday 8AM-4PM",
    ],
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
    qualifications: [
      "Functional Movement Specialist",
      "Mobility Expert",
      "Injury Prevention Coach",
    ],
    availability: [
      "Monday 8AM-6PM",
      "Wednesday 8AM-6PM",
      "Friday 8AM-6PM",
      "Saturday 10AM-2PM",
    ],
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
    qualifications: [
      "Program Design Expert",
      "Exercise Science Specialist",
      "Goal Achievement Coach",
    ],
    availability: [
      "Monday 9AM-5PM",
      "Tuesday 9AM-5PM",
      "Thursday 9AM-5PM",
      "Friday 9AM-5PM",
    ],
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
    qualifications: [
      "HIIT Specialist",
      "Fat Loss Expert",
      "Cardio Conditioning Coach",
    ],
    availability: [
      "Tuesday 6AM-8PM",
      "Wednesday 6AM-8PM",
      "Friday 6AM-8PM",
      "Saturday 8AM-4PM",
    ],
  },
};

export default function BookTrainerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const trainerId = params.trainerId as string;
  const category = searchParams.get("category");

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState("single");
  const [isBooked, setIsBooked] = useState(false);

  const trainer = trainersData[trainerId as keyof typeof trainersData];

  if (!trainer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">
            Trainer Not Found
          </h1>
          <Link href="/trainers" className="text-[#D5FC51] hover:underline">
            ← Back to Trainers
          </Link>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      // Redirect to checkout with trainer and booking details
      const bookingData = {
        trainerId: trainer.id,
        trainerName: trainer.name,
        specialty: trainer.specialty,
        sessionType: sessionType,
        date: selectedDate,
        time: selectedTime,
        price: trainer.price,
      };

      const queryParams = new URLSearchParams({
        trainer: trainer.id.toString(),
        sessionType: sessionType,
        date: selectedDate,
        time: selectedTime,
      }).toString();

      window.location.href = `/trainers/checkout?${queryParams}`;
    }
  };

  if (isBooked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900">
        <div className="mx-auto max-w-md rounded-2xl bg-gray-800/50 p-8 text-center backdrop-blur-sm">
          <CheckCircleIcon className="mx-auto mb-4 h-16 w-16 text-green-400" />
          <h1 className="mb-4 text-2xl font-bold text-white">
            Booking Confirmed!
          </h1>
          <p className="mb-6 text-gray-300">
            Your session with {trainer.name} has been booked for {selectedDate}{" "}
            at {selectedTime}.
          </p>
          <div className="space-y-3">
            <Link
              href="/trainers"
              className="block w-full rounded-xl bg-[#D5FC51] px-6 py-3 text-center font-bold text-black transition-all duration-300 hover:bg-[#D5FC51]/90"
            >
              Book Another Trainer
            </Link>
            <Link
              href="/dashboard"
              className="block w-full rounded-xl bg-gray-700 px-6 py-3 text-center font-bold text-white transition-all duration-300 hover:bg-gray-600"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/trainers"
          className="mb-8 inline-flex items-center text-[#D5FC51] transition-colors hover:text-green-400"
        >
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Back to Trainers
        </Link>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Trainer Info */}
          <div className="overflow-hidden rounded-2xl bg-gray-800/50 shadow-xl backdrop-blur-sm">
            <img
              src={trainer.image}
              alt={trainer.name}
              className="h-80 w-full object-cover"
            />
            <div className="p-8">
              <div className="mb-4 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">
                  {trainer.name}
                </h1>
                <div className="flex items-center rounded-full bg-black/30 px-3 py-1">
                  <StarIcon className="mr-1 h-5 w-5 text-yellow-400" />
                  <span className="font-medium text-white">
                    {trainer.rating}
                  </span>
                </div>
              </div>

              <p className="mb-4 text-xl font-medium text-[#D5FC51]">
                {trainer.specialty}
              </p>
              <p className="mb-6 text-gray-300">{trainer.description}</p>

              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="flex items-center text-gray-300">
                  <ClockIcon className="mr-2 h-5 w-5" />
                  <span>{trainer.experience}</span>
                </div>
                <div className="flex items-center text-[#D5FC51]">
                  <CurrencyDollarIcon className="mr-2 h-5 w-5" />
                  <span className="font-bold">{trainer.price}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="mb-3 text-lg font-bold text-white">
                  Qualifications
                </h3>
                <div className="space-y-2">
                  {trainer.qualifications.map((qual, index) => (
                    <div
                      key={index}
                      className="flex items-center text-gray-300"
                    >
                      <CheckCircleIcon className="mr-2 h-4 w-4 text-green-400" />
                      <span>{qual}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-bold text-white">
                  Availability
                </h3>
                <div className="space-y-2">
                  {trainer.availability.map((time, index) => (
                    <div key={index} className="text-sm text-gray-300">
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="rounded-2xl bg-gray-800/50 p-8 shadow-xl backdrop-blur-sm">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Book Your Session
            </h2>

            <div className="space-y-6">
              {/* Session Type */}
              <div>
                <label className="mb-3 block font-medium text-white">
                  Session Type
                </label>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <button
                    onClick={() => setSessionType("single")}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                      sessionType === "single"
                        ? "border-[#D5FC51] bg-[#D5FC51]/10 text-[#D5FC51]"
                        : "border-gray-600 text-gray-300 hover:border-gray-500"
                    }`}
                  >
                    <div className="mb-1 font-bold">Single Session</div>
                    <div className="text-sm opacity-80">
                      One-time session. Pay per session with no commitment.
                    </div>
                  </button>
                  <button
                    onClick={() => setSessionType("package")}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                      sessionType === "package"
                        ? "border-[#D5FC51] bg-[#D5FC51]/10 text-[#D5FC51]"
                        : "border-gray-600 text-gray-300 hover:border-gray-500"
                    }`}
                  >
                    <div className="mb-1 font-bold">Package Deal</div>
                    <div className="text-sm opacity-80">
                      Multiple sessions at discounted rate. Better value for
                      regular training.
                    </div>
                  </button>
                </div>

                {/* Additional info based on selection */}
                {sessionType === "single" && (
                  <div className="mt-3 rounded-lg bg-gray-700/30 p-3">
                    <div className="text-sm text-gray-300">
                      <strong className="text-[#D5FC51]">
                        Single Session includes:
                      </strong>
                      <ul className="mt-1 ml-4 list-disc">
                        <li>1-hour personalized training session</li>
                        <li>Fitness assessment and goal setting</li>
                        <li>Custom workout plan for the session</li>
                        <li>Nutrition tips and advice</li>
                      </ul>
                    </div>
                  </div>
                )}

                {sessionType === "package" && (
                  <div className="mt-3 rounded-lg bg-gray-700/30 p-3">
                    <div className="text-sm text-gray-300">
                      <strong className="text-[#D5FC51]">
                        Package Deal includes:
                      </strong>
                      <ul className="mt-1 ml-4 list-disc">
                        <li>4 sessions for the price of 3 (25% savings)</li>
                        <li>Comprehensive fitness assessment</li>
                        <li>Personalized long-term training plan</li>
                        <li>Weekly progress tracking</li>
                        <li>Nutrition guidance and meal planning</li>
                        <li>Priority booking for future sessions</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Date Selection */}
              <div>
                <label className="mb-3 block font-medium text-white">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-xl border border-gray-600 bg-gray-700 p-3 text-white focus:border-[#D5FC51] focus:outline-none"
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="mb-3 block font-medium text-white">
                  Select Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full rounded-xl border border-gray-600 bg-gray-700 p-3 text-white focus:border-[#D5FC51] focus:outline-none"
                >
                  <option value="">Choose a time</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                </select>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="mb-3 block font-medium text-white">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Any specific goals or requirements..."
                  className="w-full resize-none rounded-xl border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 focus:border-[#D5FC51] focus:outline-none"
                />
              </div>

              {/* Booking Summary */}
              <div className="rounded-xl bg-gray-700/50 p-4">
                <h3 className="mb-2 font-bold text-white">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Trainer:</span>
                    <span>{trainer.name}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Service:</span>
                    <span>{trainer.specialty}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Session Type:</span>
                    <span>
                      {sessionType === "single"
                        ? "Single Session"
                        : "Package Deal (4 sessions)"}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Date:</span>
                    <span>{selectedDate || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Time:</span>
                    <span>{selectedTime || "Not selected"}</span>
                  </div>
                  {sessionType === "package" && (
                    <div className="flex justify-between text-gray-300">
                      <span>Regular Price:</span>
                      <span className="line-through">
                        {trainer.price.replace(
                          /\$(\d+)/,
                          (match, price) => `$${parseInt(price) * 4}`,
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-[#D5FC51]">
                    <span>Total:</span>
                    <span>
                      {sessionType === "package"
                        ? trainer.price.replace(
                            /\$(\d+)/,
                            (match, price) => `$${parseInt(price) * 3}`,
                          ) + " (25% savings)"
                        : trainer.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime}
                className={`w-full rounded-xl px-6 py-4 text-lg font-bold transition-all duration-300 ${
                  selectedDate && selectedTime
                    ? "transform bg-[#D5FC51] text-black shadow-lg hover:scale-105 hover:bg-[#D5FC51]/90 hover:shadow-xl"
                    : "cursor-not-allowed bg-gray-600 text-gray-400"
                }`}
              >
                {selectedDate && selectedTime
                  ? "Confirm Booking"
                  : "Select Date & Time"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
