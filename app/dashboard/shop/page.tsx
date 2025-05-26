import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Breadcrumbs from "@/app/_components/dashboard/breadcrumbs";
import {
  ShoppingBagIcon,
  TagIcon,
  CubeIcon,
  ReceiptRefundIcon,
  PlusIcon,
  ChartBarIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Shop Management | SixStar Fitness",
  description: "Manage your shop products, categories, orders, and more",
};

export default async function ShopManagementPage() {
  const session = await auth();

  // Only allow admins to access this page
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const managementCards = [
    {
      title: "Products",
      description: "Manage your products inventory, prices, and details",
      icon: <ShoppingBagIcon className="h-8 w-8" />,
      href: "/dashboard/shop/products",
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Categories",
      description: "Organize your products with categories",
      icon: <TagIcon className="h-8 w-8" />,
      href: "/dashboard/shop/categories",
      color: "bg-purple-50 text-purple-700",
    },
    {
      title: "Bundles",
      description: "Create and manage product bundles and kits",
      icon: <CubeIcon className="h-8 w-8" />,
      href: "/dashboard/shop/bundles",
      color: "bg-green-50 text-green-700",
    },
    {
      title: "Orders",
      description: "View and manage customer orders",
      icon: <ReceiptRefundIcon className="h-8 w-8" />,
      href: "/dashboard/shop/orders",
      color: "bg-amber-50 text-amber-700",
    },
    {
      title: "Coupons",
      description: "Create and manage discount coupons",
      icon: <TicketIcon className="h-8 w-8" />,
      href: "/dashboard/shop/coupons",
      color: "bg-pink-50 text-pink-700",
    },
    {
      title: "Reports",
      description: "View sales reports and analytics",
      icon: <ChartBarIcon className="h-8 w-8" />,
      href: "/dashboard/shop/reports",
      color: "bg-indigo-50 text-indigo-700",
    },
  ];

  return (
    <div className="w-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Shop Management", href: "/dashboard/shop", active: true },
        ]}
      />

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {managementCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className={`mb-4 rounded-full p-3 ${card.color} w-fit`}>
              {card.icon}
            </div>
            <h2 className="mb-2 text-xl font-semibold text-[#2A2A2A]">
              {card.title}
            </h2>
            <p className="text-gray-600">{card.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-[#2A2A2A]">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/dashboard/shop/products/new"
            className="inline-flex items-center rounded-md bg-[#D5FC51] px-4 py-2 text-sm font-medium text-[#2A2A2A] transition-colors hover:bg-[#D5FC51]/80"
          >
            <PlusIcon className="mr-2 h-5 w-5" />
            Add New Product
          </Link>

          <Link
            href="/dashboard/shop/categories/new"
            className="inline-flex items-center rounded-md bg-[#D5FC51] px-4 py-2 text-sm font-medium text-[#2A2A2A] transition-colors hover:bg-[#D5FC51]/80"
          >
            <PlusIcon className="mr-2 h-5 w-5" />
            Add New Category
          </Link>
        </div>
      </div>
    </div>
  );
}
