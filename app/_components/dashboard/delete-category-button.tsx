"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteCategory } from "@/app/lib/category-actions";

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
  productCount: number;
}

export default function DeleteCategoryButton({
  categoryId,
  categoryName,
  productCount,
}: DeleteCategoryButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Check if this is the "Uncategorized" category
    if (categoryName.toLowerCase() === "uncategorized") {
      alert(
        "Cannot delete the 'Uncategorized' category.\n\nThis is a system category used to hold products when other categories are deleted. It cannot be removed to maintain data integrity.",
      );
      return;
    }

    // Create confirmation message
    let confirmMessage = `Are you sure you want to delete "${categoryName}"?`;

    if (productCount > 0) {
      confirmMessage += `\n\nWarning: This category contains ${productCount} product${productCount !== 1 ? "s" : ""}. These products will be moved to "Uncategorized".`;
    }

    confirmMessage += "\n\nThis action cannot be undone.";

    if (!confirm(confirmMessage)) {
      return;
    }

    setIsDeleting(true);

    try {
      console.log("Deleting category:", categoryId);

      const formData = new FormData();
      formData.append("id", categoryId);

      await deleteCategory(formData);

      console.log("Category deleted successfully");
      router.refresh();
    } catch (err) {
      console.error("Error deleting category:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to delete category. Please try again.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const isUncategorized = categoryName.toLowerCase() === "uncategorized";

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting || isUncategorized}
      className={`rounded p-1 transition-colors ${
        isDeleting
          ? "cursor-not-allowed text-gray-400"
          : isUncategorized
            ? "cursor-not-allowed text-gray-300"
            : "text-red-600 hover:bg-red-50 hover:text-red-700"
      }`}
      title={
        isDeleting
          ? "Deleting..."
          : isUncategorized
            ? "Cannot delete system category"
            : "Delete category"
      }
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  );
}
