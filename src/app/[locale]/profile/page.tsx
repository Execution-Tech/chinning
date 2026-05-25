"use client";
import { useState } from "react";
import Navbar from "@/componant/nav-bar";
import Footer from "@/componant/footer";
import { useAuth } from "@/context/AuthContext";
import { getLocale } from "@/context/AuthContext";
import Link from "next/link";

const mockOrders = [
  { id: "ORD-1042", date: "2025-05-20", total: 12000, status: "مُسلَّم", items: 1 },
  { id: "ORD-1031", date: "2025-05-10", total: 8500,  status: "قيد الشحن", items: 2 },
  { id: "ORD-1018", date: "2025-04-28", total: 55000, status: "مُسلَّم", items: 1 },
];

const statusColor: Record<string, string> = {
  "مُسلَّم":     "bg-green-100 text-green-700",
  "قيد الشحن":  "bg-blue-100 text-blue-700",
  "قيد المعالجة": "bg-yellow-100 text-yellow-700",
  "ملغي":        "bg-red-100 text-red-600",
};

type Tab = "info" | "orders";

export default function ProfilePage() {
  const { isAuthenticated, user, logout } = useAuth();
  const locale = getLocale();
  const [tab, setTab] = useState<Tab>("info");
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F0F4FF] stripe-bg" dir="rtl">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl border border-blue-100 p-12 shadow-sm max-w-md mx-auto">
            <div className="w-20 h-20 bg-[#EEF4FF] rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-[#1B3A6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.786 0-5.433-.608-7.499-1.632Z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">سجّل دخولك أولاً</h2>
            <p className="text-gray-500 text-sm mb-6">يجب تسجيل الدخول لعرض ملفك الشخصي.</p>
            <div className="flex gap-3 justify-center">
              <Link href={`/${locale}?signIn=true`} className="bg-[#1B3A6B] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#2563EB] transition-colors">
                تسجيل الدخول
              </Link>
              <Link href={`/${locale}/create-account`} className="border-2 border-[#1B3A6B] text-[#1B3A6B] px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#EEF4FF] transition-colors">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header card */}
        <div className="bg-gradient-to-l from-[#1B3A6B] to-[#2563EB] rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
            {(user?.name || "U").charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-right flex-1">
            <h1 className="text-xl font-bold text-white">{user?.name || "مستخدم"}</h1>
            <p className="text-white/70 text-sm mt-0.5">{user?.email || ""}</p>
            <p className="text-white/70 text-sm">{user?.phone || ""}</p>
          </div>
          <button
            onClick={() => { logout(); }}
            className="self-start sm:self-center flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm px-4 py-2 rounded-xl transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            تسجيل الخروج
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-2xl overflow-hidden">
          {([["info", "معلوماتي"], ["orders", "طلباتي"]] as [Tab, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                tab === key
                  ? "text-[#1B3A6B] border-b-2 border-[#1B3A6B] bg-[#EEF4FF]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Personal info tab */}
        {tab === "info" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-gray-800 text-lg">المعلومات الشخصية</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="text-sm text-[#2563EB] hover:underline font-medium"
              >
                {editing ? "إلغاء" : "تعديل"}
              </button>
            </div>

            {editing ? (
              <form
                onSubmit={(e) => { e.preventDefault(); setEditing(false); }}
                className="space-y-4"
              >
                {[
                  { label: "الاسم الكامل", value: name, setter: setName, type: "text", dir: "rtl" },
                  { label: "رقم الهاتف", value: phone, setter: setPhone, type: "text", dir: "ltr" },
                  { label: "البريد الإلكتروني", value: email, setter: setEmail, type: "email", dir: "ltr" },
                ].map(({ label, value, setter, type, dir }) => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <input
                      type={type}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      dir={dir}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] bg-gray-50"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="w-full bg-[#1B3A6B] text-white py-3 rounded-xl font-semibold hover:bg-[#2563EB] transition-colors text-sm"
                >
                  حفظ التغييرات
                </button>
              </form>
            ) : (
              <div className="divide-y divide-gray-100">
                {[
                  { label: "الاسم الكامل", value: name || user?.name || "—" },
                  { label: "رقم الهاتف", value: phone || user?.phone || "—" },
                  { label: "البريد الإلكتروني", value: email || user?.email || "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-4">
                    <span className="text-gray-500 text-sm">{label}</span>
                    <span className="font-medium text-gray-800 text-sm">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders tab */}
        {tab === "orders" && (
          <div className="space-y-4">
            {mockOrders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-gray-400 text-sm">لا توجد طلبات بعد.</p>
                <Link href={`/${locale}/search`} className="mt-4 inline-block text-[#2563EB] text-sm hover:underline">
                  ابدأ التسوق
                </Link>
              </div>
            ) : (
              mockOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{order.id}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{order.date} · {order.items} منتج</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-[#1B3A6B] font-bold text-sm">{order.total.toLocaleString()} ج.م</span>
                    <Link
                      href={`/${locale}/shopping-carts`}
                      className="text-xs text-[#2563EB] hover:underline font-medium"
                    >
                      عرض التفاصيل
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
