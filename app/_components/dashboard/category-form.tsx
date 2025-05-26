"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory } from "@/app/lib/category-actions";
import ImageUpload from "@/app/_components/image-upload";

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    image: string | null;
  };
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(category?.image || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);

      // Add the image URL to the form data
      if (imageUrl) {
        formData.set("image", imageUrl);
      }

      if (category) {
        // Update existing category
        await updateCategory(formData);
        router.push("/dashboard/shop/categories");
        router.refresh();
      } else {
        // Create new category
        await createCategory(formData);
        router.push("/dashboard/shop/categories");
        router.refresh();
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to save category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {category && <input type="hidden" name="id" value={category.id} />}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Category Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={category?.name || ""}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-[#D5FC51] focus:outline-none sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700"
          >
            Slug *
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            required
            defaultValue={category?.slug || ""}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-[#D5FC51] focus:outline-none sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            URL-friendly name (e.g., "fitness-equipment")
          </p>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={category?.description || ""}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-[#D5FC51] focus:outline-none sm:text-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-4 block text-sm font-medium text-gray-700">
            Category Image
          </label>
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            placeholder="Enter image URL for category or upload file"
          />
          <p className="mt-2 text-xs text-gray-500">
            Category image is optional but recommended for better visual
            presentation
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-[#D5FC51] focus:ring-offset-2 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center rounded-md border border-transparent bg-[#D5FC51] px-4 py-2 text-sm font-medium text-[#2A2A2A] shadow-sm hover:bg-[#D5FC51]/80 focus:ring-2 focus:ring-[#D5FC51] focus:ring-offset-2 focus:outline-none"
        >
          {isSubmitting
            ? "Saving..."
            : category
              ? "Update Category"
              : "Create Category"}
        </button>
      </div>
    </form>
  );
}
