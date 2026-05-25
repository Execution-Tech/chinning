"use client";

import Footer from "@/componant/footer";
import Navbar from "@/componant/nav-bar";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { getLocale } from "@/context/AuthContext";
import Link from "next/link";

const ShoppingCart = () => {
  const { isAuthenticated } = useAuth();
  const { items, total, isLoading, updateItemQuantity, removeItem } = useCart();
  const locale = getLocale();

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

  return (
    <div className="min-h-screen bg-[#F0F4FF] stripe-bg" dir="rtl">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">سلة التسوق</h1>

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
            {/* Cart Items */}
            <div className="lg:flex-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-800">المنتجات ({items.length})</h2>
                </div>
                <ul className="divide-y divide-gray-100">
                  {items.map((item: any) => (
                    <li key={item.id} className="p-5 flex gap-4">
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-contain p-1"
                          unoptimized
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{item.name}</h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <span className="font-bold text-[#1B3A6B]">
                            {(item.price * item.quantity).toLocaleString()} ج.م
                          </span>
                          <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              disabled={isLoading}
                              onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-sm font-bold"
                            >
                              -
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center text-gray-800 text-sm font-semibold border-x border-gray-200">
                              {item.quantity}
                            </span>
                            <button
                              disabled={isLoading}
                              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-sm font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-80">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="font-bold text-gray-800 mb-5">ملخص الطلب</h2>

                {/* Coupon */}
                <div className="flex gap-2 mb-5">
                  <input
                    type="text"
                    placeholder="كود الخصم"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] bg-gray-50"
                    dir="rtl"
                  />
                  <button className="bg-[#EEF4FF] text-[#1B3A6B] px-3 py-2 rounded-xl text-sm font-medium hover:bg-[#1B3A6B] hover:text-white transition-colors">
                    تطبيق
                  </button>
                </div>

                <div className="space-y-3 border-t border-gray-100 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">المجموع الفرعي</span>
                    <span className="text-gray-800 font-medium">{total.toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">الشحن</span>
                    <span className="text-green-600 font-medium">مجاني</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-3">
                    <span className="text-gray-800">الإجمالي</span>
                    <span className="text-[#1B3A6B]">{total.toLocaleString()} ج.م</span>
                  </div>
                </div>

                <Link
                  href={`/${locale}/checkout-forms`}
                  className="mt-5 block w-full text-center bg-[#1B3A6B] text-white py-3 rounded-xl font-semibold hover:bg-[#2563EB] transition-colors text-sm"
                >
                  إتمام الشراء
                </Link>
                <Link
                  href={`/${locale}/search`}
                  className="mt-3 block w-full text-center text-[#1B3A6B] text-sm hover:underline"
                >
                  متابعة التسوق
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
