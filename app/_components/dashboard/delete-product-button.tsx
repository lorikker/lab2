"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export default function DeleteProductButton({
  productId,
  productName,
}: DeleteProductButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      console.log("Deleting product:", productId);

      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Delete response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Delete API error:", errorData);
        throw new Error(errorData.error || "Failed to delete product");
      }

      const result = await response.json();
      console.log("Product deleted successfully:", result);

      // Refresh the page to show updated list
      router.refresh();
    } catch (err) {
      console.error("Error deleting product:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to delete product. Please try again.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`rounded p-1 transition-colors ${
        isDeleting
          ? "cursor-not-allowed text-gray-400"
          : "text-red-600 hover:bg-red-50 hover:text-red-700"
      }`}
      title={isDeleting ? "Deleting..." : "Delete product"}
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  );
}
