"use client";

import { useAuth } from "@/hooks/useAuth";
import { getLocale } from "@/context/AuthContext";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CreateAccount() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register, isLoading } = useAuth();
  const locale = getLocale();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !phone || !password) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    try {
      const response = await register({ name, phone, email, password });
      if (!response.success) {
        toast.error(response.error?.message || "فشل إنشاء الحساب");
      }
    } catch {
      toast.error("فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF4FF] flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Blue header */}
        <div className="bg-gradient-to-br from-[#1B3A6B] to-[#2563EB] px-8 pt-8 pb-10 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center">
              <svg viewBox="0 0 36 36" fill="none" className="w-9 h-9">
                <path d="M22 10 C16 6, 8 10, 8 18 C8 26, 16 30, 22 26" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
                <path d="M20 18 L28 14 M20 18 L28 22" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <h1 className="text-white font-bold text-xl">تشينينج</h1>
          <p className="text-white/70 text-sm mt-1">جسرك الموثوق مع الصين</p>
        </div>

        {/* Form */}
        <div className="px-8 py-6 -mt-4 bg-white rounded-t-3xl relative">
          <h2 className="text-xl font-bold text-gray-800 mb-1">إنشاء حساب جديد</h2>
          <p className="text-gray-500 text-sm mb-6">
            لديك حساب بالفعل؟{" "}
            <Link href={`/${locale}?signIn=true`} className="text-[#2563EB] hover:underline font-medium">
              تسجيل الدخول
            </Link>
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name */}
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="w-full pr-11 pl-4 py-3 text-gray-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] focus:outline-none transition text-sm bg-gray-50"
                placeholder="الاسم الكامل"
                required
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
                </svg>
              </span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="text"
                className="w-full pr-11 pl-4 py-3 text-gray-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] focus:outline-none transition text-sm bg-gray-50"
                placeholder="رقم الهاتف"
                required
                dir="ltr"
              />
            </div>

            {/* Email (optional) */}
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full pr-11 pl-4 py-3 text-gray-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] focus:outline-none transition text-sm bg-gray-50"
                placeholder="البريد الإلكتروني (اختياري)"
                dir="ltr"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-11 pl-10 py-3 text-gray-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] focus:outline-none transition text-sm bg-gray-50"
                placeholder="كلمة المرور"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#1B3A6B] hover:bg-[#2563EB] text-white font-semibold rounded-xl transition-colors duration-200 disabled:opacity-60 text-sm"
            >
              {isLoading ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
