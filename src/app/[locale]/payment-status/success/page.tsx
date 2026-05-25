"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || searchParams.get("orderId");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(`/${locale}/profile/orders`);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [locale, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Animated checkmark circle */}
        <div className="relative mx-auto mb-8 w-32 h-32">
          <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-30" />
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#4ABD86] to-[#3DAF76] flex items-center justify-center shadow-xl shadow-green-200">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Payment Successful!
        </h1>
        <p className="text-gray-500 text-lg mb-2">
          Your order has been confirmed and is being processed.
        </p>
        {orderId && (
          <p className="text-sm text-gray-400 mb-8">
            Order ID:{" "}
            <span className="font-semibold text-gray-600">#{orderId}</span>
          </p>
        )}

        {/* Info card */}
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-5 mb-8 text-start space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#4ABD86]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Payment confirmed</p>
              <p className="text-xs text-gray-400">Your payment was processed successfully</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#4ABD86]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Order in progress</p>
              <p className="text-xs text-gray-400">We are preparing your order now</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#4ABD86]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">You will be notified</p>
              <p className="text-xs text-gray-400">Track your order status in your profile</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Link
            href={`/${locale}/profile/orders`}
            className="flex-1 py-3 px-5 bg-[#4ABD86] hover:bg-[#3DAF76] text-white font-semibold rounded-xl transition-all shadow-md shadow-green-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            View My Orders
          </Link>
          <Link
            href={`/${locale}`}
            className="flex-1 py-3 px-5 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-[#4ABD86] hover:text-[#4ABD86] transition-all"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Countdown */}
        <p className="text-sm text-gray-400">
          Redirecting to your orders in{" "}
          <span className="font-bold text-[#4ABD86]">{countdown}s</span>
        </p>
      </div>
    </div>
  );
}
