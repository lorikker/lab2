import { notFound } from "next/navigation";
import { db } from "@/db";
import BundleDetailClient from "@/app/_components/shop/bundle-detail-client";

interface BundlePageProps {
  params: {
    slug: string;
  };
}

async function getBundle(slug: string) {
  try {
    const bundle = await db.bundle.findUnique({
      where: { slug },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                salePrice: true,
                images: true,
                slug: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!bundle) {
      return null;
    }

    // Convert Decimal to number for serialization
    return {
      ...bundle,
      price: Number(bundle.price),
      salePrice: bundle.salePrice ? Number(bundle.salePrice) : null,
      items: bundle.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          price: Number(item.product.price),
          salePrice: item.product.salePrice ? Number(item.product.salePrice) : null,
        },
      })),
    };
  } catch (error) {
    console.error("Error fetching bundle:", error);
    return null;
  }
}

export default async function BundlePage({ params }: BundlePageProps) {
  const bundle = await getBundle(params.slug);

  if (!bundle) {
    notFound();
  }

  return <BundleDetailClient bundle={bundle} />;
}

export async function generateMetadata({ params }: BundlePageProps) {
  const bundle = await getBundle(params.slug);

  if (!bundle) {
    return {
      title: "Bundle Not Found",
    };
  }

  return {
    title: `${bundle.name} - SixStar Fitness Bundle`,
    description: bundle.description,
  };
}
