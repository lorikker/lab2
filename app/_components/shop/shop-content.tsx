"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import ProductCard from "./product-card";
import ShopPagination from "./shop-pagination";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  featured: boolean;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ShopContentProps {
  searchParams?: {
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    page?: string;
  };
}

const PRODUCTS_PER_PAGE = 4;

export default function ShopContent({ searchParams }: ShopContentProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  // State for filters
  const [searchTerm, setSearchTerm] = useState(searchParams?.search || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams?.category || "",
  );
  const [minPrice, setMinPrice] = useState(searchParams?.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(searchParams?.maxPrice || "");
  const [sortBy, setSortBy] = useState(searchParams?.sortBy || "name");
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams?.page || "1"),
  );
  const [showFilters, setShowFilters] = useState(false);

  // State for data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, minPrice, maxPrice, sortBy, currentPage]);

  const fetchCategories = async () => {
    try {
      console.log("Fetching categories...");
      const response = await fetch("/api/categories");
      console.log("Categories response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Categories data:", data);
        setCategories(data);
      } else {
        console.error(
          "Failed to fetch categories:",
          response.status,
          response.statusText,
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory) params.append("category", selectedCategory);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (sortBy) params.append("sortBy", sortBy);
      params.append("page", currentPage.toString());
      params.append("limit", PRODUCTS_PER_PAGE.toString());

      const response = await fetch(`/api/products?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        setTotalProducts(data.total || 0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (selectedCategory) params.append("category", selectedCategory);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (sortBy !== "name") params.append("sortBy", sortBy);
    if (currentPage > 1) params.append("page", currentPage.toString());

    const newURL = params.toString() ? `/shop?${params.toString()}` : "/shop";
    window.history.pushState({}, "", newURL);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    updateURL();
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
    updateURL();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("name");
    setCurrentPage(1);
    window.history.pushState({}, "", "/shop");
  };

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  return (
    <section id="products" className="bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        {/* Minimalist Search and Filter Header */}
        <div className="mb-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Clean Search Bar */}
            <form onSubmit={handleSearch} className="flex max-w-lg flex-1">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-0 bg-white py-3 pr-4 pl-11 text-sm shadow-sm ring-1 ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900 focus:ring-offset-0"
                />
              </div>
            </form>

            {/* Minimal Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                  showFilters
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
                }`}
              >
                <FunnelIcon className="h-4 w-4" />
                Filter
              </button>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  handleFilterChange();
                }}
                className="border-0 bg-white py-2 pr-8 pl-3 text-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-gray-900"
              >
                <option value="name">Name</option>
                <option value="price-low">Price ↑</option>
                <option value="price-high">Price ↓</option>
                <option value="newest">Newest</option>
                <option value="featured">Featured</option>
              </select>
            </div>
          </div>

          {/* Clean Filters Panel */}
          {showFilters && (
            <div className="mt-6 bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                {/* Category Filter */}
                <div>
                  <label className="mb-3 block text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full border-0 bg-gray-50 px-3 py-2 text-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="">All</option>
                    {categories.length === 0 ? (
                      <option disabled>Loading categories...</option>
                    ) : (
                      categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                          {category.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div className="md:col-span-2">
                  <label className="mb-3 block text-xs font-medium tracking-wide text-gray-500 uppercase">
                    Price Range
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full border-0 bg-gray-50 px-3 py-2 text-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-gray-900"
                    />
                    <div className="flex items-center">
                      <div className="h-px w-4 bg-gray-300"></div>
                    </div>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full border-0 bg-gray-50 px-3 py-2 text-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <button
                    onClick={handleFilterChange}
                    className="mt-3 w-full bg-gray-900 py-2 text-xs font-medium tracking-wide text-white uppercase transition-colors hover:bg-gray-800"
                  >
                    Apply
                  </button>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full py-2 text-xs font-medium tracking-wide text-gray-600 uppercase ring-1 ring-gray-200 transition-colors hover:bg-gray-50"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Minimal Results Info */}
        <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-4">
          <p className="text-sm text-gray-500">
            {totalProducts} {totalProducts === 1 ? "product" : "products"}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
          {(searchTerm || selectedCategory || minPrice || maxPrice) && (
            <button
              onClick={clearFilters}
              className="text-xs font-medium tracking-wide text-gray-600 uppercase hover:text-gray-900"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 border-t border-gray-200 pt-8">
                <ShopPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    updateURL();
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <div className="py-20 text-center">
            <div className="mx-auto max-w-md">
              <p className="mb-4 text-gray-500">No products found</p>
              {(searchTerm || selectedCategory || minPrice || maxPrice) && (
                <button
                  onClick={clearFilters}
                  className="bg-gray-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
