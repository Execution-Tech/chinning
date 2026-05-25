"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import ecommerceAPI from "@/utils";

interface OrderItem {
  id: number;
  quantity: number;
  price: string;
  discount: string | null;
  total: string;
  product_id: number;
  product: {
    id: number;
    name: string;
    description: string | null;
    image_url: string;
  };
}

interface OrderAddress {
  id: number;
  full_name: string;
  phone: string;
  area: string;
  building: string;
  apartment: string;
  governorate_id: number;
}

interface OrderPaymentInstallment {
  id: number;
  installment_number: number;
  installment_amount: string;
  installment_percentage: string;
  payment_date: string;
  is_paid: number;
  paid_at: string | null;
  transaction_id: string | null;
  order_payment_id: number;
}

interface OrderPayment {
  id: number;
  total_amount: string;
  is_paid: number;
  payment_date: string | null;
  notes: string | null;
  payment_type: string;
  installment_amount: string | null;
  installment_plan_id: number | null;
  cash_amount?: string | null;
  down_payment?: string | null;
  order_payment_installments: OrderPaymentInstallment[];
}

interface OrderStore {
  id: number;
  name: string;
  description?: string | null;
  working_from?: string;
  working_to?: string;
  latitude?: string;
  longitude?: string;
}

interface Order {
  id: number;
  total: string;
  shipping: string | null;
  status: string;
  request_type: string;
  created_at: string;
  notes?: string | null;
  order_items: OrderItem[];
  order_address: OrderAddress | null;
  order_store?: OrderStore | null;
  store?: OrderStore | null;
  order_payment: OrderPayment;
}

const statusColors: Record<string, { color: string; bgColor: string }> = {
  received: { color: "text-blue-700", bgColor: "bg-blue-100" },
  ready: { color: "text-purple-700", bgColor: "bg-purple-100" },
  on_way: { color: "text-orange-700", bgColor: "bg-orange-100" },
  delivered: { color: "text-green-700", bgColor: "bg-green-100" },
  cancelled: { color: "text-red-700", bgColor: "bg-red-100" },
  return_request: { color: "text-yellow-700", bgColor: "bg-yellow-100" },
  returned: { color: "text-gray-700", bgColor: "bg-gray-100" },
};

