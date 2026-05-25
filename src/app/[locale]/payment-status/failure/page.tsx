"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentFailurePage() {
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || searchParams.get("orderId");
  const reason = searchParams.get("reason");

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* X circle */}
        <div className="relative mx-auto mb-8 w-32 h-32">
          <div className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-20" />
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-xl shadow-red-200">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Payment Failed
        </h1>
        <p className="text-gray-500 text-lg mb-2">
          We could not process your payment. Please try again.
        </p>
        {orderId && (
          <p className="text-sm text-gray-400 mb-2">
            Order ID:{" "}
            <span className="font-semibold text-gray-600">#{orderId}</span>
          </p>
        )}
        {reason && (
          <p className="text-sm text-red-400 mb-8">
            Reason: <span className="font-medium">{reason}</span>
          </p>
        )}
        {!reason && <div className="mb-8" />}

        {/* Info card */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5 mb-8 text-start space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Payment was not completed</p>
              <p className="text-xs text-gray-400">No charges were made to your account</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">You can retry the payment</p>
              <p className="text-xs text-gray-400">Go to your orders and try paying again</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Need help?</p>
              <p className="text-xs text-gray-400">Contact our support team for assistance</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/${locale}/profile/orders`}
            className="flex-1 py-3 px-5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all shadow-md shadow-red-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            View My Orders
          </Link>
          <Link
            href={`/${locale}`}
            className="flex-1 py-3 px-5 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-red-300 hover:text-red-500 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
