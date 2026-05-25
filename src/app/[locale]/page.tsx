"use client";
import Navbar from "@/componant/nav-bar";
import dynamic from "next/dynamic";
import { getLocale } from "@/context/AuthContext";
import Link from "next/link";

const CategoriesIcons = dynamic(
  () => import("@/componant/categories-icons/categories-icons"),
  { ssr: false }
);
const CategoriesSlider = dynamic(
  () => import("@/componant/catgerories-slider"),
  { ssr: false }
);
const ItemChipsContainer = dynamic(() => import("@/componant/item-chip"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/componant/footer"), { ssr: false });

const HeroBanner = () => {
  const locale = getLocale();
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-[#1B3A6B] to-[#2563EB] text-white p-8 md:p-12 min-h-[220px] flex items-center">
      {/* Background circles decoration */}
      <div className="absolute left-0 top-0 w-64 h-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute left-20 bottom-0 w-44 h-44 rounded-full bg-white/5 translate-y-1/2 pointer-events-none" />
      <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-52 h-52">
          <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="2" fill="none" strokeDasharray="8 6" />
          <circle cx="100" cy="100" r="60" stroke="white" strokeWidth="2" fill="none" strokeDasharray="4 4" />
        </svg>
      </div>

      <div className="relative z-10 max-w-lg">
        <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 text-xs font-medium mb-4">
          🚚 شحن سريع من الصين
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
          جسرك الموثوق<br />مع الصين
        </h1>
        <p className="text-white/75 text-sm mb-6 max-w-xs">
          تسوّق أحدث المنتجات بأسعار تنافسية مع ضمان الجودة والتوصيل السريع
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/${locale}/search`}
            className="bg-white text-[#1B3A6B] font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-colors"
          >
            تسوّق الآن
          </Link>
          <Link
            href={`/${locale}/search`}
            className="border border-white/40 text-white font-medium text-sm px-6 py-2.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            اكتشف المزيد
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeatureStrip = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {[
      { icon: "🚚", title: "شحن سريع", desc: "توصيل خلال 7-14 يوم" },
      { icon: "🔒", title: "دفع آمن", desc: "حماية كاملة لبياناتك" },
      { icon: "✅", title: "ضمان الجودة", desc: "فحص قبل الشحن" },
      { icon: "↩️", title: "إرجاع سهل", desc: "خلال 30 يوم" },
    ].map((f) => (
      <div key={f.title} className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
        <span className="text-2xl">{f.icon}</span>
        <div>
          <p className="font-semibold text-gray-800 text-sm">{f.title}</p>
          <p className="text-gray-400 text-xs">{f.desc}</p>
        </div>
      </div>
    ))}
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F0F4FF] stripe-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <HeroBanner />
        <CategoriesIcons />
        <CategoriesSlider />
        <FeatureStrip />
        <ItemChipsContainer />
      </div>
      <Footer />
    </div>
  );
}
