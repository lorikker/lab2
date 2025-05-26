"use client";

import { useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
// import BundleForm from "./bundle-form";
import Image from "next/image";
import { useState as useFormState } from "react";
import { XMarkIcon, MinusIcon } from "@heroicons/react/24/outline";
import ImageUpload from "@/app/_components/image-upload";

// BundleForm component inline
function BundleForm({
  bundle,
  availableProducts,
  onSuccess,
  onCancel,
}: {
  bundle?: Bundle | null;
  availableProducts: Product[];
  onSuccess: (bundle: Bundle) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useFormState({
    name: bundle?.name || "",
    description: bundle?.description || "",
    price: bundle?.price || 0,
    salePrice: bundle?.salePrice || "",
    images: bundle?.images || [""],
    featured: bundle?.featured || false,
    slug: bundle?.slug || "",
  });

  const [bundleItems, setBundleItems] = useFormState<
    { productId: string; quantity: number }[]
  >(
    bundle?.items.map((item) => ({
      productId: item.product?.id || "",
      quantity: item.quantity,
    })) || [{ productId: "", quantity: 1 }],
  );

  const [loading, setLoading] = useFormState(false);
  const [errors, setErrors] = useFormState<Record<string, string>>({});

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: formData.slug || generateSlug(name),
    });
  };

  const addBundleItem = () => {
    setBundleItems([...bundleItems, { productId: "", quantity: 1 }]);
  };

  const removeBundleItem = (index: number) => {
    setBundleItems(bundleItems.filter((_, i) => i !== index));
  };

  const updateBundleItem = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updated = bundleItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setBundleItems(updated);
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, ""],
    });
  };

  const removeImageField = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const updateImageField = (index: number, value: string) => {
    const updated = formData.images.map((img, i) =>
      i === index ? value : img,
    );
    setFormData({
      ...formData,
      images: updated,
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Bundle name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    }

    const validItems = bundleItems.filter(
      (item) => item.productId && item.quantity > 0,
    );
    if (validItems.length === 0) {
      newErrors.items = "At least one product must be added to the bundle";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const validItems = bundleItems.filter(
        (item) => item.productId && item.quantity > 0,
      );
      const validImages = formData.images.filter((img) => img.trim());

      const url = bundle ? `/api/bundles/${bundle.id}` : "/api/bundles";
      const method = bundle ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          salePrice: formData.salePrice ? Number(formData.salePrice) : null,
          images: validImages,
          items: validItems,
        }),
      });

      if (response.ok) {
        const savedBundle = await response.json();
        onSuccess(savedBundle);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to save bundle");
      }
    } catch (error) {
      console.error("Error saving bundle:", error);
      alert("Error saving bundle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          {bundle ? "Edit Bundle" : "Create New Bundle"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bundle Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
              placeholder="Enter bundle name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
              placeholder="Describe the bundle"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sale Price (optional)
              </label>
              <input
                type="number"
                value={formData.salePrice}
                onChange={(e) =>
                  setFormData({ ...formData, salePrice: e.target.value })
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
              placeholder="bundle-slug"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 text-[#D5FC51] focus:ring-[#D5FC51]"
            />
            <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
              Featured bundle
            </label>
          </div>
        </div>

        {/* Bundle Items */}
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Bundle Items
            </label>
            {bundleItems.map((item, index) => (
              <div key={index} className="mb-2 flex gap-2">
                <select
                  value={item.productId}
                  onChange={(e) =>
                    updateBundleItem(index, "productId", e.target.value)
                  }
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
                >
                  <option value="">Select product</option>
                  {availableProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ${product.price}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateBundleItem(index, "quantity", Number(e.target.value))
                  }
                  className="w-20 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
                  min="1"
                  placeholder="Qty"
                />
                {bundleItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBundleItem(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addBundleItem}
              className="text-sm text-[#D5FC51] hover:text-[#D5FC51]/80"
            >
              + Add Item
            </button>
            {errors.items && (
              <p className="mt-1 text-sm text-red-600">{errors.items}</p>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="mb-4 block text-sm font-medium text-gray-700">
              Bundle Images
            </label>
            <div className="space-y-6">
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700">
                      Image {index + 1}
                    </h4>
                    {formData.images.length > 1 && (
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
                    value={image}
                    onChange={(newUrl) => updateImageField(index, newUrl)}
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
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-[#D5FC51] px-4 py-2 text-sm font-medium text-[#2A2A2A] transition-colors hover:bg-[#D5FC51]/80 disabled:opacity-50"
        >
          {loading ? "Saving..." : bundle ? "Update Bundle" : "Create Bundle"}
        </button>
      </div>
    </form>
  );
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  inventory?: number;
}

interface BundleItem {
  id: string;
  quantity: number;
  product: Product | null;
}

interface Bundle {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  images: string[];
  featured: boolean;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  items: BundleItem[];
}

interface BundlesManagementProps {
  initialBundles: Bundle[];
  availableProducts: Product[];
}

export default function BundlesManagement({
  initialBundles,
  availableProducts,
}: BundlesManagementProps) {
  const [bundles, setBundles] = useState<Bundle[]>(initialBundles);
  const [showForm, setShowForm] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddBundle = () => {
    setEditingBundle(null);
    setShowForm(true);
  };

  const handleEditBundle = (bundle: Bundle) => {
    setEditingBundle(bundle);
    setShowForm(true);
  };

  const handleDeleteBundle = async (bundleId: string) => {
    if (!confirm("Are you sure you want to delete this bundle?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/bundles/${bundleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBundles(bundles.filter((bundle) => bundle.id !== bundleId));
      } else {
        alert("Failed to delete bundle");
      }
    } catch (error) {
      console.error("Error deleting bundle:", error);
      alert("Error deleting bundle");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = (bundle: Bundle) => {
    if (editingBundle) {
      // Update existing bundle
      setBundles(bundles.map((b) => (b.id === bundle.id ? bundle : b)));
    } else {
      // Add new bundle
      setBundles([bundle, ...bundles]);
    }
    setShowForm(false);
    setEditingBundle(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingBundle(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const calculateBundleValue = (items: BundleItem[]) => {
    return items.reduce((total, item) => {
      if (item.product) {
        return total + item.product.price * item.quantity;
      }
      return total;
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Bundles ({bundles.length})
          </h2>
          <p className="text-sm text-gray-600">
            Manage product bundles and packages
          </p>
        </div>
        <button
          onClick={handleAddBundle}
          className="flex items-center gap-2 rounded-md bg-[#D5FC51] px-4 py-2 text-sm font-medium text-[#2A2A2A] transition-colors hover:bg-[#D5FC51]/80"
        >
          <PlusIcon className="h-4 w-4" />
          Create Bundle
        </button>
      </div>

      {/* Bundle Form Modal */}
      {showForm && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <BundleForm
              bundle={editingBundle}
              availableProducts={availableProducts}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}

      {/* Bundles Grid */}
      {bundles.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bundles.map((bundle) => {
            const originalValue = calculateBundleValue(bundle.items);
            const currentPrice = bundle.salePrice || bundle.price;
            const savings = originalValue - currentPrice;
            const savingsPercentage =
              originalValue > 0 ? (savings / originalValue) * 100 : 0;

            return (
              <div
                key={bundle.id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                {/* Bundle Image */}
                <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-gray-100">
                  {bundle.images && bundle.images.length > 0 ? (
                    <Image
                      src={bundle.images[0]}
                      alt={bundle.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <CubeIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  {bundle.featured && (
                    <div className="absolute top-2 left-2 rounded-full bg-[#D5FC51] px-2 py-1 text-xs font-medium text-[#2A2A2A]">
                      Featured
                    </div>
                  )}
                </div>

                {/* Bundle Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {bundle.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                    {bundle.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    {bundle.salePrice ? (
                      <>
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(bundle.salePrice)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(bundle.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(bundle.price)}
                      </span>
                    )}
                  </div>

                  {savings > 0 && (
                    <div className="mt-1 text-sm text-green-600">
                      Save {formatPrice(savings)} (
                      {Math.round(savingsPercentage)}% off)
                    </div>
                  )}
                </div>

                {/* Bundle Items */}
                <div className="mb-4">
                  <h4 className="mb-2 text-sm font-medium text-gray-700">
                    Includes ({bundle.items.length} items):
                  </h4>
                  <div className="space-y-1">
                    {bundle.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="text-sm text-gray-600">
                        {item.quantity}x{" "}
                        {item.product?.name || "Unknown Product"}
                      </div>
                    ))}
                    {bundle.items.length > 3 && (
                      <div className="text-sm text-gray-500">
                        +{bundle.items.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between">
                  <button
                    onClick={() => handleEditBundle(bundle)}
                    disabled={loading}
                    className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBundle(bundle.id)}
                    disabled={loading}
                    className="flex items-center gap-1 rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200 disabled:opacity-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No bundles</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first product bundle.
          </p>
          <div className="mt-6">
            <button
              onClick={handleAddBundle}
              className="inline-flex items-center gap-2 rounded-md bg-[#D5FC51] px-4 py-2 text-sm font-medium text-[#2A2A2A] transition-colors hover:bg-[#D5FC51]/80"
            >
              <PlusIcon className="h-4 w-4" />
              Create Bundle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
