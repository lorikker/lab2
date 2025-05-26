"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
  XMarkIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { formatReceiptDate } from "@/app/lib/utils";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface OrderReceiptModalProps {
  order: any; // Using any for simplicity, but should be properly typed in a real app
  onClose: () => void;
}

export default function OrderReceiptModal({
  order,
  onClose,
}: OrderReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Calculate order total
  const orderTotal = order.items.reduce((total: number, item: any) => {
    return total + item.price * item.quantity;
  }, 0);

  // Calculate tax (10%)
  const tax = orderTotal * 0.1;

  // Calculate grand total
  const grandTotal = orderTotal + tax;

  // Extract customer info from order's shippingInfo
  let customerInfo = {
    name: order.user?.name || "Customer",
    email: order.user?.email || "No email provided",
    address: "No address provided",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  };

  // Parse shippingInfo if it exists
  if (order.shippingInfo) {
    try {
      const shippingInfo =
        typeof order.shippingInfo === "string"
          ? JSON.parse(order.shippingInfo)
          : order.shippingInfo;

      customerInfo = {
        name: shippingInfo.name || customerInfo.name,
        email: shippingInfo.email || customerInfo.email,
        address: shippingInfo.address || "No address provided",
        city: shippingInfo.city || "",
        state: shippingInfo.state || "",
        zipCode: shippingInfo.zipCode || "",
        country: shippingInfo.country || "",
      };
    } catch (error) {
      console.error("Error parsing shipping info:", error);
    }
  }

  // Handle printing
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `SixStar-Receipt-${order.id.substring(0, 8)}`,
  });

  // Fallback PDF generation using text-based approach
  const generateTextPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;

    // Header
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("SixStar Fitness", 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text("Receipt", 20, yPosition);
    yPosition += 15;

    // Order info
    pdf.setFontSize(12);
    pdf.text(`Order #${order.id.substring(0, 8)}`, 20, yPosition);
    pdf.text(
      `Date: ${formatReceiptDate(new Date(order.createdAt))}`,
      pageWidth - 60,
      yPosition,
    );
    yPosition += 15;

    // Customer info
    pdf.setFont("helvetica", "bold");
    pdf.text("Bill To:", 20, yPosition);
    yPosition += 8;

    pdf.setFont("helvetica", "normal");
    pdf.text(customerInfo.name, 20, yPosition);
    yPosition += 6;
    pdf.text(customerInfo.email, 20, yPosition);
    yPosition += 6;
    if (customerInfo.address !== "No address provided") {
      pdf.text(customerInfo.address, 20, yPosition);
      yPosition += 6;
    }
    if (customerInfo.city || customerInfo.state || customerInfo.zipCode) {
      const cityStateZip =
        `${customerInfo.city}${customerInfo.city && customerInfo.state ? ", " : ""}${customerInfo.state} ${customerInfo.zipCode}`.trim();
      pdf.text(cityStateZip, 20, yPosition);
      yPosition += 6;
    }
    if (customerInfo.country) {
      pdf.text(customerInfo.country, 20, yPosition);
      yPosition += 6;
    }
    yPosition += 9;

    // Items header
    pdf.setFont("helvetica", "bold");
    pdf.text("Items:", 20, yPosition);
    yPosition += 10;

    // Items
    pdf.setFont("helvetica", "normal");
    order.items.forEach((item: any) => {
      const itemText = `${item.quantity}x ${item.product?.name || "Product"} - ${formatPrice(item.price * item.quantity)}`;
      pdf.text(itemText, 25, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    // Total
    pdf.setFont("helvetica", "bold");
    pdf.text(
      `Total: ${formatPrice(orderTotal + tax)}`,
      pageWidth - 60,
      yPosition,
    );

    // Download
    const fileName = `SixStar-Receipt-${order.id.substring(0, 8)}.pdf`;
    pdf.save(fileName);
  };

  // Handle PDF download using jsPDF and html2canvas
  const handleDownload = async () => {
    if (!receiptRef.current) {
      console.error("Receipt ref is not available");
      return;
    }

    try {
      console.log("Starting PDF generation...");

      // Show loading state
      const downloadButton = document.getElementById("download-pdf-button");
      if (downloadButton) {
        downloadButton.textContent = "Generating PDF...";
        downloadButton.setAttribute("disabled", "true");
      }

      console.log("Creating canvas from receipt element...");

      // Create canvas from the receipt element with more specific options
      const canvas = await html2canvas(receiptRef.current, {
        scale: 1.5, // Reduced scale to avoid memory issues
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        width: receiptRef.current.scrollWidth,
        height: receiptRef.current.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });

      console.log(
        "Canvas created successfully, size:",
        canvas.width,
        "x",
        canvas.height,
      );

      // Calculate dimensions
      const imgData = canvas.toDataURL("image/png", 0.8); // Reduced quality to avoid size issues
      console.log("Image data created, length:", imgData.length);

      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      console.log("PDF dimensions:", pdfWidth, "x", pdfHeight);
      console.log("Image dimensions:", imgWidth, "x", imgHeight);

      // Calculate scaling to fit the page with some margin
      const margin = 10; // 10mm margin
      const availableWidth = pdfWidth - margin * 2;
      const availableHeight = pdfHeight - margin * 2;

      const ratio = Math.min(
        availableWidth / imgWidth,
        availableHeight / imgHeight,
      );
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;

      // Center the image on the page
      const x = (pdfWidth - scaledWidth) / 2;
      const y = (pdfHeight - scaledHeight) / 2;

      console.log(
        "Adding image to PDF at position:",
        x,
        y,
        "with size:",
        scaledWidth,
        "x",
        scaledHeight,
      );

      // Add the image to PDF
      pdf.addImage(imgData, "PNG", x, y, scaledWidth, scaledHeight);

      // Download the PDF
      const fileName = `SixStar-Receipt-${order.id.substring(0, 8)}.pdf`;
      console.log("Saving PDF as:", fileName);

      pdf.save(fileName);

      console.log("PDF generated and downloaded successfully!");

      // Reset button state
      if (downloadButton) {
        downloadButton.textContent = "Save as PDF";
        downloadButton.removeAttribute("disabled");
      }
    } catch (error) {
      console.error("Detailed error generating PDF:", error);
      console.error("Error stack:", error.stack);

      // Try fallback text-based PDF generation
      console.log("Attempting fallback text-based PDF generation...");
      try {
        generateTextPDF();
        console.log("Fallback PDF generated successfully!");

        // Reset button state
        const downloadButton = document.getElementById("download-pdf-button");
        if (downloadButton) {
          downloadButton.textContent = "Save as PDF";
          downloadButton.removeAttribute("disabled");
        }
      } catch (fallbackError) {
        console.error("Fallback PDF generation also failed:", fallbackError);
        alert(
          `Error generating PDF: ${error.message}. Please try the print option instead.`,
        );

        // Reset button state
        const downloadButton = document.getElementById("download-pdf-button");
        if (downloadButton) {
          downloadButton.textContent = "Save as PDF";
          downloadButton.removeAttribute("disabled");
        }
      }
    }
  };

  return (
    <div className="bg-opacity-75 fixed inset-0 z-50 overflow-y-auto bg-gray-500">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-4xl rounded-lg bg-white shadow-xl">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-[#2A2A2A]">
              Order Receipt
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
            <div className="flex justify-end space-x-2 pb-4">
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
              className="rounded-lg border border-gray-200 bg-white p-6"
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
                    <p className="font-medium text-[#2A2A2A]">
                      Order #{order.id.substring(0, 8)}
                    </p>
                    <p className="text-gray-600">
                      {formatReceiptDate(new Date(order.createdAt))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h2 className="text-lg font-medium text-[#2A2A2A]">
                    Bill To:
                  </h2>
                  <div className="mt-2 text-gray-600">
                    <p>{customerInfo.name}</p>
                    <p>{customerInfo.email}</p>
                    <p>{customerInfo.address}</p>
                    {(customerInfo.city ||
                      customerInfo.state ||
                      customerInfo.zipCode) && (
                      <p>
                        {customerInfo.city}
                        {customerInfo.city && customerInfo.state && ", "}
                        {customerInfo.state} {customerInfo.zipCode}
                      </p>
                    )}
                    {customerInfo.country && <p>{customerInfo.country}</p>}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-medium text-[#2A2A2A]">
                    Payment Information:
                  </h2>
                  <div className="mt-2 text-gray-600">
                    <p>Payment Method: Credit Card</p>
                    <p>Status: {order.status}</p>
                    <p>Transaction ID: {order.transactionId || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-8">
                <h2 className="text-lg font-medium text-[#2A2A2A]">
                  Order Items:
                </h2>
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
                      {order.items.map((item: any) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {item.product?.name ||
                                "Product no longer available"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-500">
                            {formatPrice(item.price)}
                          </td>
                          <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
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
                        {formatPrice(orderTotal)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-600">Tax (10%):</span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(tax)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-lg font-medium text-[#2A2A2A]">
                        Total:
                      </span>
                      <span className="text-lg font-bold text-[#2A2A2A]">
                        {formatPrice(grandTotal)}
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
        </div>
      </div>
    </div>
  );
}