const statusTransKey: Record<string, string> = {
  received: "received",
  ready: "ready",
  on_way: "onWay",
  delivered: "delivered",
  cancelled: "cancelled",
  return_request: "returnRequest",
  returned: "returned",
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const locale = params.locale as string;
  const t = useTranslations("Profile");
  const tStatus = useTranslations("OrderStatus");
  const tCheckout = useTranslations("Checkout");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payingInstallmentId, setPayingInstallmentId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ecommerceAPI.orders.getById(orderId);
      const data = response.data?.data;
      if (Array.isArray(data)) {
        // API returns array, find the matching order
        const found = data.find((o: any) => String(o.id) === String(orderId));
        setOrder(found || data[0] || null);
      } else if (data) {
        setOrder(data);
      }
    } catch (err) {
      console.error("Failed to fetch order:", err);
      setError(t("failedToLoad"));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === "ar" ? "ar-EG" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString();
  };

  const formatShortDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(
      locale === "ar" ? "ar-EG" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );

  const handlePayInstallment = async (installmentId: number) => {
    setPayingInstallmentId(installmentId);
    try {
      const response = await ecommerceAPI.paymobPayInstallment(installmentId);
      const paymentUrl = response.data?.data;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
    } catch (err) {
      console.error("Failed to pay installment:", err);
    } finally {
      setPayingInstallmentId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4ABD86]"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-white rounded-lg p-12 text-center">
        <svg
          className="w-16 h-16 mx-auto text-red-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="text-gray-500 mb-4">{error || t("orderNotFound")}</p>
        <button
          onClick={() => router.push(`/${locale}/profile/orders`)}
          className="text-[#4ABD86] hover:underline"
        >
          {t("backToOrders")}
        </button>
      </div>
    );
  }

  const status = statusColors[order.status] || statusColors.received;

  const orderItemsPrices = order.order_items
    .map((item) => item.price)
    .reduce((total, price) => Number(total) + Number(price), 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {t("orderNumber", { number: order.id })}
          </h2>
          <p className="text-sm text-gray-500">
            {formatDate(order.created_at)}
          </p>
        </div>
        <span
          className={`ms-auto px-4 py-2 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}
        >
          {tStatus(statusTransKey[order.status] || "received")}
        </span>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
        <h3 className="font-semibold text-gray-800 mb-4">{t("orderItems")}</h3>

        <div className="space-y-4">
          {order.order_items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={item.product.image_url || "/placeholder.png"}
                  alt={item.product.name || "Product"}
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">
                  {item.product.name || "Product"}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {t("qty")}: {item.quantity}
                </p>
                {item.discount && (
                  <p className="text-sm text-green-600 mt-1">
                    {t("discount")}: {item.discount}
                  </p>
                )}
              </div>
              <div className="text-end">
                <p className="font-semibold text-gray-800">
                  {formatPrice(item.total)} EGP
                </p>
                <p className="text-sm text-gray-500">
                  {formatPrice(item.price)} EGP/{t("qty")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
        <h3 className="font-semibold text-gray-800 mb-4">
          {t("deliveryInfo")}
        </h3>

        <div className="flex justify-between mb-3">
          <span className="text-gray-500">{t("deliveryType")}</span>
          <span className="font-medium text-gray-800">
            {order.request_type === "branch_pickup"
              ? tCheckout("storePickup")
              : tCheckout("doorstepDelivery")}
          </span>
        </div>

        {order.order_address && order.request_type !== "branch_pickup" && (
          <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
            <div className="w-10 h-10 rounded-full bg-[#E8F5EE] flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-[#4ABD86]"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-gray-800">
                {order.order_address.full_name}
              </p>
              <p className="text-sm text-gray-500">
                {order.order_address.phone}
              </p>
              <p className="text-sm text-gray-500">
                {order.order_address.building}, {t("apt")}{" "}
                {order.order_address.apartment}
              </p>
              <p className="text-sm text-gray-500">
                {order.order_address.area}
              </p>
            </div>
          </div>
        )}

        {order.request_type === "branch_pickup" &&
          (order.order_store || order.store) && (
            <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
              <div className="w-10 h-10 rounded-full bg-[#E8F5EE] flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-[#4ABD86]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-gray-800">
                  {(order.order_store || order.store)?.name}
                </p>
                {(order.order_store || order.store)?.description && (
                  <p className="text-sm text-gray-500">
                    {(order.order_store || order.store)?.description}
                  </p>
                )}
                {(order.order_store || order.store)?.working_from && (
                  <p className="text-sm text-gray-500">
                    {tCheckout("workingHours")}:{" "}
                    {(order.order_store || order.store)?.working_from} -{" "}
                    {(order.order_store || order.store)?.working_to}
                  </p>
                )}
              </div>
            </div>
          )}
      </div>

      {/* Payment Information */}
      {order.order_payment && (
        <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
          <h3 className="font-semibold text-gray-800 mb-4">
            {t("paymentInfo")}
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">{t("paymentMethod")}</span>
              <span className="font-medium text-gray-800 capitalize">
                {order.order_payment.payment_type.replace("_", " ")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">{t("paymentStatus")}</span>
              <span
                className={`font-medium ${order.order_payment.is_paid ? "text-green-600" : "text-orange-600"}`}
              >
                {order.order_payment.is_paid ? t("paid") : t("pending")}
              </span>
            </div>
            {order.order_payment.payment_date && (
              <div className="flex justify-between">
                <span className="text-gray-500">{t("paymentDate")}</span>
                <span className="font-medium text-gray-800">
                  {formatDate(order.order_payment.payment_date)}
                </span>
              </div>
            )}
            {order.order_payment.installment_amount && (
              <div className="flex justify-between">
                <span className="text-gray-500">{t("installmentAmount")}</span>
                <span className="font-medium text-gray-800">
                  {formatPrice(order.order_payment.installment_amount)} EGP
                  {t("perMonth")}
                </span>
              </div>
            )}
            {(order.order_payment.cash_amount ||
              order.order_payment.down_payment) && (
              <div className="flex justify-between">
                <span className="text-gray-500">
                  {tCheckout("downPayment")}
                </span>
                <span className="font-medium text-gray-800">
                  {formatPrice(
                    (order.order_payment.cash_amount ||
                      order.order_payment.down_payment) as string,
                  )}{" "}
                  EGP
                </span>
              </div>
            )}
            {(order.order_payment.notes || order.notes) && (
              <div className="flex justify-between">
                <span className="text-gray-500">{t("notes")}</span>
                <span className="font-medium text-gray-800">
                  {order.order_payment.notes || order.notes}
                </span>
              </div>
            )}
            {order.order_payment.total_amount && (
              <div className="flex justify-between">
                <span className="text-gray-500">{t("totalInstallment")}</span>
                <span className="font-bold text-[#4ABD86]">
                  {formatPrice(order.order_payment.total_amount)} EGP
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Installment Schedule */}
      {order.order_payment?.payment_type === "installment" &&
        order.order_payment.order_payment_installments?.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">
                {t("installmentSchedule")}
              </h3>
              <div className="flex gap-3 text-xs">
                <span className="text-green-600 font-medium">
                  {
                    order.order_payment.order_payment_installments.filter(
                      (i) => i.is_paid,
                    ).length
                  }{" "}
                  {t("paid")}
                </span>
                <span className="text-orange-600 font-medium">
                  {
                    order.order_payment.order_payment_installments.filter(
                      (i) => !i.is_paid,
                    ).length
                  }{" "}
                  {t("pending")}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {order.order_payment.order_payment_installments.map(
                (installment) => (
                  <div
                    key={installment.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      installment.is_paid
                        ? "bg-green-50 border-green-100"
                        : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    {/* Number */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        installment.is_paid
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {installment.installment_number}
                    </div>

                    {/* Date + Amount */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">
                        {formatShortDate(installment.payment_date)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {parseFloat(
                          installment.installment_amount,
                        ).toLocaleString()}{" "}
                        EGP
                      </p>
                    </div>

                    {/* Status or Pay button */}
                    {installment.is_paid ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {t("paid")}
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePayInstallment(installment.id)}
                        disabled={payingInstallmentId === installment.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4ABD86] hover:bg-[#3DAF76] text-white text-xs font-semibold rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
                      >
                        {payingInstallmentId === installment.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg
                            className="w-3.5 h-3.5"
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
                        {t("pay")}
                      </button>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        )}

      {/* Order Summary */}
      {(() => {
        const itemsSubtotal = order.order_items.reduce(
          (sum, item) => sum + (parseFloat(item.total) || 0),
          0,
        );
        const shipping = parseFloat(order.shipping || "0") || 0;
        const grandTotal =
          parseFloat(order.order_payment?.total_amount || order.total || "0") ||
          itemsSubtotal + shipping;

        const isInstallment =
          order.order_payment?.payment_type === "installment";
        const installments =
          order.order_payment?.order_payment_installments || [];
        const installmentsTotal = installments.reduce(
          (sum, i) => sum + (parseFloat(i.installment_amount) || 0),
          0,
        );
        const paidAmount = installments
          .filter((i) => i.is_paid)
          .reduce((sum, i) => sum + (parseFloat(i.installment_amount) || 0), 0);
        const downPayment =
          parseFloat(
            (order.order_payment?.cash_amount ||
              order.order_payment?.down_payment ||
              "0") as string,
          ) || 0;
        const totalToBePaid = installmentsTotal + downPayment;
        const remaining = Math.max(0, totalToBePaid - paidAmount - downPayment);

        return (
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
            <h3 className="font-semibold text-gray-800 mb-4">
              {t("orderSummary")}
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  {t("itemsCount", { count: order.order_items.length })}
                </span>
                <span className="text-gray-800">
                  {itemsSubtotal.toLocaleString()} EGP
                </span>
              </div>
              {shipping > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">{t("shipping")}</span>
                  <span className="text-gray-800">
                    {shipping.toLocaleString()} EGP
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="font-semibold text-gray-800">
                  {t("total")}
                </span>
                <span className="font-bold text-[#4ABD86] text-xl">
                  {(orderItemsPrices + shipping).toLocaleString()} EGP
                </span>
              </div>

              {isInstallment && installments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                  {/* <div className="flex justify-between">
                    <span className="text-gray-500">
                      {tCheckout("totalWithRate")}
                    </span>
                    <span className="text-gray-800">
                      {(totalToBePaid).toLocaleString()} EGP
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("paid")}</span>
                    <span className="text-green-600 font-medium">
                      {(paidAmount + downPayment).toLocaleString()} EGP
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      {tCheckout("remaining")}
                    </span>
                    <span className="text-orange-600 font-medium">
                      {remaining.toLocaleString()} EGP
                    </span>
                  </div> */}
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
