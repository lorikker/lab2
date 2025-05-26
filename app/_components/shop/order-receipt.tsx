"use client";

import { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { formatReceiptDate } from "@/app/lib/utils";
import { Cart } from "@/app/lib/shop-data";
import { PrinterIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface OrderReceiptProps {
  orderId: string;
  cart: Cart;
  customerInfo: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function OrderReceipt({
  orderId,
  cart,
  customerInfo: propCustomerInfo,
}: OrderReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [customerInfo, setCustomerInfo] = useState(propCustomerInfo);

  // Try to get customer info from session storage
  useEffect(() => {
    try {
      const storedInfo = sessionStorage.getItem("customerInfo");
      if (storedInfo) {
        setCustomerInfo(JSON.parse(storedInfo));
      }
    } catch (error) {
      console.error(
        "Failed to load customer info from session storage:",
        error,
      );
    }
  }, []);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Handle printing
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `SixStar-Receipt-${orderId}`,
  });

  // Handle PDF download using jsPDF and html2canvas
  const handleDownload = async () => {
    if (!receiptRef.current) return;

    try {
      // Show loading state
      const downloadButton = document.getElementById("download-pdf-button");
      if (downloadButton) {
        downloadButton.textContent = "Generating PDF...";
        downloadButton.setAttribute("disabled", "true");
      }

      // Create canvas from the receipt element
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      // Calculate dimensions
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calculate scaling to fit the page
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;

      // Center the image on the page
      const x = (pdfWidth - scaledWidth) / 2;
      const y = (pdfHeight - scaledHeight) / 2;

      // Add the image to PDF
      pdf.addImage(imgData, "PNG", x, y, scaledWidth, scaledHeight);

      // Download the PDF
      const fileName = `SixStar-Receipt-${orderId.substring(0, 8)}.pdf`;
      pdf.save(fileName);

      // Reset button state
      if (downloadButton) {
        downloadButton.textContent = "Save as PDF";
        downloadButton.removeAttribute("disabled");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");

      // Reset button state
      const downloadButton = document.getElementById("download-pdf-button");
      if (downloadButton) {
        downloadButton.textContent = "Save as PDF";
        downloadButton.removeAttribute("disabled");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        <button
          onClick={handlePrint}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <PrinterIcon className="mr-2 h-4 w-4" />
          Print
        </button>
        <button
          id="download-pdf-button"
          onClick={handleDownload}
          className="inline-flex items-center rounded-md bg-[#D5FC51] px-4 py-2 text-sm font-medium text-[#2A2A2A] shadow-sm hover:bg-[#D5FC51]/80"
        >
          <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
          Save as PDF
        </button>
      </div>

      <div
        ref={receiptRef}
        className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        style={{ maxWidth: "800px", margin: "0 auto" }}
      >
        {/* Receipt Header */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#2A2A2A]">
                SixStar Fitness
              </h1>
              <p className="text-gray-600">Receipt</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-[#2A2A2A]">Order #{orderId}</p>
              <p className="text-gray-600">{formatReceiptDate(new Date())}</p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h2 className="text-lg font-medium text-[#2A2A2A]">Bill To:</h2>
            <div className="mt-2 text-gray-600">
              <p>{customerInfo.name}</p>
              <p>{customerInfo.email}</p>
              <p>{customerInfo.address}</p>
              <p>
                {customerInfo.city}, {customerInfo.state} {customerInfo.zipCode}
              </p>
              <p>{customerInfo.country}</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-medium text-[#2A2A2A]">
              Payment Information:
            </h2>
            <div className="mt-2 text-gray-600">
              <p>Payment Method: Credit Card</p>
              <p>Status: Paid</p>
              <p>
                Transaction ID:{" "}
                {Math.random().toString(36).substring(2, 10).toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-[#2A2A2A]">Order Items:</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                  >
                    Item
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {cart.items.map((item) => {
                  const product = item.product;
                  const price = product?.salePrice || product?.price || 0;
                  const total = price * item.quantity;

                  return (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product?.name || "Unknown Product"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-500">
                        {formatPrice(price)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900">
                        {formatPrice(total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-8 flex justify-end">
          <div className="w-full max-w-xs">
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(cart.total)}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(cart.total * 0.1)}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-lg font-medium text-[#2A2A2A]">
                  Total:
                </span>
                <span className="text-lg font-bold text-[#2A2A2A]">
                  {formatPrice(cart.total + cart.total * 0.1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          <p>Thank you for shopping with SixStar Fitness!</p>
          <p className="mt-2">
            If you have any questions, please contact us at
            support@sixstarfitness.com
          </p>
        </div>
      </div>
    </div>
  );
}
