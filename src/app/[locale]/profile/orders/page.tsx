"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import ecommerceAPI from "@/utils";

type OrderStatus =
  | "received"
  | "ready"
  | "on_way"
  | "delivered"
  | "cancelled"
  | "return_request"
  | "returned";

interface Order {
  id: string;
  total: number;
  status: OrderStatus;
  requestType: string;
  image: string;
  createdAt: string;
}

const statusConfig: Record<
  OrderStatus,
  { color: string; bgColor: string; border: string }
> = {
  received: {
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    border: "border-blue-200",
  },
  ready: {
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    border: "border-purple-200",
  },
  on_way: {
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    border: "border-orange-200",
  },
  delivered: {
    color: "text-green-700",
    bgColor: "bg-green-50",
    border: "border-green-200",
  },
  cancelled: {
    color: "text-red-700",
    bgColor: "bg-red-50",
    border: "border-red-200",
  },
  return_request: {
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
    border: "border-yellow-200",
  },
  returned: {
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    border: "border-gray-200",
  },
};

const statusTransKey: Record<OrderStatus, string> = {
  received: "received",
  ready: "ready",
  on_way: "onWay",
  delivered: "delivered",
  cancelled: "cancelled",
  return_request: "returnRequest",
  returned: "returned",
};

const RequestTypeIcon = ({ type }: { type: string }) => {
  if (type === "branch_pickup") {
    return (
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
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    );
  }
  return (
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
        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
      />
    </svg>
  );
};

const OrderCard = ({
  order,
  onViewOrder,
  onCancelOrder,
  onReturnOrder,
  t,
  tStatus,
  locale,
}: {
  order: Order;
  onViewOrder: (orderId: string) => void;
  onCancelOrder?: (orderId: string) => void;
  onReturnOrder?: (orderId: string) => void;
  t: (key: string, values?: any) => string;
  tStatus: (key: string) => string;
  locale: string;
}) => {
  const status = statusConfig[order.status] || statusConfig.received;
  const canCancel = ["received", "ready"].includes(order.status);
  const canReturn = order.status === "delivered";

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(
      locale === "ar" ? "ar-EG" : "en-US",
      { year: "numeric", month: "short", day: "numeric" },
    );

  const requestTypeLabel =
    order.requestType === "branch_pickup"
      ? t("storePickup")
      : t("doorstepDelivery");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
      {/* Main content row */}
      <div className="flex gap-4 p-4">
        {/* Product Image */}
        <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
          <Image
            src={order.image || "/placeholder.png"}
            alt={`Order #${order.id}`}
            width={96}
            height={96}
            className="w-full h-full object-contain p-1"
            unoptimized
          />
        </div>

        {/* Order Info */}
        <div className="flex-1 min-w-0">
          {/* Top row: order number + status */}
          <div className="flex items-start justify-between gap-2">
            <p className="font-bold text-gray-800 text-sm">
              {t("ordersLabel")}{" "}
              <span className="text-[#4ABD86]">#{order.id}</span>
            </p>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex-shrink-0
                ${status.bgColor} ${status.color} ${status.border}`}
            >
              {tStatus(statusTransKey[order.status])}
            </span>
          </div>

          {/* Date */}
          <p className="text-xs text-gray-400 mt-1">
            {formatDate(order.createdAt)}
          </p>

          {/* Request type */}
          <div
            className={`inline-flex items-center gap-1.5 mt-2 px-2 py-1 rounded-lg text-xs font-medium
            ${
              order.requestType === "branch_pickup"
                ? "bg-purple-50 text-purple-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            <RequestTypeIcon type={order.requestType} />
            {requestTypeLabel}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-400">{t("total")}</span>
            <span className="font-bold text-gray-800 text-base">
              {order.total.toLocaleString()}{" "}
              <span className="text-xs font-normal text-gray-400">EGP</span>
            </span>
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="flex items-center border-t border-gray-100">
        <button
          onClick={() => onViewOrder(order.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-[#4ABD86] hover:bg-green-50 transition"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          {t("viewOrder")}
        </button>

        {canCancel && onCancelOrder && (
          <>
            <div className="w-px h-6 bg-gray-200" />
            <button
              onClick={() => onCancelOrder(order.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              {t("cancelOrder")}
            </button>
          </>
        )}

        {canReturn && onReturnOrder && (
          <>
            <div className="w-px h-6 bg-gray-200" />
            <button
              onClick={() => onReturnOrder(order.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-orange-500 hover:bg-orange-50 transition"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
              {t("returnOrder")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default function OrdersPage() {
  const router = useRouter();
  const t = useTranslations("Profile");
  const tCheckout = useTranslations("Checkout");
  const tStatus = useTranslations("OrderStatus");
  const locale = useLocale();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [returnConfirmId, setReturnConfirmId] = useState<string | null>(null);
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ecommerceAPI.orders.getAll();
      if (response.data?.data) {
        setOrders(
          response.data.data
            .slice()
            .sort(
              (a: any, b: any) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            )
            .map((order: any) => ({
              id: String(order.id),
              total: parseFloat(order.total) || 0,
              status: order.status || "received",
              requestType: order.request_type || "delivery",
              image: order.image || "/placeholder.png",
              createdAt: order.created_at,
            })),
        );
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([
        {
          id: "78",
          total: 60094,
          status: "received",
          requestType: "branch_pickup",
          image: "/placeholder.png",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (orderId: string) => {
    router.push(`/${locale}/profile/orders/${orderId}`);
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await ecommerceAPI.orders.cancel(orderId);
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const handleReturnOrder = (orderId: string) => {
    setReturnConfirmId(orderId);
  };

  const confirmReturn = async () => {
    if (!returnConfirmId) return;
    setReturning(true);
    try {
      await ecommerceAPI.orders.return(returnConfirmId);
      setReturnConfirmId(null);
      fetchOrders();
    } catch (error) {
      console.error("Error returning order:", error);
    } finally {
      setReturning(false);
    }
  };

  // pass tCheckout keys into t-compatible shape via a wrapper
  const tCombined = (key: string, values?: any) => {
    if (key === "storePickup") return tCheckout("storePickup");
    if (key === "doorstepDelivery") return tCheckout("doorstepDelivery");
    return t(key, values);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">{t("myOrders")}</h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4ABD86]" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
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
          <p className="text-gray-500">{t("noOrders")}</p>
        </div>
      ) : (
        orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onViewOrder={handleViewOrder}
            onCancelOrder={handleCancelOrder}
            onReturnOrder={handleReturnOrder}
            t={tCombined}
            tStatus={tStatus}
            locale={locale}
          />
        ))
      )}

      {/* Return confirmation modal */}
      {returnConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 mx-auto mb-4">
              <svg
                className="w-6 h-6 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
            </div>
            <h3 className="text-center font-bold text-gray-800 text-lg mb-1">
              {t("returnOrder")}
            </h3>
            <p className="text-center text-gray-500 text-sm mb-6">
              {t("returnOrderConfirm")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setReturnConfirmId(null)}
                disabled={returning}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
              >
                {t("cancel")}
              </button>
              <button
                onClick={confirmReturn}
                disabled={returning}
                className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {returning && (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {t("returnOrder")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
