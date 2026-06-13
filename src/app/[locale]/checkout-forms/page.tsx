"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { getLocale } from "@/context/AuthContext";
import { toast } from "react-toastify";
import Link from "next/link";

const steps = [
  { title: "الشحن", icon: "🚚" },
  { title: "الدفع", icon: "💳" },
  { title: "المراجعة", icon: "📋" },
];

const RadioCard = ({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <div
    onClick={onClick}
    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
      selected
        ? "border-[#1B3A6B] bg-[#EEF4FF]"
        : "border-gray-200 hover:border-gray-300"
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
          selected ? "border-[#1B3A6B] bg-[#1B3A6B]" : "border-gray-300"
        }`}
      >
        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  </div>
);

const CheckoutForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryOption, setDeliveryOption] = useState("doorstep");
  const [paymentOption, setPaymentOption] = useState<"cash" | "paymob">("cash");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const { items, total, clearCart } = useCart();
  const locale = getLocale();

  const shipping = deliveryOption === "doorstep" ? 50 : 0;
  const orderTotal = total + shipping;

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handlePlaceOrder = () => {
    if (paymentOption === "paymob") {
      toast.info("جارٍ التحويل إلى بوابة دفع Paymob...");
      return;
    }
    clearCart();
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#F0F4FF] stripe-bg" dir="rtl">
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              تم تأكيد طلبك! 🎉
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              شكراً لطلبك. سيتم التواصل معك قريباً لتأكيد الشحن.
            </p>
            <Link
              href={`/${locale}`}
              className="inline-block bg-[#1B3A6B] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#2563EB] transition-colors text-sm"
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4FF] stripe-bg" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isActive = stepNum === currentStep;
            const isDone = stepNum < currentStep;
            return (
              <div key={step.title} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      isDone
                        ? "bg-green-500 text-white"
                        : isActive
                          ? "bg-[#1B3A6B] text-white"
                          : "bg-white border-2 border-gray-200 text-gray-400"
                    }`}
                  >
                    {isDone ? "✓" : step.icon}
                  </div>
                  <span
                    className={`text-xs mt-1 font-medium ${isActive ? "text-[#1B3A6B]" : "text-gray-400"}`}
                  >
                    {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-20 mx-2 mt-[-14px] ${stepNum < currentStep ? "bg-green-400" : "bg-gray-200"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main form */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {/* Step 1 — Shipping */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    تفاصيل الشحن
                  </h2>

                  <h3 className="font-semibold text-gray-700 mb-3 text-sm">
                    طريقة التوصيل
                  </h3>
                  <div className="space-y-3 mb-6">
                    <RadioCard
                      selected={deliveryOption === "doorstep"}
                      onClick={() => setDeliveryOption("doorstep")}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            توصيل للمنزل
                          </p>
                          <p className="text-xs text-gray-500">
                            خلال 3-5 أيام عمل
                          </p>
                        </div>
                        <span className="text-sm font-bold text-[#1B3A6B]">
                          50 ج.م
                        </span>
                      </div>
                    </RadioCard>
                    <RadioCard
                      selected={deliveryOption === "pickup"}
                      onClick={() => setDeliveryOption("pickup")}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            استلام من الفرع
                          </p>
                          <p className="text-xs text-gray-500">
                            متاح خلال يوم عمل
                          </p>
                        </div>
                        <span className="text-sm font-bold text-green-600">
                          مجاني
                        </span>
                      </div>
                    </RadioCard>
                  </div>

                  <h3 className="font-semibold text-gray-700 mb-3 text-sm">
                    عنوان التوصيل
                  </h3>
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mb-6">
                    <p className="font-semibold text-gray-800 text-sm mb-1">
                      محمد أحمد
                    </p>
                    <p className="text-gray-500 text-sm">
                      123 شارع النيل، القاهرة، مصر، 11511
                    </p>
                    <p className="text-gray-500 text-sm">01012345678</p>
                  </div>

                  <button
                    onClick={nextStep}
                    className="w-full bg-[#1B3A6B] text-white py-3 rounded-xl font-semibold hover:bg-[#2563EB] transition-colors text-sm"
                  >
                    متابعة للدفع
                  </button>
                </div>
              )}

              {/* Step 2 — Payment */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    طريقة الدفع
                  </h2>

                  <div className="space-y-3 mb-8">
                    <RadioCard
                      selected={paymentOption === "cash"}
                      onClick={() => setPaymentOption("cash")}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💵</span>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            الدفع عند الاستلام
                          </p>
                          <p className="text-xs text-gray-500">
                            ادفع نقداً عند وصول طلبك
                          </p>
                        </div>
                      </div>
                    </RadioCard>
                    <RadioCard
                      selected={paymentOption === "paymob"}
                      onClick={() => setPaymentOption("paymob")}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💳</span>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            بطاقة ائتمان (Paymob)
                          </p>
                          <p className="text-xs text-gray-500">
                            Visa، MasterCard وغيرها — مؤمّن بواسطة Paymob
                          </p>
                        </div>
                      </div>
                    </RadioCard>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={prevStep}
                      className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
                    >
                      رجوع
                    </button>
                    <button
                      onClick={nextStep}
                      className="flex-1 bg-[#1B3A6B] text-white py-3 rounded-xl font-semibold hover:bg-[#2563EB] transition-colors text-sm"
                    >
                      مراجعة الطلب
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 — Summary */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    مراجعة الطلب
                  </h2>

                  <div className="space-y-4 mb-6">
                    {/* Shipping summary */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-700 text-sm mb-3">
                        تفاصيل الشحن
                      </h4>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">الطريقة</span>
                          <span className="text-gray-800 font-medium">
                            {deliveryOption === "doorstep"
                              ? "توصيل للمنزل"
                              : "استلام من الفرع"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">العنوان</span>
                          <span className="text-gray-800 font-medium">
                            123 شارع النيل، القاهرة
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment summary */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-700 text-sm mb-3">
                        طريقة الدفع
                      </h4>
                      <span className="text-sm font-medium text-gray-800">
                        {paymentOption === "cash"
                          ? "💵 الدفع عند الاستلام"
                          : "💳 بطاقة ائتمان (Paymob)"}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-700 text-sm mb-3">
                        المنتجات ({items.length})
                      </h4>
                      {items.length === 0 && (
                        <p className="text-sm text-gray-500">
                          لا توجد منتجات.{" "}
                          <Link
                            href={`/${locale}/search`}
                            className="text-[#2563EB] underline"
                          >
                            تسوّق الآن
                          </Link>
                        </p>
                      )}
                      <div className="space-y-2">
                        {items.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-gray-700 line-clamp-1 flex-1 ml-2">
                              {item.name} × {item.quantity}
                            </span>
                            <span className="font-semibold text-gray-800 flex-shrink-0">
                              {(item.price * item.quantity).toLocaleString()}{" "}
                              ج.م
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={prevStep}
                      className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
                    >
                      رجوع
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="flex-1 bg-[#1B3A6B] text-white py-3 rounded-xl font-semibold hover:bg-[#2563EB] transition-colors text-sm"
                    >
                      {paymentOption === "cash"
                        ? "تأكيد الطلب"
                        : "الدفع عبر Paymob"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order summary sidebar */}
          <div className="lg:w-72">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4">ملخص الطلب</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">المجموع الفرعي</span>
                  <span className="font-medium text-gray-800">
                    {total.toLocaleString()} ج.م
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">الشحن</span>
                  <span
                    className={`font-medium ${shipping === 0 ? "text-green-600" : "text-gray-800"}`}
                  >
                    {shipping === 0 ? "مجاني" : `${shipping} ج.م`}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-base">
                  <span className="text-gray-800">الإجمالي</span>
                  <span className="text-[#1B3A6B]">
                    {orderTotal.toLocaleString()} ج.م
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
