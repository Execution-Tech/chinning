"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getLocale } from "@/context/AuthContext";
import Link from "next/link";
import { toast } from "react-toastify";

function OtpInput({
  length = 4,
  onComplete,
  autoFocus = true,
}: {
  length?: number;
  onComplete?: (code: string) => void;
  autoFocus?: boolean;
}) {
  const [values, setValues] = useState(Array.from({ length }, () => ""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!autoFocus) return;
    inputsRef.current?.[0]?.focus();
  }, [autoFocus]);

  const code = useMemo(() => values.join(""), [values]);

  useEffect(() => {
    if (onComplete && values.every((v) => v !== "")) {
      onComplete(code);
    }
  }, [code, onComplete, values]);

  const isDigit = (ch: string) => /\d/.test(ch);

  const handleChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const lastChar = raw.slice(-1);
    if (lastChar && !isDigit(lastChar)) return;
    setValues((prev) => { const next = [...prev]; next[idx] = lastChar || ""; return next; });
    if (lastChar && idx < length - 1) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (values[idx]) {
        setValues((prev) => { const next = [...prev]; next[idx] = ""; return next; });
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
        setValues((prev) => { const next = [...prev]; next[idx - 1] = ""; return next; });
      }
    }
    if (e.key === "ArrowLeft" && idx > 0) { e.preventDefault(); inputsRef.current[idx - 1]?.focus(); }
    if (e.key === "ArrowRight" && idx < length - 1) { e.preventDefault(); inputsRef.current[idx + 1]?.focus(); }
  };

  const handlePaste = (idx: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!digits) return;
    e.preventDefault();
    setValues((prev) => {
      const next = [...prev];
      for (let i = 0; i < digits.length; i++) {
        const pos = idx + i;
        if (pos < length) next[pos] = digits[i];
      }
      return next;
    });
    inputsRef.current[Math.min(idx + digits.length, length - 1)]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-3" dir="ltr">
      {values.map((val, idx) => (
        <input
          key={idx}
          ref={(el) => { inputsRef.current[idx] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={val}
          onChange={(e) => handleChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={(e) => handlePaste(idx, e)}
          className="w-14 h-14 text-center text-xl font-bold tracking-widest border-2 rounded-xl outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] border-gray-200 bg-white text-gray-800 transition-all"
        />
      ))}
    </div>
  );
}

const VerificationCodePage = () => {
  const locale = getLocale();
  const [verified, setVerified] = useState(false);

  const handleComplete = (code: string) => {
    if (code === "1234") {
      setVerified(true);
      toast.success("تم التحقق بنجاح!");
    } else {
      toast.error("رمز التحقق غير صحيح");
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-3 3h3" />
              </svg>
            </div>
          </div>
          <h1 className="text-white font-bold text-xl">رمز التحقق</h1>
          <p className="text-white/70 text-sm mt-1">أدخل الرمز المرسل إلى هاتفك</p>
        </div>

        <div className="px-8 py-6 -mt-4 bg-white rounded-t-3xl relative">
          {verified ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">تم التحقق بنجاح!</h3>
              <p className="text-gray-500 text-sm mb-6">يمكنك الآن تسجيل الدخول إلى حسابك.</p>
              <Link
                href={`/${locale}?signIn=true`}
                className="block w-full text-center bg-[#1B3A6B] text-white py-3 rounded-xl font-semibold hover:bg-[#2563EB] transition-colors text-sm"
              >
                تسجيل الدخول
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-1">أدخل رمز التحقق</h2>
              <p className="text-gray-500 text-sm mb-6">
                أرسلنا رمزاً مكوناً من 4 أرقام إلى هاتفك.
              </p>

              <div className="mb-8">
                <OtpInput length={4} onComplete={handleComplete} />
              </div>

              <div className="text-center">
                <p className="text-gray-500 text-sm mb-2">لم تستلم الرمز؟</p>
                <button
                  className="text-[#2563EB] text-sm font-medium hover:underline"
                  onClick={() => toast.info("تم إعادة إرسال الرمز")}
                >
                  إعادة الإرسال
                </button>
              </div>

              <Link
                href={`/${locale}`}
                className="mt-6 block text-center text-sm text-gray-400 hover:text-gray-600"
              >
                العودة للرئيسية
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationCodePage;
