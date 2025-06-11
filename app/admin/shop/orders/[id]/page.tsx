import { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import Breadcrumbs from "@/app/_components/dashboard/breadcrumbs";
import {
  ArrowLeftIcon,
  UserIcon,
  MapPinIcon,
  CreditCardIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Order Details | SixStar Fitness",
  description: "View order details",
};

interface OrderDetailsPageProps {
  params: {
    id: string;
  };
}

interface ShippingInfo {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  address: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const session = await auth();

  // Only allow admins to access this page
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch the order with all related data
  const order = await db.order.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
          bundle: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(date));
  };

  // Format address info
  const formatAddressInfo = (info: ShippingInfo) => {
    const name =
      info.name ||
      `${info.firstName || ""} ${info.lastName || ""}`.trim() ||
      "N/A";
    const cityStateZip = [info.city, info.state, info.zipCode]
      .filter(Boolean)
      .join(", ");

    return {
      name,
      email: info.email,
      address: info.address || "N/A",
      cityStateZip: cityStateZip || "N/A",
      country: info.country || "N/A",
    };
  };

  // Get status badge color and icon
  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: ClockIcon,
        };
      case "processing":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: ClockIcon,
        };
      case "completed":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: CheckCircleIcon,
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: XCircleIcon,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: ExclamationTriangleIcon,
        };
    }
  };

  // Get payment status badge color and icon
  const getPaymentStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: ClockIcon,
        };
      case "paid":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: CheckCircleIcon,
        };
      case "failed":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: XCircleIcon,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: ExclamationTriangleIcon,
        };
    }
  };

  const statusInfo = getStatusInfo(order.status);
  const paymentStatusInfo = getPaymentStatusInfo(order.paymentStatus);
  const StatusIcon = statusInfo.icon;
  const PaymentStatusIcon = paymentStatusInfo.icon;

  // Parse shipping and billing info from JSON
  const shippingInfo = order.shippingInfo as ShippingInfo | null;
  const billingInfo = order.billingInfo as ShippingInfo | null;

  // Check if billing and shipping addresses are the same
  const isSameAddress =
    shippingInfo &&
    billingInfo &&
    JSON.stringify(shippingInfo) === JSON.stringify(billingInfo);

  return (
    <div className="w-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Admin Dashboard", href: "/admin" },
          { label: "Shop Management", href: "/admin/shop" },
          { label: "Orders", href: "/admin/shop/orders" },
          {
            label: `Order #${order.orderNumber}`,
            href: `/admin/shop/orders/${order.id}`,
            active: true,
          },
        ]}
      />

      {/* Header */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/shop/orders"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Orders
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Order #{order.orderNumber}
            </h1>
            <p className="text-sm text-gray-600">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${statusInfo.color}`}
          >
            <StatusIcon className="h-4 w-4" />
            <span className="text-sm font-medium">
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <div
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${paymentStatusInfo.color}`}
          >
            <PaymentStatusIcon className="h-4 w-4" />
            <span className="text-sm font-medium">
              {order.paymentStatus.charAt(0).toUpperCase() +
                order.paymentStatus.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {item.product?.images?.[0] || item.bundle?.images?.[0] ? (
                      <img
                        src={
                          item.product?.images?.[0] || item.bundle?.images?.[0]
                        }
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-xs text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.product ? "Product" : "Bundle"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatPrice(Number(item.price))} × {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatPrice(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex justify-between text-lg font-medium text-gray-900">
                <span>Total</span>
                <span>{formatPrice(Number(order.total))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="flex items-center gap-2 text-lg font-medium text-gray-900">
                <UserIcon className="h-5 w-5" />
                Customer
              </h2>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-2">
                <p className="font-medium text-gray-900">
                  {order.user.name || "Guest"}
                </p>
                <p className="text-sm text-gray-600">{order.user.email}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="flex items-center gap-2 text-lg font-medium text-gray-900">
                <MapPinIcon className="h-5 w-5" />
                Shipping Address
              </h2>
            </div>
            <div className="px-6 py-4">
              {shippingInfo ? (
                (() => {
                  const formatted = formatAddressInfo(shippingInfo);
                  return (
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="font-medium text-gray-900">
                        {formatted.name}
                      </p>
                      {formatted.email && (
                        <p className="text-gray-500">{formatted.email}</p>
                      )}
                      <p>{formatted.address}</p>
                      <p>{formatted.cityStateZip}</p>
                      <p>{formatted.country}</p>
                    </div>
                  );
                })()
              ) : (
                <div className="text-sm text-gray-500">
                  <p>No shipping address available</p>
                </div>
              )}
            </div>
          </div>

          {/* Billing Address */}
          {billingInfo && (
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="flex items-center gap-2 text-lg font-medium text-gray-900">
                  <CreditCardIcon className="h-5 w-5" />
                  Billing Address
                  {isSameAddress && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      Same as shipping
                    </span>
                  )}
                </h2>
              </div>
              <div className="px-6 py-4">
                {isSameAddress ? (
                  <div className="text-sm text-gray-500">
                    <p>Billing address is the same as shipping address</p>
                  </div>
                ) : (
                  (() => {
                    const formatted = formatAddressInfo(billingInfo);
                    return (
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="font-medium text-gray-900">
                          {formatted.name}
                        </p>
                        {formatted.email && (
                          <p className="text-gray-500">{formatted.email}</p>
                        )}
                        <p>{formatted.address}</p>
                        <p>{formatted.cityStateZip}</p>
                        <p>{formatted.country}</p>
                      </div>
                    );
                  })()
                )}
              </div>
            </div>
          )}

          {/* Payment Information */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="flex items-center gap-2 text-lg font-medium text-gray-900">
                <CreditCardIcon className="h-5 w-5" />
                Payment
              </h2>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`font-medium ${paymentStatusInfo.color.includes("green") ? "text-green-600" : paymentStatusInfo.color.includes("red") ? "text-red-600" : "text-yellow-600"}`}
                  >
                    {order.paymentStatus.charAt(0).toUpperCase() +
                      order.paymentStatus.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(Number(order.total))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
