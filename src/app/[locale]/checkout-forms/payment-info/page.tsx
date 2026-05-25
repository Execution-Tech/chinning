"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import ecommerceAPI from "@/utils";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export interface InstallmentPlan {
  id: number;
  name: string;
  description: string;
  installment_duration: number;
  installment_rate: number;
  created_at: string;
  updated_at: string;
}

export default function PaymentInfoPage() {
  const router = useRouter();
  const { locale } = useParams();
  const { total } = useCart();
  const { user } = useAuth();
  const t = useTranslations("Checkout");
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [downPayment, setDownPayment] = useState("");
  const [plans, setPlans] = useState<InstallmentPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  const userLimit = Number((user as any)?.score) || 0;
  const requiredDownPayment = Math.max(0, total - userLimit);

  // Fetch installment plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setPlansLoading(true);
        const response = await ecommerceAPI.installmentPlans.getAll();
        const data = response.data?.data || [];
        setPlans(data);
        if (data.length > 0) setSelectedPlanId(data[0].id);
      } catch (err) {
        console.error("Error fetching installment plans:", err);
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Load saved checkout data from sessionStorage
  useEffect(() => {
    const checkoutData = sessionStorage.getItem("checkoutData");
    if (checkoutData) {
      const data = JSON.parse(checkoutData);
      if (data.installmentPlanId) setSelectedPlanId(data.installmentPlanId);
      if (data.downPayment) setDownPayment(data.downPayment);
    }
  }, []);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  const remaining = total - (parseFloat(downPayment) || 0);
  const totalWithRate = selectedPlan
    ? remaining +
      remaining *
        (selectedPlan.installment_rate / 100) *
        selectedPlan.installment_duration
    : 0;
  const monthlyPayment = selectedPlan
    ? Math.ceil(totalWithRate / selectedPlan.installment_duration)
    : 0;

  const handleContinue = () => {
    const enteredDownPayment = parseFloat(downPayment) || 0;

    if (requiredDownPayment > 0 && enteredDownPayment < requiredDownPayment) {
      toast.error(
        t("downPaymentRequiredToast", {
          min: requiredDownPayment.toLocaleString(),
        }),
      );
      return;
    }

    const existingData = sessionStorage.getItem("checkoutData");
    const checkoutData = existingData ? JSON.parse(existingData) : {};

    const updatedData = {
      ...checkoutData,
      installmentPlanId: selectedPlanId,
      installmentMonths: selectedPlan?.installment_duration,
      installmentRate: selectedPlan?.installment_rate,
      monthlyPayment,
      downPayment: enteredDownPayment > 0 ? String(enteredDownPayment) : "",
    };

    sessionStorage.setItem("checkoutData", JSON.stringify(updatedData));
    router.push(`/${locale}/checkout-forms`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {t("paymentOptions")}
      </h2>

      {/* Product Total */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">{t("productTotal")}</span>
          <span className="text-xl font-bold text-gray-800">
            {total.toLocaleString()} EGP
          </span>
        </div>
      </div>

      {/* Installment Plans */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-3">
          {t("selectPlan")}
        </label>
        {plansLoading ? (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-[#4ABD86] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`py-3 px-4 rounded-lg border-2 font-medium transition-all text-center ${
                  selectedPlanId === plan.id
                    ? "border-[#4ABD86] bg-[#E8F5EE] text-[#4ABD86]"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <span className="block text-lg font-bold">
                  {plan.installment_duration}
                </span>
                <span className="block text-xs mt-0.5">{t("months")}</span>
                {/* <span className="block text-[10px] text-gray-400 mt-1">
                  {plan.installment_rate}% {t("rate")}
                </span> */}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Down Payment Input */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          {t("downPaymentLabel")}
          {requiredDownPayment === 0 && (
            <span className="ms-2 text-xs text-gray-400 font-normal">
              ({t("optional")})
            </span>
          )}
        </label>
        <input
          type="number"
          min={requiredDownPayment > 0 ? requiredDownPayment : 0}
          placeholder={
            requiredDownPayment > 0
              ? t("downPaymentPlaceholderMin", {
                  min: requiredDownPayment.toLocaleString(),
                })
              : t("downPaymentPlaceholder")
          }
          value={downPayment}
          onChange={(e) => setDownPayment(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ABD86] focus:border-transparent text-gray-800"
        />
        {requiredDownPayment > 0 ? (
          <p className="text-xs text-red-500 mt-2">
            {t("downPaymentHintRequired", {
              limit: userLimit.toLocaleString(),
              min: requiredDownPayment.toLocaleString(),
            })}
          </p>
        ) : (
          userLimit > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              {t("downPaymentHintOptional", {
                limit: userLimit.toLocaleString(),
              })}
            </p>
          )
        )}
      </div>

      {/* Installment Summary */}
      {selectedPlan && (
        <div className="bg-[#E8F5EE] rounded-lg p-4 mb-6 border-2 border-[#4ABD86]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">
                {t("monthlyInstallment")}
              </p>
              <p className="text-gray-800 font-bold text-2xl">
                {monthlyPayment.toLocaleString()}{" "}
                <span className="text-lg">EGP/mo</span>
              </p>
            </div>
            <svg
              className="w-12 h-12 text-[#4ABD86]"
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
          </div>
          <div className="mt-3 pt-3 border-t border-[#4ABD86]/20 space-y-1">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{t("productTotal")}:</span>
              <span className="font-medium">{total.toLocaleString()} EGP</span>
            </div>
            {downPayment && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>{t("downPaymentLabel")}:</span>
                <span className="font-medium">
                  -{parseFloat(downPayment).toLocaleString()} EGP
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>{t("remaining")}:</span>
              <span className="font-medium">
                {(remaining > 0 ? remaining : 0).toLocaleString()} EGP
              </span>
            </div>
            {/* <div className="flex justify-between text-sm text-gray-600">
              <span>Rate ({selectedPlan.installment_rate}%):</span>
              <span className="font-medium">
                +{Math.ceil((remaining * selectedPlan.installment_rate) / 100).toLocaleString()}{" "}
                EGP
              </span>
            </div> */}
            {/* <div className="flex justify-between text-sm text-gray-600">
              <span>{t("totalWithRate")}:</span>
              <span className="font-medium">
                {Math.ceil(totalWithRate).toLocaleString()} EGP
              </span>
            </div> */}
            <div className="flex justify-between text-sm font-bold text-[#4ABD86] pt-2 border-t border-[#4ABD86]/20">
              <span>
                {selectedPlan.installment_duration} {t("months")} x
              </span>
              <span>{monthlyPayment.toLocaleString()} EGP/mo</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleBack}
          className="flex-1 py-3 border-2 border-[#4ABD86] text-[#4ABD86] font-medium rounded-lg hover:bg-[#E8F5EE] transition duration-200"
        >
          {t("back")}
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedPlanId}
          className="flex-1 py-3 bg-[#4ABD86] hover:bg-[#26c579] text-white font-medium rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("continue")}
        </button>
      </div>
    </div>
  );
}
