"use client";

import { useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = ""; // Restore scrolling when modal is closed
    };
  }, [isOpen, onClose]);

  // Close when clicking outside the modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-xl bg-gray-800 border border-gray-700 p-6 shadow-2xl backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            className="rounded-md bg-gray-700 text-gray-400 hover:text-white hover:bg-gray-600 focus:ring-2 focus:ring-[#D5FC51] focus:outline-none p-1 transition-colors"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div>
          <h3 className="mb-4 text-lg leading-6 font-medium text-white">
            {title}
          </h3>
          <div className="mt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
