"use client";
import Link from "next/link";
import { getLocale } from "@/context/AuthContext";
import { categories } from "@/data/categories";

const Footer = () => {
  const locale = getLocale();
  return (
    <footer className="bg-[#1B3A6B] text-white mt-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                <svg viewBox="0 0 36 36" fill="none" className="w-6 h-6">
                  <path d="M22 10 C16 6, 8 10, 8 18 C8 26, 16 30, 22 26" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
                  <path d="M20 18 L28 14 M20 18 L28 22" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="font-bold text-base leading-none">تشينينج</div>
                <div className="text-xs text-white/60 leading-none tracking-wide">CHINNING</div>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              جسرك الموثوق مع الصين — نوفر أفضل المنتجات بأسعار تنافسية وشحن سريع.
            </p>
            <div className="flex gap-3 mt-4">
              {["facebook", "instagram", "youtube"].map((s) => (
                <a key={s} href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <span className="text-xs">{s[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-sm mb-4 text-white/90">روابط سريعة</h4>
            <ul className="space-y-2.5">
              <li><Link href={`/${locale}`} className="text-white/60 hover:text-white text-sm transition-colors">الرئيسية</Link></li>
              <li><Link href={`/${locale}/search`} className="text-white/60 hover:text-white text-sm transition-colors">المنتجات</Link></li>
              <li><Link href={`/${locale}/search`} className="text-white/60 hover:text-white text-sm transition-colors">العروض</Link></li>
              <li><Link href={`/${locale}/shopping-carts`} className="text-white/60 hover:text-white text-sm transition-colors">سلة التسوق</Link></li>
              <li><Link href={`/${locale}/profile`} className="text-white/60 hover:text-white text-sm transition-colors">حسابي</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-sm mb-4 text-white/90">التصنيفات</h4>
            <ul className="space-y-2.5">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link href={`/${locale}/search?category_id=${c.id}`} className="text-white/60 hover:text-white text-sm transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* App & contact */}
          <div>
            <h4 className="font-bold text-sm mb-4 text-white/90">تطبيقنا</h4>
            <div className="flex flex-col gap-3 mb-6">
              <a href="#" className="flex items-center gap-2 bg-white/10 hover:bg-white/15 rounded-xl px-4 py-2.5 transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                <div className="text-xs"><div className="text-white/60 text-[10px]">تنزيل من</div><div className="font-semibold">App Store</div></div>
              </a>
              <a href="#" className="flex items-center gap-2 bg-white/10 hover:bg-white/15 rounded-xl px-4 py-2.5 transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="m3.18 23.65 9.21-9.21-2.3-2.3zm12.48-5.82 2.34-1.35c.56-.32.56-1.12 0-1.44l-2.34-1.35-2.65 2.57zM2.25.76a1.1 1.1 0 0 0-.25.76v21c0 .28.09.54.25.76l.04.04 11.76-11.76v-.08zm12.94 12.38L3.43 24.86l-.04-.04a1.1 1.1 0 0 0 .04 1.48L15 14.73z"/></svg>
                <div className="text-xs"><div className="text-white/60 text-[10px]">تنزيل من</div><div className="font-semibold">Google Play</div></div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} تشينينج. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-white/40 hover:text-white/60 text-xs transition-colors">سياسة الخصوصية</a>
            <a href="#" className="text-white/40 hover:text-white/60 text-xs transition-colors">الشروط والأحكام</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
