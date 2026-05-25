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
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            {/* Step 1 - Delivery details */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isDeliveryStep
                    ? "bg-[#4ABD86] text-white"
                    : isPaymentStep || isOrderSummary
                      ? "bg-[#4ABD86] text-white"
                      : "border-2 border-gray-300"
                }`}
              >
                {isPaymentStep || isOrderSummary ? (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  isDeliveryStep || isPaymentStep || isOrderSummary
                    ? "text-[#4ABD86]"
                    : "text-gray-400"
                }`}
              >
                {t("deliveryDetails")}
              </span>
            </div>

            <div
              className={`w-16 h-0.5 ${isPaymentStep || isOrderSummary ? "bg-[#4ABD86]" : "bg-gray-300"} mx-1`}
            ></div>

            {/* Step 2 - Payment info */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isPaymentStep
                    ? "bg-[#4ABD86] text-white"
                    : isOrderSummary
                      ? "bg-[#4ABD86] text-white"
                      : "border-2 border-gray-300"
                }`}
              >
                {isOrderSummary ? (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  isPaymentStep || isOrderSummary
                    ? "text-[#4ABD86]"
                    : "text-gray-400"
                }`}
              >
                {t("paymentInfo")}
              </span>
            </div>

            <div
              className={`w-16 h-0.5 ${isOrderSummary ? "bg-[#4ABD86]" : "bg-gray-300"} mx-1`}
            ></div>

            {/* Step 3 - Order summary */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isOrderSummary
                    ? "bg-[#4ABD86] text-white"
                    : "border-2 border-gray-300"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <span
                className={`text-xs mt-1 ${isOrderSummary ? "text-[#4ABD86] font-medium" : "text-gray-400"}`}
              >
                {t("orderSummary")}
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
