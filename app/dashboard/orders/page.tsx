import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { formatDate } from "@/app/lib/utils";
import Breadcrumbs from "@/app/_components/dashboard/breadcrumbs";
import OrderReceiptButton from "@/app/_components/shop/order-receipt-button";

export const metadata: Metadata = {
  title: "Order History | SixStar Fitness",
  description: "View your order history and receipts",
};

export default async function OrderHistoryPage() {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login?callbackUrl=/dashboard/orders");
  }

  // Fetch user's orders
  const dbOrders = await db.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert Decimal objects to numbers
  const orders = dbOrders.map((order) => ({
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
  }));

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="w-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Order History", href: "/dashboard/orders", active: true },
        ]}
      />

      <div className="mt-6">
        <h1 className="text-2xl font-semibold text-[#2A2A2A]">Order History</h1>
        <p className="mt-2 text-sm text-gray-600">
          View your past orders and download receipts
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
          <p className="text-gray-600">You haven't placed any orders yet.</p>
          <a
            href="/shop"
            className="mt-4 inline-block rounded-md bg-[#D5FC51] px-4 py-2 font-medium text-[#2A2A2A] transition-colors hover:bg-[#D5FC51]/80"
          >
            Browse Shop
          </a>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((order) => {
            // Calculate order total
            const orderTotal = order.items.reduce((total, item) => {
              const price = item.price;
              return total + price * item.quantity;
            }, 0);

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
              >
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-medium text-[#2A2A2A]">
                        Order #{order.id.substring(0, 8)}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                        {order.status}
                      </span>
                      <OrderReceiptButton order={order} />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="flow-root">
                    <ul className="-my-5 divide-y divide-gray-200">
                      {order.items.map((item) => (
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
                    <p className="text-sm font-medium text-gray-900">
                      Order Total
                    </p>
                    <p className="text-lg font-semibold text-[#2A2A2A]">
                      {formatPrice(orderTotal)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
