"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/app/lib/product-actions";
import { ProductCategory } from "@prisma/client";
import ImageUpload from "@/app/_components/image-upload";

interface ProductFormProps {
  categories: ProductCategory[];
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    salePrice?: number | null;
    inventory: number;
    images: string[];
    featured: boolean;
    slug: string;
    categoryId: string;
  };
}

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>(product?.images || [""]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);

      // Add the image URLs to the form data (filter out empty URLs)
      formData.delete("images"); // Remove any existing images field
      const validImageUrls = imageUrls.filter((url) => url.trim() !== "");
      validImageUrls.forEach((url) => {
        formData.append("images", url);
      });

      if (product) {
        // Update existing product
        await updateProduct(formData);
        router.push("/dashboard/shop/products");
        router.refresh();
      } else {
        // Create new product
        await createProduct(formData);
        router.push("/dashboard/shop/products");
        router.refresh();
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to save product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateImageUrl = (index: number, url: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = url;
    setImageUrls(newUrls);
  };

  const addImageField = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const removeImageField = (index: number) => {
    if (imageUrls.length > 1) {
      setImageUrls(imageUrls.filter((_, i) => i !== index));
    } else {
      setImageUrls([""]);
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={product?.name || ""}
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
            defaultValue={product?.slug || ""}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-[#D5FC51] focus:outline-none sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            URL-friendly name (e.g., "protein-powder")
          </p>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            defaultValue={product?.description || ""}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-[#D5FC51] focus:outline-none sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price ($) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            min="0"
            step="0.01"
            required
            defaultValue={product?.price || ""}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-[#D5FC51] focus:outline-none sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="salePrice"
            className="block text-sm font-medium text-gray-700"
          >
            Sale Price ($)
          </label>
          <input
            type="number"
            id="salePrice"
            name="salePrice"
            min="0"
            step="0.01"
            defaultValue={product?.salePrice || ""}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-[#D5FC51] focus:outline-none sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave empty if not on sale
          </p>
        </div>

        <div>
          <label
            htmlFor="inventory"
            className="block text-sm font-medium text-gray-700"
          >
            Inventory *
          </label>
          <input
            type="number"
            id="inventory"
            name="inventory"
            min="0"
            required
            defaultValue={product?.inventory || 0}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-[#D5FC51] focus:outline-none sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700"
          >
            Category *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={product?.categoryId || ""}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#D5FC51] focus:ring-[#D5FC51] focus:outline-none sm:text-sm"
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              defaultChecked={product?.featured || false}
              className="h-4 w-4 rounded border-gray-300 text-[#D5FC51] focus:ring-[#D5FC51]"
            />
            <label
              htmlFor="featured"
              className="ml-2 block text-sm text-gray-700"
            >
              Featured Product
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Featured products are displayed prominently on the shop page
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="mb-4 block text-sm font-medium text-gray-700">
            Product Images
          </label>
          <div className="space-y-6">
            {imageUrls.map((url, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">
                    Image {index + 1}
                  </h4>
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <ImageUpload
                  value={url}
                  onChange={(newUrl) => updateImageUrl(index, newUrl)}
                  onRemove={() => removeImageField(index)}
                  placeholder={`Enter image URL for image ${index + 1} or upload file`}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addImageField}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-[#D5FC51] focus:ring-offset-2 focus:outline-none"
            >
              + Add Another Image
            </button>
          </div>
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
            : product
              ? "Update Product"
              : "Create Product"}
        </button>
      </div>
    </form>
  );
}
