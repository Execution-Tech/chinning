"use client";

import Navbar from "@/componant/nav-bar";
import Footer from "@/componant/footer";
import { usePathname } from "next/navigation";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isDeliveryStep = pathname?.includes("/delivery-details");
  const isPaymentStep = pathname?.includes("/payment-info");
  const isOrderSummary =
    !isDeliveryStep && !isPaymentStep && pathname?.includes("/checkout-forms");

  return (
    <div className="min-h-screen bg-[#F0F4FF]" dir="rtl">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            {/* Step 1 - Delivery details */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isDeliveryStep
                    ? "bg-[#1B3A6B] text-white"
                    : isPaymentStep || isOrderSummary
                      ? "bg-green-500 text-white"
                      : "bg-white border-2 border-gray-200 text-gray-400"
                }`}
              >
                {isPaymentStep || isOrderSummary ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                ) : (
                  "🚚"
                )}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  isDeliveryStep || isPaymentStep || isOrderSummary
                    ? "text-[#1B3A6B]"
                    : "text-gray-400"
                }`}
              >
                الشحن
              </span>
            </div>

            <div
              className={`h-0.5 w-16 mx-1 ${
                isPaymentStep || isOrderSummary ? "bg-green-400" : "bg-gray-200"
              }`}
            />

            {/* Step 2 - Payment info */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isPaymentStep
                    ? "bg-[#1B3A6B] text-white"
                    : isOrderSummary
                      ? "bg-green-500 text-white"
                      : "bg-white border-2 border-gray-200 text-gray-400"
                }`}
              >
                {isOrderSummary ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                ) : (
                  "💳"
                )}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  isPaymentStep || isOrderSummary
                    ? "text-[#1B3A6B]"
                    : "text-gray-400"
                }`}
              >
                الدفع
              </span>
            </div>

            <div
              className={`h-0.5 w-16 mx-1 ${
                isOrderSummary ? "bg-green-400" : "bg-gray-200"
              }`}
            />

            {/* Step 3 - Order summary */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isOrderSummary
                    ? "bg-[#1B3A6B] text-white"
                    : "bg-white border-2 border-gray-200 text-gray-400"
                }`}
              >
                📋
              </div>
              <span
                className={`text-xs mt-1 ${
                  isOrderSummary ? "text-[#1B3A6B] font-medium" : "text-gray-400"
                }`}
              >
                المراجعة
              </span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        {children}
      </div>
      <Footer />
    </div>
  );
}
