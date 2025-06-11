import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { db } from "@/db";
import { auth } from "@/auth";
import { formatDate } from "@/app/lib/utils";

export const metadata: Metadata = {
  title: "Order Confirmation | SixStar Fitness",
  description: "Your order has been successfully placed",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  const orderId = searchParams.orderId;
  const session = await auth();

  if (!orderId) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white pt-24 font-sans">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Order Not Found</h1>
          <p className="mt-2 text-gray-600">
            We couldn't find your order. Please check your order history.
          </p>
          <Link
            href="/dashboard/orders"
            className="mt-4 inline-block rounded-md bg-[#D5FC51] px-6 py-3 font-medium text-[#2A2A2A] transition-colors hover:bg-[#D5FC51]/80"
          >
            View Order History
          </Link>
        </div>
      </main>
    );
  }

  // Fetch the order from the database
  let order = null;
  try {
    order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    // Convert Decimal objects to numbers
    if (order) {
      const convertedOrder = {
        ...order,
        total: Number(order.total),
        items: order.items.map((item) => ({
          ...item,
          price: Number(item.price),
          product: item.product
            ? {
                ...item.product,
                price: Number(item.product.price),
                salePrice: item.product.salePrice
                  ? Number(item.product.salePrice)
                  : null,
              }
            : null,
        })),
      };
      order = convertedOrder as any;
    }
  } catch (error) {
    console.error("Error fetching order:", error);
  }

  if (!order) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white pt-24 font-sans">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Order Not Found</h1>
          <p className="mt-2 text-gray-600">
            We couldn't find your order in our system.
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-block rounded-md bg-[#D5FC51] px-6 py-3 font-medium text-[#2A2A2A] transition-colors hover:bg-[#D5FC51]/80"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Get customer info from order or user
  const customerInfo = order.user
    ? {
        name: `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim(),
        email: order.user.email,
        address: order.user.address,
        city: order.user.city,
        state: order.user.state,
        zipCode: order.user.zipCode,
        country: order.user.country,
      }
    : {};

  return (
    <main className="min-h-screen bg-white pt-24 font-sans">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircleIcon className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-[#2A2A2A] mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Number</p>
              <p className="font-mono font-semibold text-[#2A2A2A]">#{order.id.slice(-8).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Date</p>
              <p className="font-semibold text-[#2A2A2A]">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="font-semibold text-[#2A2A2A] text-lg">{formatPrice(order.total)}</p>
            </div>
          </div>
        </div>



        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#2A2A2A]">Order Summary</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800">View Receipt</button>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-xs text-gray-500">No Image</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-[#2A2A2A]">{item.product?.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#2A2A2A]">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-[#2A2A2A]">Order Total</span>
              <span className="text-lg font-bold text-[#2A2A2A]">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center">
          <Link
            href="/shop"
            className="flex items-center justify-center rounded-lg bg-[#D5FC51] px-6 py-3 text-[#2A2A2A] font-medium hover:opacity-90 transition-opacity"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-[#2A2A2A] font-medium hover:bg-gray-50 transition-colors"
          >
            Return to Home
          </Link>
        </div>

        {/* Admin Note */}
        <div className="mt-6 rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-700">
            📋 <strong>Admin Note:</strong> This order has been saved and can be viewed in the admin dashboard under Order Bills.
          </p>
        </div>
      </div>
    </main>
  );
}