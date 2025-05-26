import { Metadata } from "next";
import ClientCart from "@/app/_components/shop/client-cart";

export const metadata: Metadata = {
  title: "Shopping Cart | SixStar Fitness",
  description: "View and manage your shopping cart",
};

export default function CartPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-white pt-24 font-sans">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-[#2A2A2A]">Your Cart</h1>
        <ClientCart />
      </div>
    </main>
  );
}
