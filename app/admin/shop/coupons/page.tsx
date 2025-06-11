import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import CouponsManagement from "@/app/_components/dashboard/coupons-management";

export const metadata: Metadata = {
  title: "Coupons Management | SixStar Fitness",
  description: "Manage discount coupons and promotional codes",
};

async function getCoupons() {
  try {
    const coupons = await db.coupon.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert Decimal to number for serialization
    return coupons.map((coupon) => ({
      ...coupon,
      discount: Number(coupon.discount),
    }));
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return [];
  }
}

export default async function CouponsPage() {
  const session = await auth();

  // Check if user is authenticated and is an admin
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const coupons = await getCoupons();

  return (
    <main className="p-4 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Coupons Management
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Create and manage discount coupons for your shop
          </p>
        </div>
      </div>

      <div className="mt-8">
        <CouponsManagement initialCoupons={coupons} />
      </div>
    </main>
  );
}
