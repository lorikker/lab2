import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import BundlesManagement from "@/app/_components/dashboard/bundles-management";

export const metadata: Metadata = {
  title: "Bundles Management | SixStar Fitness",
  description: "Manage product bundles and packages",
};

async function getBundles() {
  try {
    const bundles = await db.bundle.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert Decimal to number for serialization
    return bundles.map((bundle) => ({
      ...bundle,
      price: Number(bundle.price),
      salePrice: bundle.salePrice ? Number(bundle.salePrice) : null,
      items: bundle.items.map((item) => ({
        ...item,
        product: item.product
          ? {
              ...item.product,
              price: Number(item.product.price),
            }
          : null,
      })),
    }));
  } catch (error) {
    console.error("Error fetching bundles:", error);
    return [];
  }
}

async function getProducts() {
  try {
    const products = await db.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        inventory: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Convert Decimal to number for serialization
    return products.map((product) => ({
      ...product,
      price: Number(product.price),
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function BundlesPage() {
  const session = await auth();

  // Check if user is authenticated and is an admin
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [bundles, products] = await Promise.all([getBundles(), getProducts()]);

  return (
    <main className="p-4 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Bundles Management
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Create and manage product bundles and packages
          </p>
        </div>
      </div>

      <div className="mt-8">
        <BundlesManagement
          initialBundles={bundles}
          availableProducts={products}
        />
      </div>
    </main>
  );
}
