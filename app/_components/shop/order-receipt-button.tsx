"use client";

import { useState } from "react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import OrderReceiptModal from "./order-receipt-modal";

interface OrderReceiptButtonProps {
  order: any; // Using any for simplicity, but should be properly typed in a real app
}

export default function OrderReceiptButton({ order }: OrderReceiptButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        title="View Receipt"
      >
        <DocumentTextIcon className="mr-1 h-4 w-4" />
        Receipt
      </button>

      {isOpen && (
        <OrderReceiptModal order={order} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
