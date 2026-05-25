"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import PaymentMethodStep from "./PaymentMethodStep";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type PaymentMethod =
  | "installments"
  | "fawry"
  | "paymob"
  | "cash"
  | "cash_on_delivery";
export type DeliveryType = "doorstep" | "store";

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("PaymentPopup");
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("installments");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("doorstep");
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [installmentMonths, setInstallmentMonths] = useState(6);
  const [downPayment, setDownPayment] = useState("");

  const handlePaymentMethodContinue = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setCurrentStep(2);
  };

  const { user } = useAuth();
  console.log("user", user);

  const handleDeliveryDetailsContinue = (
    type: DeliveryType,
    addressId?: string,
  ) => {
    setDeliveryType(type);
    if (addressId) setSelectedAddress(addressId);

    // If payment method is installments, go to payment options
    if (paymentMethod === "installments") {
      setCurrentStep(3);
    } else {
      // For other payment methods, go directly to checkout form
      navigateToCheckoutForm();
    }
  };

  const handlePaymentOptionsContinue = (months: number, downPay: string) => {
    setInstallmentMonths(months);
    setDownPayment(downPay);
    navigateToCheckoutForm();
  };

  const navigateToCheckoutForm = () => {
    // Store checkout data in sessionStorage for the checkout-forms pages
    sessionStorage.setItem(
      "checkoutData",
      JSON.stringify({
        paymentMethod,
        deliveryType,
        selectedAddress,
        installmentMonths,
        downPayment,
      }),
    );

    // Close modal and navigate to delivery details
    onClose();
    router.push(`/${locale}/checkout-forms/delivery-details`);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
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

        {/* Step Content */}
        {currentStep === 1 && (
          <PaymentMethodStep
            selectedMethod={paymentMethod}
            // onContinue={handlePaymentMethodContinue}
            onContinue={(method: PaymentMethod) => {
              // Cash on delivery doesn't need installment verification
              if (method === "cash_on_delivery" || method === "cash") {
                router.push(
                  `/${locale}/checkout-forms/delivery-details?paymentMethod=${method}`,
                );
                return;
              }
              if (user?.verified_installment == 2) {
                router.push(
                  `/${locale}/checkout-forms/delivery-details?paymentMethod=${method}`,
                );
                return;
              }
              toast.error(t("verifyInstallmentToast"));
            }}
          />
        )}
      </div>
    </div>
  );
}
