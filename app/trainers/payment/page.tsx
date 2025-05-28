"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

// Trainer data
const trainersData = {
  "1": { id: 1, name: "Sarah Johnson", specialty: "Weight Loss Nutrition", price: "$80/session" },
  "2": { id: 2, name: "Mike Chen", specialty: "Sports Nutrition", price: "$90/session" },
  "3": { id: 3, name: "Emma Wilson", specialty: "Virtual Fitness Coaching", price: "$70/session" },
  "4": { id: 4, name: "David Rodriguez", specialty: "Remote Strength Training", price: "$85/session" },
  "5": { id: 5, name: "Alex Thompson", specialty: "Strength & Conditioning", price: "$100/session" },
  "6": { id: 6, name: "Lisa Martinez", specialty: "Functional Fitness", price: "$75/session" },
  "7": { id: 7, name: "Ryan Foster", specialty: "Program Design", price: "$120/program" },
  "8": { id: 8, name: "Jessica Kim", specialty: "HIIT Programs", price: "$95/program" }
};

export default function TrainerPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const trainerId = searchParams.get('trainer');
  const sessionType = searchParams.get('sessionType');
  const date = searchParams.get('date');
  const time = searchParams.get('time');
  const amount = searchParams.get('amount');
  const paymentIntentId = searchParams.get('paymentIntentId');
  const invoiceNumber = searchParams.get('invoiceNumber');
  const orderNumber = searchParams.get('orderNumber');

  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [countdown, setCountdown] = useState(20);

  const trainer = trainersData[trainerId as keyof typeof trainersData];

  useEffect(() => {
    if (!trainerId || !trainer) {
      router.push('/trainers');
      return;
    }

    // If we have paymentIntentId, payment was successful
    if (paymentIntentId) {
      // Simulate short processing delay for better UX
      const timer = setTimeout(() => {
        setPaymentStatus('success');

        // Start countdown for redirect
        const redirectTimer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(redirectTimer);
              router.push(`/trainers/invoice?trainer=${trainerId}&sessionType=${sessionType}&date=${date}&time=${time}&amount=${amount}&paymentIntentId=${paymentIntentId}&invoiceNumber=${invoiceNumber}&orderNumber=${orderNumber}`);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    } else {
      // No payment intent means payment failed
      setPaymentStatus('failed');
    }
  }, [trainerId, trainer, router, sessionType, date, time, amount, paymentIntentId, invoiceNumber, orderNumber]);

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Payment</h1>
          <Link href="/trainers" className="text-[#D5FC51] hover:underline">
            ← Back to Trainers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto text-center">
        {paymentStatus === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D5FC51] mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-white mb-4">Processing Your Trainer Booking</h1>
            <p className="text-gray-300 mb-6">
              Please wait while we process your payment for your training session with {trainer.name}...
            </p>
            <div className="bg-gray-700/50 rounded-xl p-4">
              <div className="text-sm text-gray-300 space-y-2">
                <div className="flex justify-between">
                  <span>Trainer:</span>
                  <span className="text-[#D5FC51]">{trainer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span>{trainer.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span>Session:</span>
                  <span>{sessionType === 'package' ? 'Package Deal' : 'Single Session'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span>{date} at {time}</span>
                </div>
                <div className="flex justify-between font-bold text-[#D5FC51]">
                  <span>Amount:</span>
                  <span>${amount}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {paymentStatus === 'success' && (
          <>
            <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-4">Trainer Booking Successful!</h1>
            <p className="text-gray-300 mb-6">
              Your training session with {trainer.name} has been successfully booked and paid for.
            </p>
            <div className="bg-gray-700/50 rounded-xl p-4 mb-6">
              <div className="text-sm text-gray-300 space-y-2">
                <div className="flex justify-between">
                  <span>Trainer:</span>
                  <span className="text-[#D5FC51]">{trainer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span>{trainer.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span>Session:</span>
                  <span>{sessionType === 'package' ? 'Package Deal (4 sessions)' : 'Single Session'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span>{date} at {time}</span>
                </div>
                <div className="flex justify-between font-bold text-green-400">
                  <span>Amount Paid:</span>
                  <span>${amount}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Redirecting to your invoice in {countdown} seconds...
            </p>
            <div className="space-y-3">
              <Link
                href={`/trainers/invoice?trainer=${trainerId}&sessionType=${sessionType}&date=${date}&time=${time}&amount=${amount}`}
                className="w-full bg-[#D5FC51] text-black font-bold py-3 px-6 rounded-xl hover:bg-[#D5FC51]/90 transition-all duration-300 block text-center"
              >
                View Invoice
              </Link>
              <Link
                href="/trainers"
                className="w-full bg-gray-700 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-600 transition-all duration-300 block text-center"
              >
                Book Another Trainer
              </Link>
              <Link
                href="/dashboard"
                className="w-full bg-gray-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-500 transition-all duration-300 block text-center"
              >
                Go to Dashboard
              </Link>
            </div>
          </>
        )}

        {paymentStatus === 'failed' && (
          <>
            <XCircleIcon className="h-16 w-16 text-red-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-4">Payment Failed</h1>
            <p className="text-gray-300 mb-6">
              We were unable to process your payment for the training session with {trainer.name}. Please try again.
            </p>
            <div className="bg-gray-700/50 rounded-xl p-4 mb-6">
              <div className="text-sm text-gray-300 space-y-2">
                <div className="flex justify-between">
                  <span>Trainer:</span>
                  <span className="text-[#D5FC51]">{trainer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span>{trainer.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span>Session:</span>
                  <span>{sessionType === 'package' ? 'Package Deal' : 'Single Session'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span>{date} at {time}</span>
                </div>
                <div className="flex justify-between font-bold text-red-400">
                  <span>Amount:</span>
                  <span>${amount}</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Link
                href={`/trainers/checkout?trainer=${trainerId}&sessionType=${sessionType}&date=${date}&time=${time}`}
                className="w-full bg-[#D5FC51] text-black font-bold py-3 px-6 rounded-xl hover:bg-[#D5FC51]/90 transition-all duration-300 block text-center"
              >
                Try Again
              </Link>
              <Link
                href="/trainers"
                className="w-full bg-gray-700 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-600 transition-all duration-300 block text-center"
              >
                Back to Trainers
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
