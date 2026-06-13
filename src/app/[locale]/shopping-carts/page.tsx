"use client";

import { useState } from "react";
import Footer from "@/componant/footer";
import Navbar from "@/componant/nav-bar";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { getLocale } from "@/context/AuthContext";
import Link from "next/link";

const ArchiveBoxIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25h.008v.008H12V8.25Z" />
  </svg>
);

const ChevronIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

const shippingMethods = [
  { id: "air", label: "شحن جوي عادي", duration: "25-30 يوم", price: 45 },
  { id: "sea", label: "شحن بحري", duration: "+40 يوم", price: 18 },
];

const ShoppingCart = () => {
  const { isAuthenticated } = useAuth();
  const { items, total, isLoading, updateItemQuantity, removeItem } = useCart();
  const locale = getLocale();
  const [shippingMethod, setShippingMethod] = useState(shippingMethods[0].id);
  const [coupon, setCoupon] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F0F4FF] stripe-bg" dir="rtl">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl border border-blue-100 p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#EEF4FF] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#1B3A6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-800 text-lg mb-2">سجّل دخولك لعرض سلة التسوق</h4>
            <p className="text-sm text-gray-500 mb-6">أنشئ حساباً أو سجّل دخولك لحفظ سلتك والدفع بشكل أسرع.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xs mx-auto">
              <Link href={`/${locale}?signIn=true`} className="flex-1 text-center bg-[#1B3A6B] text-white py-2.5 px-4 rounded-xl font-medium hover:bg-[#2563EB] transition-colors text-sm">
                تسجيل الدخول
              </Link>
              <Link href={`/${locale}/create-account`} className="flex-1 text-center border-2 border-[#1B3A6B] text-[#1B3A6B] py-2.5 px-4 rounded-xl font-medium hover:bg-[#EEF4FF] transition-colors text-sm">
                إنشاء حساب
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalQty = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const selectedShipping = shippingMethods.find((m) => m.id === shippingMethod)!;
  const grandTotal = total + selectedShipping.price;

  return (
    <div className="min-h-screen bg-[#F0F4FF] stripe-bg" dir="rtl">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href={`/${locale}`} className="hover:text-[#1B3A6B]">الرئيسية</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">سلة التسوق</span>
        </nav>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-[#EEF4FF] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-[#1B3A6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">سلتك فارغة</h2>
            <p className="text-gray-500 text-sm mb-6">ابدأ التسوق لإضافة منتجات إلى سلتك.</p>
            <Link href={`/${locale}/search`} className="inline-flex items-center bg-[#1B3A6B] text-white py-2.5 px-6 rounded-xl font-medium hover:bg-[#2563EB] transition-colors text-sm">
              تسوّق الآن
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Products */}
            <div className="lg:flex-1 space-y-4">
              {/* QC Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-center gap-2 text-amber-800">
                <InfoIcon />
                <p className="text-sm">
                  تقدر تطلب فحص جودة (QC) للمنتجات قبل الشحن – أو تستلم مباشرة بدون فحص
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-gray-800">المنتجات</h2>
                  <span className="bg-[#EEF4FF] text-[#1B3A6B] text-xs font-bold px-2.5 py-1 rounded-full">
                    {totalQty} قطعة
                  </span>
                </div>
                <ul className="divide-y divide-gray-100">
                  {items.map((item: any) => (
                    <li key={item.id} className="p-5 flex items-center gap-4">
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-contain p-1"
                          unoptimized
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-2">{item.name}</h3>
                        <span className="font-bold text-[#1B3A6B]">
                          {(item.price * item.quantity).toLocaleString()} ج.م
                        </span>
                      </div>

                      <div className="flex flex-col items-center gap-2 flex-shrink-0">
                        <div className="flex items-center gap-1.5 bg-[#F5F8FF] rounded-full p-1">
                          <button
                            disabled={isLoading}
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full bg-white text-[#1B3A6B] flex items-center justify-center font-bold text-sm shadow-sm hover:bg-[#1B3A6B] hover:text-white transition-colors"
                          >
                            +
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
                          <button
                            disabled={isLoading}
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full bg-white text-[#1B3A6B] flex items-center justify-center font-bold text-sm shadow-sm hover:bg-[#1B3A6B] hover:text-white transition-colors"
                          >
                            -
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >
                          إزالة
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Coupon */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="ادخل كود الخصم"
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] bg-gray-50"
                  dir="rtl"
                />
                <button className="bg-[#EEF4FF] text-[#1B3A6B] px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#1B3A6B] hover:text-white transition-colors">
                  تطبيق
                </button>
              </div>

              <Link
                href={`/${locale}/search`}
                className="flex items-center justify-end gap-1 text-[#1B3A6B] text-sm font-medium hover:underline px-1"
              >
                متابعه التسوق
                <ChevronIcon />
              </Link>
            </div>

            {/* Shipping & Order Summary */}
            <div className="lg:w-80 space-y-4">
              {/* Shipping Method */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h2 className="font-bold text-gray-800 mb-4">طريقة الشحن</h2>
                <div className="space-y-3">
                  {shippingMethods.map((method) => {
                    const selected = shippingMethod === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setShippingMethod(method.id)}
                        className={`border-2 rounded-xl p-3 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          selected ? "border-[#1B3A6B] bg-[#EEF4FF]" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div>
                          <p className="font-bold text-[#1B3A6B] text-sm">{method.price} ج</p>
                          <p className="font-semibold text-gray-800 text-sm mt-1">{method.label}</p>
                          <p className="text-xs text-gray-400">{method.duration}</p>
                        </div>
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                          selected ? "bg-[#1B3A6B] text-white" : "bg-[#EEF4FF] text-[#1B3A6B]"
                        }`}>
                          <ArchiveBoxIcon />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-gray-800">ملخص الطلب</h2>
                  <span className="bg-[#EEF4FF] text-[#1B3A6B] text-xs font-bold px-2.5 py-1 rounded-full">
                    {totalQty} قطعة
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">سعر المنتجات ({totalQty} قطعة)</span>
                    <span className="text-gray-800 font-medium">{total.toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">رسوم الشحن ({selectedShipping.label})</span>
                    <span className="text-gray-800 font-medium">{selectedShipping.price.toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-3">
                    <span className="text-gray-800">الإجمالي</span>
                    <span className="text-[#1B3A6B]">{grandTotal.toLocaleString()} ج.م</span>
                  </div>
                </div>

                <div className="mt-4 bg-green-50 border border-green-100 rounded-xl p-3 flex items-start gap-2 text-green-700">
                  <InfoIcon />
                  <p className="text-xs leading-relaxed">
                    السعر يشمل تكاليف الشحن الدولي والداخلي والتخليص الجمركي – لا توجد رسوم إضافية
                  </p>
                </div>

                <Link
                  href={`/${locale}/checkout-forms`}
                  className="mt-5 block w-full text-center bg-[#1B3A6B] text-white py-3 rounded-xl font-semibold hover:bg-[#2563EB] transition-colors text-sm"
                >
                  متابعة الطلب - {grandTotal.toLocaleString()} ج.م
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ShoppingCart;
