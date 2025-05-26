"use client";

import { useState, useRef } from "react";
import { PhotoIcon, XMarkIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  placeholder?: string;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  placeholder = "Enter image URL or upload file",
  className = "",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        onChange(data.imageUrl);
      } else {
        setUploadError(data.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFileUpload(file);
    } else {
      setUploadError("Please drop an image file");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onChange("");
    if (onRemove) {
      onRemove();
    }
    setUploadError("");
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* URL Input */}
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="rounded-md border border-gray-300 p-2 text-gray-500 hover:text-red-600 hover:border-red-300"
            title="Remove image"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          dragActive
            ? "border-[#D5FC51] bg-[#D5FC51]/5"
            : "border-gray-300 hover:border-gray-400"
        } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-[#D5FC51]"></div>
            <p className="mt-2 text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <CloudArrowUpIcon className="h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              <button
                type="button"
                onClick={openFileDialog}
                className="font-medium text-[#D5FC51] hover:text-[#D5FC51]/80"
              >
                Click to upload
              </button>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP up to 5MB</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {uploadError && (
        <p className="text-sm text-red-600">{uploadError}</p>
      )}

      {/* Image Preview */}
      {value && !isUploading && (
        <div className="relative">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-gray-200">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              onError={() => setUploadError("Failed to load image")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
