"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import PaymentMethodStep from "./PaymentMethodStep";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type PaymentMethod =
  | "fawry"
  | "paymob"
  | "cash"
  | "cash_on_delivery";
export type DeliveryType = "doorstep" | "store";

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const router = useRouter();
  const locale = useLocale();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none z-10"
          aria-label="Close modal"
        >
          ×
        </button>

        <PaymentMethodStep
          selectedMethod="cash"
          onContinue={(method: PaymentMethod) => {
            onClose();
            router.push(
              `/${locale}/checkout-forms/delivery-details?paymentMethod=${method}`,
            );
          }}
        />
      </div>
    </div>
  );
}
