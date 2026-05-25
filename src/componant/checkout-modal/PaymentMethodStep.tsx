"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { PaymentMethod } from "./index";

interface PaymentMethodStepProps {
  selectedMethod: PaymentMethod;
  onContinue: (method: PaymentMethod) => void;
}

export default function PaymentMethodStep({
  selectedMethod: initialMethod,
  onContinue,
}: PaymentMethodStepProps) {
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethod>(initialMethod);
  const t = useTranslations("PaymentPopup");

  const paymentMethods: { id: PaymentMethod; label: string; description: string; icon: ReactNode; color: string }[] = [
    {
      id: "installments" as PaymentMethod,
      label: t("installments"),
      description: t("installmentsDesc"),
      icon: (
        <svg
          className="w-8 h-8"
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
      ),
      color: "border-[#4ABD86] bg-[#E8F5EE]",
    },
    // {
    //   id: "fawry" as PaymentMethod,
    //   label: "Fawry",
    //   icon: (
    //     <svg
    //       className="w-8 h-8"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
    //       />
    //     </svg>
    //   ),
    //   color: "border-orange-400 bg-orange-50",
    // },
    // {
    //   id: "paymob" as PaymentMethod,
    //   label: "Paymob",
    //   icon: (
    //     <svg
    //       className="w-8 h-8"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    //       />
    //     </svg>
    //   ),
    //   color: "border-blue-400 bg-blue-50",
    // },
    {
      id: "cash" as PaymentMethod,
      label: t("cashOnline"),
      description: t("cashOnlineDesc"),
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      color: "border-orange-400 bg-orange-50",
    },
    {
      id: "cash_on_delivery" as PaymentMethod,
      label: t("cashOnDelivery"),
      description: t("cashOnDeliveryDesc"),
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
          />
        </svg>
      ),
      color: "border-yellow-400 bg-yellow-50",
    },
  ];

  return (
    <div className="p-6">
      {/* Icon */}
      <div className="flex items-center justify-center mb-4">
        <div className="w-16 h-16 rounded-full border-2 border-[#4ABD86] flex items-center justify-center">
          <svg
            className="w-8 h-8 text-[#4ABD86]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        {t("title")}
      </h2>

      {/* Payment Methods */}
      <div className="space-y-3 mb-6">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
              selectedMethod === method.id
                ? method.color + " border-2"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  selectedMethod === method.id
                    ? "border-[#4ABD86]"
                    : "border-gray-300"
                }`}
              >
                {selectedMethod === method.id && (
                  <div className="w-3 h-3 rounded-full bg-[#4ABD86]"></div>
                )}
              </div>
              <div className="text-start">
                <p className="font-medium text-gray-800">{method.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{method.description}</p>
              </div>
            </div>
            <div
              className={`${
                selectedMethod === method.id
                  ? "text-[#4ABD86]"
                  : "text-gray-400"
              }`}
            >
              {method.icon}
            </div>
          </button>
        ))}
      </div>

      {/* Continue Button */}
      <button
        onClick={() => onContinue(selectedMethod)}
        className="w-full py-3 bg-[#4ABD86] hover:bg-[#26c579] text-white font-medium rounded-lg transition duration-200"
      >
        {t("continue")}
      </button>
    </div>
  );
}
