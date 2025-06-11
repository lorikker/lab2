"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PrinterIcon, DocumentArrowDownIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  product?: {
    name: string;
    image?: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  invoiceNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  paymentIntent: string;
  items: OrderItem[];
  shippingInfo?: any;
  billingInfo?: any;
  user?: {
    name: string;
    email: string;
  };
}

export default function ShopInvoicePage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const invoiceNumber = searchParams.get("invoiceNumber");
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      } else {
        console.error("Failed to fetch order");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle print
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `SixStar-Invoice-${invoiceNumber}`,
    onBeforeGetContent: () => {
      setIsPrinting(true);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
  });

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      setIsPrinting(true);
      
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`SixStar-Invoice-${invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsPrinting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#D5FC51]"></div>
            <p className="text-gray-600">Loading invoice...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="py-16 text-center">
            <h1 className="mb-4 text-2xl font-bold text-gray-900">Invoice Not Found</h1>
            <p className="text-gray-600">The invoice you're looking for doesn't exist.</p>
            <Link
              href="/shop"
              className="mt-4 inline-block rounded-lg bg-[#D5FC51] px-6 py-3 text-[#2A2A2A] font-medium hover:opacity-90 transition-opacity"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Parse shipping info
  let shippingInfo = null;
  if (order.shippingInfo) {
    try {
      shippingInfo = typeof order.shippingInfo === 'string' 
        ? JSON.parse(order.shippingInfo) 
        : order.shippingInfo;
    } catch (error) {
      console.error("Error parsing shipping info:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/admin/order-bills"
              className="mr-4 rounded-lg p-2 text-gray-600 hover:bg-white hover:text-[#D5FC51] transition-colors"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="mb-2 text-3xl font-bold text-[#2A2A2A]">
                Invoice #{order.invoiceNumber}
              </h1>
              <p className="text-lg text-gray-600">
                Order #{order.orderNumber}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex items-center rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <PrinterIcon className="mr-2 h-5 w-5" />
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isPrinting}
              className="flex items-center rounded-lg bg-[#D5FC51] px-4 py-2 text-[#2A2A2A] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <DocumentArrowDownIcon className="mr-2 h-5 w-5" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Invoice */}
        <div
          ref={invoiceRef}
          className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
          style={{ minHeight: "800px" }}
        >
          {/* Invoice Header */}
          <div className="mb-8 flex justify-between border-b border-gray-200 pb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#2A2A2A]">SixStar Fitness</h1>
              <p className="mt-2 text-gray-600">Premium Fitness Equipment & Supplements</p>
              <p className="text-gray-600">123 Fitness Street, Gym City, GC 12345</p>
              <p className="text-gray-600">Phone: (555) 123-4567</p>
              <p className="text-gray-600">Email: orders@sixstarfitness.com</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-[#2A2A2A]">INVOICE</h2>
              <p className="mt-2 text-gray-600">Invoice #: {order.invoiceNumber}</p>
              <p className="text-gray-600">Order #: {order.orderNumber}</p>
              <p className="text-gray-600">Date: {formatDate(order.createdAt)}</p>
              <p className="text-gray-600">Payment ID: {order.paymentIntent}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-[#2A2A2A]">Bill To:</h3>
              <div className="text-gray-600">
                <p className="font-medium">{order.user?.name || shippingInfo?.name || 'Guest Customer'}</p>
                <p>{order.user?.email || shippingInfo?.email || 'No email provided'}</p>
                {shippingInfo && (
                  <>
                    <p>{shippingInfo.address}</p>
                    <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                    <p>{shippingInfo.country}</p>
                  </>
                )}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-[#2A2A2A]">Payment Info:</h3>
              <div className="text-gray-600">
                <p>Status: <span className="font-medium text-green-600">{order.paymentStatus}</span></p>
                <p>Method: Credit Card</p>
                <p>Payment ID: {order.paymentIntent}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-semibold text-[#2A2A2A]">Order Items:</h3>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Item</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Qty</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Price</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{item.product?.name || item.name}</p>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatPrice(item.price)}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 py-2">
                  <span className="text-lg font-semibold text-[#2A2A2A]">Total:</span>
                  <span className="text-lg font-bold text-[#2A2A2A]">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
            <p>Thank you for your business!</p>
            <p className="mt-2">For questions about this invoice, contact us at orders@sixstarfitness.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
