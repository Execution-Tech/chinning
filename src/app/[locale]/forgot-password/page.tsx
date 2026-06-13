"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { toast } from "react-toastify";
import ecommerceAPI from "@/utils";

const ForgetPasswordPage = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const locale = useLocale();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) { toast.error("يرجى إدخال رقم الهاتف"); return; }
    setLoading(true);
    try {
      await ecommerceAPI.auth.forgotPassword(phone);
      router.push(`/${locale}/verification-code?phone=${encodeURIComponent(phone)}&flow=forgot-password`);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "فشل إرسال رمز التحقق");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF4FF] flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Blue header */}
        <div className="bg-gradient-to-br from-[#1B3A6B] to-[#2563EB] px-8 pt-8 pb-10 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
          </div>
          <h1 className="text-white font-bold text-xl">نسيت كلمة المرور؟</h1>
          <p className="text-white/70 text-sm mt-1">لا تقلق، سنساعدك في استعادتها</p>
        </div>

        <div className="px-8 py-6 -mt-4 bg-white rounded-t-3xl relative">
          <h2 className="text-xl font-bold text-gray-800 mb-1">إعادة تعيين كلمة المرور</h2>
          <p className="text-gray-500 text-sm mb-6">
            أدخل رقم هاتفك وسنرسل لك رمز التحقق.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
                </svg>
              </span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pr-11 pl-4 py-3 text-gray-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] focus:outline-none transition text-sm bg-gray-50"
                placeholder="رقم الهاتف"
                required
                dir="ltr"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1B3A6B] hover:bg-[#2563EB] text-white font-semibold rounded-xl transition-colors text-sm disabled:opacity-60"
            >
              {loading ? "جارٍ الإرسال..." : "إرسال رمز التحقق"}
            </button>

            <Link
              href={`/${locale}?signIn=true`}
              className="block text-center text-sm text-[#2563EB] hover:underline"
            >
              العودة لتسجيل الدخول
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
