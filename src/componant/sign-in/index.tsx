import { useAuth } from "@/hooks/useAuth";
import { getLocale } from "@/context/AuthContext";
import Link from "next/link";
import { useState } from "react";

export default function SignInModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const locale = getLocale();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await login({ phone, password });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" dir="rtl">

        {/* Blue header */}
        <div className="bg-gradient-to-br from-[#1B3A6B] to-[#2563EB] px-8 pt-8 pb-10 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-white/70 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Logo */}
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
          <h2 className="text-xl font-bold text-gray-800 mb-1">تسجيل الدخول</h2>
          <p className="text-gray-500 text-sm mb-6">
            مستخدم جديد؟{" "}
            <Link href={`/${locale}/create-account`} onClick={onClose} className="text-[#2563EB] hover:underline font-medium">
              إنشاء حساب
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-3 3h3" />
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
              />
            </div>

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
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  )}
                  {!showPassword && <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />}
                </svg>
              </button>
            </div>

            <div className="flex justify-end">
              <Link href={`/${locale}/forgot-password`} onClick={onClose} className="text-sm text-[#2563EB] hover:underline">
                نسيت كلمة المرور؟
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#1B3A6B] hover:bg-[#2563EB] text-white font-semibold rounded-xl transition-colors duration-200 disabled:opacity-60 text-sm"
            >
              {isLoading ? "جارٍ الدخول..." : "تسجيل الدخول"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
