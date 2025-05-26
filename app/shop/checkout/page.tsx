import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { fetchUserCart } from "@/app/lib/shop-data";
import CheckoutForm from "@/app/_components/shop/checkout-form";
import OrderSummary from "@/app/_components/shop/order-summary";

export const metadata: Metadata = {
  title: "Checkout | SixStar Fitness",
  description: "Complete your purchase",
};

export default async function CheckoutPage() {
  const session = await auth();
  
  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login?callbackUrl=/shop/checkout");
  }
  
  const cart = await fetchUserCart();
  
  // Redirect to cart if cart is empty
  if (!cart || cart.items.length === 0) {
    redirect("/shop/cart");
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-white pt-24 font-sans">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-[#2A2A2A]">Checkout</h1>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CheckoutForm cart={cart} />
          </div>
          <div>
            <OrderSummary cart={cart} />
          </div>
        </div>
      </div>
    </main>
  );
}
