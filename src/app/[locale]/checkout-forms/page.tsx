"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { getLocale } from "@/context/AuthContext";
import ecommerceAPI from "@/utils";
import { toast } from "react-toastify";
import Link from "next/link";

export default function OrderSummaryPage() {
  const router = useRouter();
  const locale = getLocale();
  const { items, total: cartTotal, clearCart } = useCart();
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [notes, setNotes] = useState("");
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [selectedStore, setSelectedStore] = useState<any>(null);

  useEffect(() => {
    ecommerceAPI.addresses
      .getShippingFees()
      .then((response: any) => {
        setDeliveryFee(response.data?.data?.shipping);
      })
      .catch((error: any) => {
        console.error("Failed to fetch shipping fees:", error);
      });
  }, []);

  useEffect(() => {
    const data = sessionStorage.getItem("checkoutData");

    if (!data) {
      router.push(`/${locale}/shopping-carts`);
      return;
    }

    const parsedData = JSON.parse(data);
    setCheckoutData(parsedData);
    setLoading(false);

    if (parsedData.selectedAddress && parsedData.deliveryType === "doorstep") {
      ecommerceAPI.addresses
        .getAll()
        .then((res: any) => {
          const list = res.data?.data || [];
          const addr = list.find(
            (a: any) => String(a.id) === String(parsedData.selectedAddress),
          );
          if (addr) setSelectedAddress(addr);
        })
        .catch(() => {});
    }

    if (parsedData.selectedStore && parsedData.deliveryType === "store") {
      ecommerceAPI.stores
        .getAll()
        .then((res: any) => {
          const list = res.data?.data || [];
          const store = list.find(
            (s: any) => String(s.id) === String(parsedData.selectedStore),
          );
          if (store) setSelectedStore(store);
        })
        .catch(() => {});
    }
  }, [router]);

  const handlePlaceOrder = async () => {
    if (!checkoutData) return;

    setPlacingOrder(true);

    try {
      let paymentType = "cash";
      if (checkoutData.paymentMethod === "installments") {
        paymentType = "installment";
      } else if (checkoutData.paymentMethod === "fawry") {
        paymentType = "fawry";
      } else if (checkoutData.paymentMethod === "paymob") {
        paymentType = "paymob";
      } else if (checkoutData.paymentMethod === "cash_on_delivery") {
        paymentType = "cash_on_delivery";
      }

      const requestType =
        checkoutData.deliveryType === "doorstep" ? "delivery" : "branch_pickup";

      const orderData: any = {
        payment_type: paymentType,
        request_type: requestType,
      };

      if (notes.trim()) {
        orderData.notes = notes;
      }

      if (requestType === "delivery" && checkoutData.selectedAddress) {
        orderData.address_id = checkoutData.selectedAddress;
      }

      if (requestType === "branch_pickup" && checkoutData.selectedStore) {
        orderData.store_id = checkoutData.selectedStore;
      }

      if (paymentType === "installment" && checkoutData.installmentPlanId) {
        orderData.installment_plan_id = checkoutData.installmentPlanId;
      }
      if (paymentType === "installment" && checkoutData.downPayment) {
        const downPaymentValue = parseFloat(checkoutData.downPayment);
        if (downPaymentValue > 0) {
          orderData.cash_amount = downPaymentValue;
        }
      }

      const response = await ecommerceAPI.orders.create({
        cash_amount: 0,
        ...orderData,
      });

      if (response.data?.status || response.data?.data) {
        const orderId = response.data?.data?.id || response.data?.data;

        if (
          paymentType === "installment" &&
          orderId &&
          response.data?.data?.payment_attempt_status === "pending"
        ) {
          const paymobResponse = await ecommerceAPI.paymobPayApplicant(orderId);
          const paymentUrl = paymobResponse.data?.data;
          if (paymentUrl) {
            sessionStorage.removeItem("checkoutData");
            clearCart();
            window.location.href = paymentUrl;
            return;
          }
        }

        if (paymentType === "cash" && orderId) {
          const paymobResponse = await ecommerceAPI.paymobPayCache(orderId);
          const paymentUrl = paymobResponse.data?.data;
          if (paymentUrl) {
            sessionStorage.removeItem("checkoutData");
            clearCart();
            window.location.href = paymentUrl;
            return;
          }
        }

        if (paymentType === "cash_on_delivery") {
          toast.success("تم تأكيد طلبك بنجاح!");
          sessionStorage.removeItem("checkoutData");
          clearCart();
          router.push(`/${locale}/profile/orders`);
          return;
        }

        toast.success("تم تأكيد طلبك بنجاح!");
        sessionStorage.removeItem("checkoutData");
        clearCart();
        router.push(`/${locale}/profile/orders`);
      } else {
        toast.error("فشل في إتمام الطلب");
      }
    } catch (error: any) {
      console.error("Error placing order:", error);
      const apiMessage = error?.data?.message;
      if (apiMessage && typeof apiMessage === "object") {
        const firstError = Object.values(apiMessage).flat()[0] as string;
        toast.error(firstError || "فشل في إتمام الطلب");
      } else {
        toast.error(apiMessage || error?.message || "فشل في إتمام الطلب");
      }
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleBack = () => {
    if (checkoutData?.paymentMethod === "installments") {
      router.push(`/${locale}/checkout-forms/payment-info`);
    } else {
      router.push(`/${locale}/checkout-forms/delivery-details`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B3A6B]"></div>
      </div>
    );
  }

  if (!checkoutData) {
    return null;
  }

  const fee = checkoutData.deliveryType === "doorstep" ? deliveryFee : 0;
  const total = (cartTotal || 0) + (fee || 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">مراجعة الطلب</h2>

      {/* Cart Items */}
      {items && items.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 text-sm mb-3">
            المنتجات ({items.length})
          </h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {(item.product?.image || item.product?.image_url) && (
                    <img
                      src={item.product?.image || item.product?.image_url}
                      alt={item.product?.name || ""}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate text-sm">
                    {item.product?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    الكمية: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-[#1B3A6B] text-sm">
                  {(item.product?.price * item.quantity).toLocaleString()} ج.م
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delivery Information */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 text-sm mb-3">
          تفاصيل التوصيل
        </h3>
        <div className="bg-[#EEF4FF] rounded-xl p-4 border border-[#1B3A6B]/20 space-y-2">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-[#1B3A6B]"
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
            <span className="font-medium text-gray-700 text-sm">طريقة التوصيل</span>
            <span className="text-gray-900 text-sm">
              {checkoutData.deliveryType === "doorstep"
                ? "توصيل للمنزل"
                : "استلام من الفرع"}
            </span>
          </div>

          {checkoutData.deliveryType === "doorstep" && (
            <>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-[#1B3A6B]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                <span className="font-medium text-gray-700 text-sm">رسوم التوصيل</span>
                <span className="text-gray-900 text-sm">
                  {(fee ?? 0).toLocaleString()} ج.م
                </span>
              </div>

              {selectedAddress && (
                <div className="mt-2 pt-2 border-t border-[#1B3A6B]/10 space-y-1">
                  <p className="font-semibold text-gray-800 text-sm">
                    {selectedAddress.full_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedAddress.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedAddress.area}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedAddress.building}، شقة {selectedAddress.apartment}
                  </p>
                </div>
              )}
            </>
          )}

          {checkoutData.deliveryType === "store" && selectedStore && (
            <div className="mt-2 pt-2 border-t border-[#1B3A6B]/10 space-y-1">
              <p className="font-semibold text-gray-800 text-sm">
                {selectedStore.name}
              </p>
              {selectedStore.description && (
                <p className="text-sm text-gray-600">
                  {selectedStore.description}
                </p>
              )}
              <p className="text-sm text-gray-600">
                مواعيد العمل: {selectedStore.working_from} -{" "}
                {selectedStore.working_to}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Information */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 text-sm mb-3">
          طريقة الدفع
        </h3>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-5 h-5 text-gray-600"
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
            <span className="font-medium text-gray-700 text-sm">الطريقة</span>
            <span className="text-gray-900 text-sm capitalize">
              {checkoutData.paymentMethod === "cash_on_delivery"
                ? "الدفع عند الاستلام"
                : checkoutData.paymentMethod === "cash"
                  ? "الدفع نقداً"
                  : checkoutData.paymentMethod === "installments"
                    ? "تقسيط"
                    : checkoutData.paymentMethod}
            </span>
          </div>
          {checkoutData.paymentMethod === "installments" && (
            <>
              {checkoutData.installmentMonths && (
                <div className="flex items-center gap-2 mb-2 text-sm">
                  <span className="font-medium text-gray-700">مدة التقسيط</span>
                  <span className="text-gray-900">
                    {checkoutData.installmentMonths} شهر
                  </span>
                </div>
              )}

              {checkoutData.monthlyPayment > 0 && (
                <div className="flex items-center gap-2 mb-2 text-sm">
                  <span className="font-medium text-gray-700">القسط الشهري:</span>
                  <span className="text-gray-900 font-semibold">
                    {Number(checkoutData.monthlyPayment).toLocaleString()} ج.م/شهر
                  </span>
                </div>
              )}

              {checkoutData.downPayment &&
                parseFloat(checkoutData.downPayment) > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-700">المقدم:</span>
                    <span className="text-gray-900">
                      {parseFloat(checkoutData.downPayment).toLocaleString()} ج.م
                    </span>
                  </div>
                )}
            </>
          )}
        </div>
      </div>

      {/* Order Notes */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 text-sm mb-3">
          ملاحظات الطلب
        </h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="أضف ملاحظات على طلبك (اختياري)"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] resize-none text-gray-800 text-sm bg-gray-50"
          rows={3}
        />
      </div>

      {/* Order Total */}
      <div className="border-t border-gray-100 pt-5 mb-6">
        <div className="space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">المجموع الفرعي</span>
            <span className="text-gray-800 font-medium">
              {(cartTotal || 0).toLocaleString()} ج.م
            </span>
          </div>
          {(fee ?? 0) > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">رسوم التوصيل</span>
              <span className="text-gray-800 font-medium">
                {(fee ?? 0).toLocaleString()} ج.م
              </span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-3">
            <span className="text-gray-800">الإجمالي</span>
            <span className="text-[#1B3A6B]">{total.toLocaleString()} ج.م</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleBack}
          disabled={placingOrder}
          className="flex-1 py-3 border-2 border-[#1B3A6B] text-[#1B3A6B] font-medium rounded-xl hover:bg-[#EEF4FF] transition-colors text-sm disabled:opacity-50"
        >
          رجوع
        </button>
        <button
          onClick={handlePlaceOrder}
          disabled={placingOrder}
          className="flex-1 py-3 bg-[#1B3A6B] hover:bg-[#2563EB] text-white font-semibold rounded-xl transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {placingOrder ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              جارٍ تأكيد الطلب...
            </>
          ) : (
            "تأكيد الطلب"
          )}
        </button>
      </div>
    </div>
  );
}
