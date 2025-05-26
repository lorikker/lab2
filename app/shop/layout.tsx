import { CouponProvider } from "@/app/_contexts/coupon-context";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CouponProvider>
      {children}
    </CouponProvider>
  );
}
