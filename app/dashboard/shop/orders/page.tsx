import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import Breadcrumbs from "@/app/_components/dashboard/breadcrumbs";
import OrdersTable from "@/app/_components/dashboard/orders-table";

export const metadata: Metadata = {
  title: "Orders Management | SixStar Fitness",
  description: "Manage customer orders",
};

export default async function OrdersManagementPage() {
  const session = await auth();

  // Only allow admins to access this page
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch all orders with their users
  const orders = await db.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Convert Decimal to number for serialization
  const serializedOrders = orders.map((order) => ({
    ...order,
    total: Number(order.total),
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  }));

  return (
    <div className="w-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Shop Management", href: "/dashboard/shop" },
          { label: "Orders", href: "/dashboard/shop/orders", active: true },
        ]}
      />

      <div className="mt-8">
        <OrdersTable initialOrders={serializedOrders} />
      </div>
    </div>
  );
}
