"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  PrinterIcon,
  ArrowDownTrayIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function InvoicePage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "basic";
  // Use a stable initial value for server-side rendering
  // Get date in YYYY-MM-DD format for consistency
  const todayString = new Date().toISOString().split('T')[0];
  // Create a stable date object from the string
  const today = new Date(todayString);
  // Generate a stable seed based on the date
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  // Create a stable invoice number
  const initialInvoiceNumber = "INV-" + seed.toString().slice(-4).padStart(4, '0');
  const [invoiceNumber, setInvoiceNumber] = useState(initialInvoiceNumber);
  // Use a stable date string for both server and client rendering
  const currentDateString = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const [currentDate] = useState(new Date(currentDateString));
  const [isPrinting, setIsPrinting] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    cardLast4: ""
  });
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Generate a stable invoice number if not provided
  function generateInvoiceNumber() {
    // Always return the initialInvoiceNumber for consistency
    return initialInvoiceNumber;
  }

  // Get plan details based on the plan parameter
  const getPlanDetails = () => {
    switch(plan) {
      case "premium":
        return {
          name: "Premium",
          price: "49.99",
          features: [
            "All Basic features",
            "Group fitness classes",
            "Personalized workout plan",
            "Nutrition consultation"
          ]
        };
      case "elite":
        return {
          name: "Elite",
          price: "79.99",
          features: [
            "All Premium features",
            "Personal training sessions",
            "Advanced health monitoring",
            "Exclusive member events"
          ]
        };
      default:
        return {
          name: "Basic",
          price: "29.99",
          features: [
            "Access to gym floor",
            "Basic equipment usage",
            "Locker room access",
            "Free water station"
          ]
        };
    }
  };

  const planDetails = getPlanDetails();

  // Format date as YYYY-MM-DD (ISO format) for consistency between server and client
  const formatDate = (date: Date) => {
    // Use ISO string format which is consistent across server and client
    return date.toISOString().split('T')[0];
  };

  // Calculate next billing date (30 days from now)
  const nextBillingDate = new Date(currentDate);
  nextBillingDate.setDate(nextBillingDate.getDate() + 30);

  // Handle print button click
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      // Create a simple PDF directly without using html2canvas
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20; // margin in mm

      // Add invoice header
      pdf.setFontSize(22);
      pdf.setTextColor(42, 42, 42); // #2A2A2A
      pdf.text('INVOICE', margin, margin);

      pdf.setFontSize(12);
      pdf.text(`Invoice #: ${invoiceNumber}`, margin, margin + 10);
      pdf.text(`Date: ${formatDate(currentDate)}`, margin, margin + 20);

      // Add billing info
      pdf.setFontSize(14);
      pdf.text('Billed To:', margin, margin + 35);

      pdf.setFontSize(12);
      pdf.text(`${billingInfo.firstName} ${billingInfo.lastName}`, margin, margin + 45);
      pdf.text(billingInfo.email, margin, margin + 52);
      pdf.text(billingInfo.address, margin, margin + 59);
      pdf.text(`${billingInfo.city}, ${billingInfo.zipCode}`, margin, margin + 66);
      pdf.text(billingInfo.country, margin, margin + 73);

      // Add payment info
      pdf.setFontSize(14);
      pdf.text('Payment Information:', pageWidth - margin - 80, margin + 35);

      pdf.setFontSize(12);
      pdf.text(`Credit Card (ending in ${billingInfo.cardLast4 || '****'})`, pageWidth - margin - 80, margin + 45);
      pdf.text(`Billing Period:`, pageWidth - margin - 80, margin + 52);
      pdf.text(`${formatDate(currentDate)} - ${formatDate(nextBillingDate)}`, pageWidth - margin - 80, margin + 59);

      // Add horizontal line
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, margin + 85, pageWidth - margin, margin + 85);

      // Add invoice items
      pdf.setFontSize(14);
      pdf.text('Description', margin, margin + 100);
      pdf.text('Amount', pageWidth - margin - 30, margin + 100, { align: 'right' });

      pdf.setFontSize(12);
      pdf.text(`${planDetails.name} Membership Plan`, margin, margin + 110);
      pdf.text(`Monthly subscription`, margin, margin + 117);
      pdf.text(`$${planDetails.price}`, pageWidth - margin - 30, margin + 110, { align: 'right' });

      // Add horizontal line
      pdf.line(margin, margin + 125, pageWidth - margin, margin + 125);

      // Add totals
      pdf.text('Subtotal', pageWidth - margin - 80, margin + 135);
      pdf.text(`$${planDetails.price}`, pageWidth - margin - 30, margin + 135, { align: 'right' });

      pdf.text('Tax (0%)', pageWidth - margin - 80, margin + 142);
      pdf.text('$0.00', pageWidth - margin - 30, margin + 142, { align: 'right' });

      pdf.setFontSize(14);
      pdf.text('Total', pageWidth - margin - 80, margin + 152);
      pdf.text(`$${planDetails.price}`, pageWidth - margin - 30, margin + 152, { align: 'right' });

      // Add payment status
      pdf.setFillColor(240, 255, 240);
      pdf.roundedRect(margin, margin + 165, pageWidth - (margin * 2), 20, 3, 3, 'F');
      pdf.setTextColor(0, 100, 0);
      pdf.text('Payment Successful', margin + 10, margin + 178);

      // Add plan features
      pdf.setTextColor(42, 42, 42);
      pdf.setFontSize(14);
      pdf.text('Plan Features:', margin, margin + 200);

      pdf.setFontSize(12);
      planDetails.features.forEach((feature, index) => {
        pdf.text(`• ${feature}`, margin, margin + 210 + (index * 7));
      });

      // Add footer
      pdf.setFontSize(10);
      pdf.text('Thank you for choosing FitnessHub!', pageWidth / 2, pageHeight - 20, { align: 'center' });
      pdf.text('If you have any questions, please contact support@fitnesshub.com', pageWidth / 2, pageHeight - 15, { align: 'center' });

      // Download the PDF
      pdf.save(`Invoice-${invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    }
  };

  // Handle email modal
  const handleEmailInvoice = () => {
    // Pre-fill with user's email if available
    if (billingInfo.email) {
      setEmailAddress(billingInfo.email);
    }
    setIsEmailModalOpen(true);
  };

  // Handle sending email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailAddress) return;

    setEmailStatus("sending");

    try {
      // Get message from form
      const messageElement = document.getElementById('message') as HTMLTextAreaElement;
      const message = messageElement ? messageElement.value : '';

      // Generate a proper URL for "View Invoice Online" link
      // This ensures it works even when clicked from an email
      const baseUrl = typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.host}`
        : '';
      // Make sure plan name is lowercase and URL-safe
      const planParam = planDetails.name.toLowerCase().replace(/\s+/g, '-');
      const viewUrl = `${baseUrl}/membership/invoice?plan=${planParam}&invoice=${invoiceNumber}`;

      // Prepare invoice data for email
      const invoiceData = {
        invoiceNumber,
        date: formatDate(currentDate),
        customerName: `${billingInfo.firstName} ${billingInfo.lastName}`,
        customerEmail: billingInfo.email,
        cardLast4: billingInfo.cardLast4,
        planName: planDetails.name,
        price: planDetails.price,
        features: planDetails.features,
        viewUrl
      };

      // Send email using our API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailAddress,
          subject: `Your Invoice #${invoiceNumber} from FitnessHub`,
          message,
          invoiceData
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEmailStatus("success");

        // Close modal after success
        setTimeout(() => {
          setIsEmailModalOpen(false);
          setEmailStatus("idle");
        }, 2000);
      } else {
        throw new Error(data.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);

      // Store error message for display
      let errorMessage = 'Failed to send email';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Set error state with message
      setEmailStatus("error");

      // Display error in console for debugging
      console.log('Detailed error:', errorMessage);

      // Reset after error
      setTimeout(() => {
        setEmailStatus("idle");
      }, 5000);
    }
  };

  // Extract values from searchParams to use in dependencies
  const urlInvoiceNumber = searchParams.get("invoice");
  const urlPlan = searchParams.get("plan");

  // Set a default invoice number for server-side rendering
  useEffect(() => {
    // This will only run on the client side
    const fetchData = () => {
      if (urlInvoiceNumber) {
        // If invoice number is in URL, use it
        setInvoiceNumber(urlInvoiceNumber);
      } else {
        // Otherwise check session storage
        const storedInvoiceNumber = sessionStorage.getItem('invoiceNumber');
        if (storedInvoiceNumber) {
          setInvoiceNumber(storedInvoiceNumber);
        } else {
          setInvoiceNumber(generateInvoiceNumber());
        }
      }

      // Get billing information
      const storedBillingInfo = sessionStorage.getItem('billingInfo');
      if (storedBillingInfo) {
        try {
          const parsedBillingInfo = JSON.parse(storedBillingInfo);
          setBillingInfo(parsedBillingInfo);
        } catch (error) {
          console.error('Error parsing billing info:', error);
        }
      }
    };

    // Set initial values to prevent hydration mismatch
    // If invoice is in URL, use it for initial value to prevent flicker
    setInvoiceNumber(urlInvoiceNumber || initialInvoiceNumber);

    // Then update with session storage values
    fetchData();

    // Only log this in development to help debug
    console.log('Invoice useEffect running with:', { urlInvoiceNumber, urlPlan });
  }, [urlInvoiceNumber, urlPlan, initialInvoiceNumber]);

  // Add print styles
  useEffect(() => {
    // Add print-specific styles
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        .invoice-container, .invoice-container * {
          visibility: visible;
        }
        .invoice-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Action buttons */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-md print:hidden">
          <div>
            <h1 className="text-xl font-bold text-[#2A2A2A]">Invoice #{invoiceNumber}</h1>
            <p className="text-sm text-gray-600">Thank you for your purchase!</p>
            <div className="mt-2 flex gap-2">
              {/* Removed Back to Checkout and Start New Purchase buttons */}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex items-center rounded-md bg-[#2A2A2A] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3A3A3A] disabled:opacity-70"
            >
              <PrinterIcon className="mr-2 h-4 w-4" />
              Print Invoice
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center rounded-md bg-[#D5FC51] px-4 py-2 text-sm font-medium text-[#2A2A2A] transition-colors hover:opacity-90"
            >
              <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
              Download PDF
            </button>
            <button
              onClick={handleEmailInvoice}
              className="flex items-center rounded-md border border-[#2A2A2A] px-4 py-2 text-sm font-medium text-[#2A2A2A] transition-colors hover:bg-[#2A2A2A] hover:text-white"
            >
              <EnvelopeIcon className="mr-2 h-4 w-4" />
              Email Invoice
            </button>
          </div>
        </div>

        {/* Invoice */}
        <div ref={invoiceRef} className="invoice-container rounded-lg bg-white p-8 shadow-lg">
          {/* Header */}
          <div className="mb-8 flex flex-col items-start justify-between border-b border-gray-200 pb-8 md:flex-row md:items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#D5FC51]">
                  <span className="text-lg font-bold text-[#2A2A2A]">F</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#2A2A2A]">FitnessHub</h1>
                  <p className="text-sm text-gray-600">Your Fitness Journey Partner</p>
                </div>
              </div>
            </div>
            <div className="rounded-md bg-[#F8F9FA] p-4">
              <h2 className="text-lg font-bold text-[#2A2A2A]">INVOICE</h2>
              <p className="text-sm text-gray-600">#{invoiceNumber}</p>
              <p className="mt-1 text-sm text-gray-600">Date: {formatDate(currentDate)}</p>
            </div>
          </div>

          {/* Billing Info */}
          <div className="mb-8 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-bold uppercase text-gray-500">Billed To</h3>
              <p className="font-medium text-[#2A2A2A]">{billingInfo.firstName} {billingInfo.lastName}</p>
              <p className="text-sm text-gray-600">{billingInfo.email}</p>
              <p className="text-sm text-gray-600">{billingInfo.address}</p>
              <p className="text-sm text-gray-600">{billingInfo.city}, {billingInfo.zipCode}</p>
              <p className="text-sm text-gray-600">{billingInfo.country}</p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-bold uppercase text-gray-500">Payment Information</h3>
              <p className="font-medium text-[#2A2A2A]">Payment Method</p>
              <p className="text-sm text-gray-600">Credit Card (ending in {billingInfo.cardLast4 || '****'})</p>
              <p className="mt-4 font-medium text-[#2A2A2A]">Billing Period</p>
              <p className="text-sm text-gray-600">{formatDate(currentDate)} - {formatDate(nextBillingDate)}</p>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-[#F8F9FA]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-bold uppercase text-gray-500">Quantity</th>
                  <th className="px-6 py-3 text-right text-xs font-bold uppercase text-gray-500">Unit Price</th>
                  <th className="px-6 py-3 text-right text-xs font-bold uppercase text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-[#2A2A2A]">{planDetails.name} Membership Plan</p>
                      <p className="text-sm text-gray-600">Monthly subscription</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-600">1</td>
                  <td className="px-6 py-4 text-right text-sm text-gray-600">${planDetails.price}</td>
                  <td className="px-6 py-4 text-right font-medium text-[#2A2A2A]">${planDetails.price}</td>
                </tr>
                <tr className="bg-[#F8F9FA]">
                  <td colSpan={2} className="px-6 py-4"></td>
                  <td className="px-6 py-4 text-right text-sm font-bold uppercase text-gray-500">Subtotal</td>
                  <td className="px-6 py-4 text-right font-medium text-[#2A2A2A]">${planDetails.price}</td>
                </tr>
                <tr>
                  <td colSpan={2} className="px-6 py-4"></td>
                  <td className="px-6 py-4 text-right text-sm font-bold uppercase text-gray-500">Tax (0%)</td>
                  <td className="px-6 py-4 text-right font-medium text-[#2A2A2A]">$0.00</td>
                </tr>
                <tr className="bg-[#F8F9FA]">
                  <td colSpan={2} className="px-6 py-4"></td>
                  <td className="px-6 py-4 text-right text-sm font-bold uppercase text-gray-500">Total</td>
                  <td className="px-6 py-4 text-right text-lg font-bold text-[#2A2A2A]">${planDetails.price}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Status */}
          <div className="mb-8 flex items-center rounded-lg bg-green-50 p-4 text-green-800">
            <CheckCircleIcon className="mr-3 h-6 w-6 text-green-500" />
            <div>
              <p className="font-medium">Payment Successful</p>
              <p className="text-sm">Transaction ID: TXN-{invoiceNumber?.replace('INV-', '') || '000000'}</p>
            </div>
          </div>

          {/* Plan Details */}
          <div className="mb-8 rounded-lg bg-[#F8F9FA] p-6">
            <h3 className="mb-4 text-lg font-bold text-[#2A2A2A]">Plan Details</h3>
            <ul className="space-y-2">
              {planDetails.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircleIcon className="mr-2 h-5 w-5 flex-shrink-0 text-[#D5FC51]" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-sm text-gray-600">Thank you for choosing FitnessHub!</p>
            <p className="mt-2 text-xs text-gray-500">
              If you have any questions about this invoice, please contact our support team at support@fitnesshub.com
            </p>
            <div className="mt-4 flex justify-center space-x-4 no-print">
              {/* Removed Back to Checkout button */}
              <Link
                href="/"
                className="text-sm font-medium text-[#2A2A2A] hover:text-[#D5FC51]"
              >
                Return to Home
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-[#2A2A2A] hover:text-[#D5FC51]"
              >
                Go to Dashboard
              </Link>
              {/* Removed Start New Purchase button */}
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#2A2A2A]">Email Invoice</h3>
              <button
                onClick={() => {
                  setIsEmailModalOpen(false);
                  setEmailStatus("idle");
                }}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {emailStatus === "success" ? (
              <div className="rounded-md bg-green-50 p-4 text-green-800">
                <div className="flex">
                  <CheckCircleIcon className="mr-3 h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Email sent successfully!</p>
                    <p className="text-sm">The invoice has been sent to {emailAddress}</p>
                  </div>
                </div>
              </div>
            ) : emailStatus === "error" ? (
              <div className="rounded-md bg-red-50 p-4 text-red-800">
                <div className="flex">
                  <XMarkIcon className="mr-3 h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium">Failed to send email</p>
                    <p className="text-sm">Please check your Mailjet API credentials and sender email verification.</p>
                    <p className="mt-2 text-xs">Error details: Check browser console for more information.</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendEmail}>
                <div className="mb-4">
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#2A2A2A]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="Enter email address"
                    required
                    className="w-full rounded-md border border-[#D9D9D9] p-3 text-[#2A2A2A] shadow-sm transition-all duration-200 focus:border-[#D5FC51] focus:outline-none focus:ring-2 focus:ring-[#D5FC51] focus:ring-opacity-20"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="mb-1 block text-sm font-medium text-[#2A2A2A]">
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    placeholder="Add a personal message (optional)"
                    className="w-full rounded-md border border-[#D9D9D9] p-3 text-[#2A2A2A] shadow-sm transition-all duration-200 focus:border-[#D5FC51] focus:outline-none focus:ring-2 focus:ring-[#D5FC51] focus:ring-opacity-20"
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={emailStatus === "sending" || !emailAddress}
                    className="flex items-center rounded-md bg-[#D5FC51] px-4 py-2 text-sm font-medium text-[#2A2A2A] transition-colors hover:opacity-90 disabled:opacity-70"
                  >
                    {emailStatus === "sending" ? (
                      <>
                        <svg className="mr-2 h-4 w-4 animate-spin text-[#2A2A2A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <EnvelopeIcon className="mr-2 h-4 w-4" />
                        Send Invoice
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
