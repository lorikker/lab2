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

  console.log("Success page - orderId:", orderId);
  console.log("Success page - session:", session?.user?.id);

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
    console.log("Fetching order with ID:", orderId);
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
    console.log("Found order:", order ? "Yes" : "No");

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-white pt-24 font-sans">
      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />

          <h1 className="mt-4 text-3xl font-bold text-[#2A2A2A]">
            Order Confirmed!
          </h1>

          <p className="mt-2 text-gray-600">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>

          <div className="mt-6 rounded-md bg-gray-50 p-4">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-lg font-medium text-[#2A2A2A]">
              #{order.id.substring(0, 8)}
            </p>
          </div>

          <div className="mt-4 rounded-md bg-blue-50 p-4">
            <p className="text-sm text-blue-600">Order Date</p>
            <p className="text-lg font-medium text-blue-800">
              {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="mt-4 rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-600">Total Amount</p>
            <p className="text-lg font-medium text-green-800">
              {formatPrice(order.total)}
            </p>
          </div>

          <p className="mt-6 text-gray-600">
            We've sent a confirmation email with your order details.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="rounded-md bg-[#D5FC51] px-6 py-3 font-medium text-[#2A2A2A] transition-colors hover:bg-[#D5FC51]/80"
            >
              Continue Shopping
            </Link>

            <Link
              href="/dashboard/orders"
              className="rounded-md border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              View All Orders
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#2A2A2A]">
                  Order Summary
                </h2>
                <OrderReceiptButton order={order} />
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {order.items.map((item: any) => (
                    <li key={item.id} className="py-5">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 rounded-md border border-gray-200 bg-gray-100 p-2">
                          {item.product?.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="h-16 w-16 object-contain"
                            />
                          ) : (
                            <div className="flex h-16 w-16 items-center justify-center">
                              <span className="text-xs text-gray-400">
                                No image
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {item.product?.name ||
                              "Product no longer available"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex justify-between">
                <p className="text-sm font-medium text-gray-900">Order Total</p>
                <p className="text-lg font-semibold text-[#2A2A2A]">
                  {formatPrice(order.total)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// OrderReceiptButton component
function OrderReceiptButton({ order: _order }: { order: any }) {
  return (
    <Link
      href={`/dashboard/orders`}
      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
    >
      View Receipt
    </Link>
  );
}
