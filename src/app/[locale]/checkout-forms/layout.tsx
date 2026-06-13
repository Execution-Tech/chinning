"use client";

import Navbar from "@/componant/nav-bar";
import Footer from "@/componant/footer";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const t = useTranslations("Checkout");

  const isDeliveryStep = pathname?.includes("/delivery-details");
  const isPaymentStep = pathname?.includes("/payment-info");
  const isOrderSummary =
    !isDeliveryStep && !isPaymentStep && pathname?.includes("/checkout-forms");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}

        {/* Page Content */}
        {children}
      </div>
      <Footer />
    </div>
  );
}
