"use client";
import Link from "next/link";
import { getLocale } from "@/context/AuthContext";

const socialLinks = [
  {
    name: "X",
    href: "#",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    name: "TikTok",
    href: "#",
    path: "M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.16 0 5.71-2.56 5.71-5.7V8.79a6.13 6.13 0 0 0 3.6 1.16V6.85s-1.97.1-3.55-1.03z",
  },
  {
    name: "Instagram",
    href: "#",
    path: "M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.51.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.058-.976.045-1.505.207-1.858.344-.466.181-.8.398-1.15.748-.35.35-.566.683-.747 1.15-.137.352-.3.882-.345 1.857-.047 1.054-.057 1.37-.057 4.041 0 2.67.01 2.986.057 4.04.045.976.208 1.505.345 1.858.181.466.397.8.747 1.15.35.35.684.566 1.15.747.353.137.882.3 1.858.345 1.054.048 1.37.058 4.04.058 2.67 0 2.987-.01 4.04-.058.976-.045 1.505-.208 1.858-.345.466-.181.8-.397 1.15-.747.35-.35.567-.684.747-1.15.138-.353.3-.882.345-1.858.048-1.054.058-1.37.058-4.04 0-2.671-.01-2.987-.058-4.04-.045-.976-.207-1.506-.345-1.858a3.097 3.097 0 0 0-.747-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.858-.344-1.053-.048-1.37-.058-4.04-.058zm0 4.595a4.603 4.603 0 1 1 0 9.206 4.603 4.603 0 0 1 0-9.206zm0 7.586a2.983 2.983 0 1 0 0-5.966 2.983 2.983 0 0 0 0 5.966zm5.86-7.762a1.075 1.075 0 1 1-2.15 0 1.075 1.075 0 0 1 2.15 0z",
  },
  {
    name: "Facebook",
    href: "#",
    path: "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z",
  },
];

const Footer = () => {
  const locale = getLocale();
  return (
    <footer className="bg-white border-t border-gray-100 mt-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#1B3A6B] flex items-center justify-center">
                <svg viewBox="0 0 36 36" fill="none" className="w-6 h-6">
                  <path d="M22 10 C16 6, 8 10, 8 18 C8 26, 16 30, 22 26" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
                  <path d="M20 18 L28 14 M20 18 L28 22" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="font-bold text-base leading-none text-[#1B3A6B]">تشينينج</div>
                <div className="text-xs text-gray-400 leading-none tracking-wide">CHINNING</div>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              جسرك الموثوق مع الصين – نسوق بأمان وثقة من أفضل المنتجات الصينية مباشرة إلى مصر
            </p>
            <div className="flex gap-3 mt-4">
              {socialLinks.map((s) => (
                <a key={s.name} href={s.href} aria-label={s.name} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-gray-600"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-sm mb-4 text-gray-800">روابط سريعة</h4>
            <ul className="space-y-2.5">
              <li><Link href={`/${locale}/profile`} className="text-gray-500 hover:text-[#1B3A6B] text-sm transition-colors">حسابي</Link></li>
              <li><Link href={`/${locale}/search`} className="text-gray-500 hover:text-[#1B3A6B] text-sm transition-colors">الفئات</Link></li>
              <li><Link href={`/${locale}/profile/orders`} className="text-gray-500 hover:text-[#1B3A6B] text-sm transition-colors">طلباتي</Link></li>
              <li><Link href={`/${locale}/search`} className="text-gray-500 hover:text-[#1B3A6B] text-sm transition-colors">العروض</Link></li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="font-bold text-sm mb-4 text-gray-800">خدمة العملاء</h4>
            <ul className="space-y-2.5">
              <li><Link href={`/${locale}/settings/contact-us`} className="text-gray-500 hover:text-[#1B3A6B] text-sm transition-colors">مركز المساعدة</Link></li>
              <li><Link href={`/${locale}/profile/orders`} className="text-gray-500 hover:text-[#1B3A6B] text-sm transition-colors">تتبع الطلب</Link></li>
              <li><Link href={`/${locale}/settings/contact-us`} className="text-gray-500 hover:text-[#1B3A6B] text-sm transition-colors">الشحن والتوصيل</Link></li>
              <li><Link href={`/${locale}/settings/contact-us`} className="text-gray-500 hover:text-[#1B3A6B] text-sm transition-colors">ضمان الجودة</Link></li>
              <li><Link href={`/${locale}/settings/contact-us`} className="text-gray-500 hover:text-[#1B3A6B] text-sm transition-colors">الإرجاع والاستبدال</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-sm mb-4 text-gray-800">الشركة</h4>
            <ul className="space-y-2.5">
              <li><Link href={`/${locale}/settings/contact-us`} className="text-gray-500 hover:text-[#1B3A6B] text-sm transition-colors">من نحن</Link></li>
              <li><Link href={`/${locale}/search`} className="text-gray-500 hover:text-[#1B3A6B] text-sm transition-colors">الجملة والاستيراد</Link></li>
              <li><Link href={`/${locale}/settings/privacy-policy`} className="text-gray-500 hover:text-[#1B3A6B] text-sm transition-colors">سياسة الخصوصية</Link></li>
              <li><Link href={`/${locale}/settings/terms-and-conditions`} className="text-gray-500 hover:text-[#1B3A6B] text-sm transition-colors">الشروط والأحكام</Link></li>
              <li><Link href={`/${locale}/settings/contact-us`} className="text-gray-500 hover:text-[#1B3A6B] text-sm transition-colors">انضم لفريقنا</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} Chinning. جميع الحقوق محفوظة.
          </p>
          <p className="text-gray-400 text-xs">
            جمهورية مصر العربية - الأسعار بالجنيه المصري (ج.م)
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
