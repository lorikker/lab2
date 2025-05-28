"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PrinterIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";

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

export default function TrainerInvoicePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const trainerId = searchParams.get('trainer');
  const sessionType = searchParams.get('sessionType');
  const date = searchParams.get('date');
  const time = searchParams.get('time');
  const amount = searchParams.get('amount');
  const paymentIntentId = searchParams.get('paymentIntentId');
  const invoiceNumberParam = searchParams.get('invoiceNumber');
  const orderNumber = searchParams.get('orderNumber');

  const trainer = trainersData[trainerId as keyof typeof trainersData];
  const invoiceNumber = invoiceNumberParam || `TRN-${Date.now().toString().slice(-8)}`;
  const currentDate = new Date().toLocaleDateString();

  useEffect(() => {
    if (!trainerId || !trainer) {
      router.push('/trainers');
      return;
    }
  }, [trainerId, trainer, router]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a simple text version for download
    const invoiceText = `
SIXSTAR FITNESS - TRAINER BOOKING INVOICE

Invoice #: ${invoiceNumber}
Date: ${currentDate}

TRAINER DETAILS:
Trainer: ${trainer?.name}
Service: ${trainer?.specialty}
Session Type: ${sessionType === 'package' ? 'Package Deal (4 sessions)' : 'Single Session'}

BOOKING DETAILS:
Date: ${date}
Time: ${time}
Amount: $${amount}

Thank you for choosing SixStar Fitness!
    `;

    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trainer-invoice-${invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Invoice</h1>
          <Link href="/trainers" className="text-[#D5FC51] hover:underline">
            ← Back to Trainers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-gray-800 to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Action Buttons - Hidden when printing */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <Link
            href="/trainers"
            className="text-[#D5FC51] hover:text-green-400 transition-colors"
          >
            ← Back to Trainers
          </Link>
          <div className="flex gap-4">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-all duration-300"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              Download
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-[#D5FC51] text-black px-4 py-2 rounded-xl hover:bg-[#D5FC51]/90 transition-all duration-300"
            >
              <PrinterIcon className="h-5 w-5" />
              Print Invoice
            </button>
          </div>
        </div>

        {/* Invoice */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl print:shadow-none print:rounded-none">
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">SIXSTAR FITNESS</h1>
                <p className="text-gray-600">Personal Training Services</p>
                <p className="text-gray-600">123 Fitness Street, Gym City, GC 12345</p>
                <p className="text-gray-600">Phone: (555) 123-4567</p>
                <p className="text-gray-600">Email: info@sixstarfitness.com</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h2>
                <p className="text-gray-600">Invoice #: <span className="font-semibold">{invoiceNumber}</span></p>
                <p className="text-gray-600">Date: <span className="font-semibold">{currentDate}</span></p>
                <p className="text-gray-600">Status: <span className="font-semibold text-green-600">PAID</span></p>
              </div>
            </div>

            {/* Trainer & Service Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Trainer Details</h3>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="font-semibold text-gray-900">{trainer.name}</p>
                  <p className="text-gray-600">{trainer.specialty}</p>
                  <p className="text-gray-600">Certified Personal Trainer</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Details</h3>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-600">Session Type: <span className="font-semibold">{sessionType === 'package' ? 'Package Deal (4 sessions)' : 'Single Session'}</span></p>
                  <p className="text-gray-600">Date: <span className="font-semibold">{date}</span></p>
                  <p className="text-gray-600">Time: <span className="font-semibold">{time}</span></p>
                  <p className="text-gray-600">Duration: <span className="font-semibold">60 minutes</span></p>
                </div>
              </div>
            </div>

            {/* Service Breakdown */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Service Breakdown</h3>
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-900">Service</th>
                      <th className="text-center p-4 font-semibold text-gray-900">Quantity</th>
                      <th className="text-right p-4 font-semibold text-gray-900">Unit Price</th>
                      <th className="text-right p-4 font-semibold text-gray-900">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-200">
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-gray-900">{trainer.specialty}</p>
                          <p className="text-sm text-gray-600">
                            {sessionType === 'package' ? 'Package Deal - 4 Training Sessions' : 'Single Training Session'}
                          </p>
                          <p className="text-sm text-gray-600">with {trainer.name}</p>
                        </div>
                      </td>
                      <td className="p-4 text-center text-gray-900">
                        {sessionType === 'package' ? '4' : '1'}
                      </td>
                      <td className="p-4 text-right text-gray-900">
                        {sessionType === 'package' ? `$${Math.round(parseInt(amount || '0') / 4)}` : `$${amount}`}
                      </td>
                      <td className="p-4 text-right font-semibold text-gray-900">
                        ${amount}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="flex justify-end mb-8">
              <div className="w-full max-w-sm">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900">${amount}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Tax (0%):</span>
                    <span className="text-gray-900">$0.00</span>
                  </div>
                  {sessionType === 'package' && (
                    <div className="flex justify-between mb-2 text-green-600">
                      <span>Package Discount (25%):</span>
                      <span>-$${Math.round(parseInt(amount || '0') * 0.33)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-gray-900">Total Paid:</span>
                      <span className="text-gray-900">${amount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Payment Method</h4>
                  <p className="text-gray-600">Credit Card (****4242)</p>
                  <p className="text-gray-600">Transaction ID: {paymentIntentId || `TXN-${Date.now().toString().slice(-10)}`}</p>
                  {orderNumber && <p className="text-gray-600">Order Number: {orderNumber}</p>}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Next Steps</h4>
                  <p className="text-gray-600">• Your trainer will contact you 24 hours before your session</p>
                  <p className="text-gray-600">• Please arrive 10 minutes early for your appointment</p>
                  <p className="text-gray-600">• Bring water bottle and workout attire</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">
                  Thank you for choosing SixStar Fitness! For questions about your booking, contact us at (555) 123-4567
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Bottom - Hidden when printing */}
        <div className="flex justify-center gap-4 mt-8 print:hidden">
          <Link
            href="/trainers"
            className="bg-gray-700 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-600 transition-all duration-300"
          >
            Book Another Trainer
          </Link>
          <Link
            href="/dashboard"
            className="bg-[#D5FC51] text-black font-bold py-3 px-6 rounded-xl hover:bg-[#D5FC51]/90 transition-all duration-300"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
