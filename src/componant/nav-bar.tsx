"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SignInModal from "./sign-in";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { categories } from "@/data/categories";
import { getLocale } from "@/context/AuthContext";

const ChinningLogo = () => (
  <div className="flex items-center gap-2 select-none">
    <div className="w-9 h-9 rounded-full bg-[#1B3A6B] flex items-center justify-center">
      <svg viewBox="0 0 36 36" fill="none" className="w-6 h-6">
        <path d="M22 10 C16 6, 8 10, 8 18 C8 26, 16 30, 22 26" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
        <path d="M20 18 L28 14 M20 18 L28 22" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </div>
    <div className="leading-tight">
      <div className="text-[#1B3A6B] font-bold text-base leading-none">تشينينج</div>
      <div className="text-[#1B3A6B] font-bold text-xs leading-none tracking-wide">CHINNING</div>
    </div>
  </div>
);

const LocationPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

const ChevronDownIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const ReturnsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5 7.5 12M12 16.5V3" />
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);

const OrdersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375C2.754 3.75 2.25 4.254 2.25 4.875v1.5c0 .621.504 1.125 1.125 1.125Z" />
  </svg>
);

const AddressIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

const PaymentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3M3.375 19.5h17.25c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v12.75c0 .621.504 1.125 1.125 1.125Z" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H3" />
  </svg>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const signIn = searchParams.get("signIn");
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const { items } = useCart();

  const cartCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const locale = getLocale();
  const displayName = user?.name || "أحمد محمد";
  const initials = displayName
    .split(" ")
    .map((part: string) => part.charAt(0))
    .slice(0, 2)
    .join("");

  useEffect(() => {
    if (signIn === "true" && !isSignInModalOpen) {
      setIsSignInModalOpen(true);
    }
  }, []);

  const handleSearch = (e: any) => {
    e.preventDefault();
    router.push(`/${locale}/search?name=${searchQuery}`);
  };

  const toggleLocale = () => {
    const nextLocale = locale === "ar" ? "en" : "ar";
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    router.push(segments.join("/") || "/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-[#1B3A6B] text-white text-center text-sm py-2 px-4">
        🔥شحن مجاني على جميع الطلبات فوق 500 ج.م – ينتهي العرض اليوم
      </div>

      {/* Main navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Right: Logo + Location (RTL = right side) */}
            <div className="flex items-center gap-6">
              <Link href={`/${locale}`}>
                <ChinningLogo />
              </Link>

              <button
                onClick={() => router.push(`/${locale}/profile`)}
                className="hidden lg:flex items-center gap-1.5 text-gray-700 hover:text-[#1B3A6B] text-sm transition-colors max-w-[220px]"
              >
                <LocationPinIcon />
                <span className="truncate">4 شارع طلعت حرب، وسط البلد، القاهرة</span>
                <ChevronDownIcon />
              </button>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-xl hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن منتج..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-gray-800 bg-gray-50 border border-gray-200 rounded-xl py-2.5 pr-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] text-sm transition"
                  dir="rtl"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B3A6B] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Left: Actions (RTL = left side) */}
            <div className="flex items-center gap-3">
              {/* Language switcher */}
              <button
                onClick={toggleLocale}
                className="hidden md:flex items-center gap-1.5 text-gray-600 hover:text-[#1B3A6B] text-sm font-medium transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-50"
              >
                <span>{locale === "ar" ? "🇬🇧" : "🇪🇬"}</span>
                {locale === "ar" ? "En" : "Ar"}
              </button>

              {/* Cart */}
              <Link href={`/${locale}/shopping-carts`} className="relative flex items-center gap-2 p-2 text-gray-600 hover:text-[#1B3A6B] transition-colors">
                <span className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px]">
                      {cartCount}
                    </span>
                  )}
                </span>
                <span className="hidden lg:block text-sm font-medium">عربة التسوق</span>
              </Link>

              {/* Notifications */}
              <button className="relative hidden md:flex items-center gap-2 p-2 text-gray-600 hover:text-[#1B3A6B] transition-colors">
                <span className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                  </svg>
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </span>
                <span className="hidden lg:block text-sm font-medium">الإشعارات</span>
              </button>

              {/* Profile */}
              {isAuthenticated ? (
                <div className="relative hidden md:block" ref={profileDropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#1B3A6B] transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#1B3A6B] text-white flex items-center justify-center text-sm font-bold">
                      {initials}
                    </div>
                    <ChevronDownIcon className={`w-3 h-3 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-xl border border-gray-100 w-60 z-50 py-2">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-bold text-gray-800 text-sm">{displayName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">ملفي الشخصي</p>
                      </div>
                      <Link href={`/${locale}/profile/orders`} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1B3A6B]">
                        <ReturnsIcon />
                        المرتجعات
                      </Link>
                      <Link href={`/${locale}/profile/favorites`} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1B3A6B]">
                        <HeartIcon />
                        المفضلة
                      </Link>
                      <Link href={`/${locale}/profile/orders`} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1B3A6B]">
                        <OrdersIcon />
                        الطلبات
                      </Link>
                      <Link href={`/${locale}/profile`} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1B3A6B]">
                        <AddressIcon />
                        العناوين
                      </Link>
                      <Link href={`/${locale}/profile`} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1B3A6B]">
                        <PaymentIcon />
                        الدفع
                      </Link>
                      <hr className="my-1" />
                      <button onClick={() => { logout(); setIsProfileOpen(false); }} className="w-full text-right flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                        <LogoutIcon />
                        تسجيل الخروج
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsSignInModalOpen(true)}
                  className="hidden md:flex items-center gap-2 bg-[#1B3A6B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#2563EB] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                  </svg>
                  تسجيل الدخول
                </button>
              )}

              {/* Mobile menu button */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600 hover:text-[#1B3A6B]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-gray-800 bg-gray-50 border border-gray-200 rounded-xl py-2.5 pr-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 text-sm"
                dir="rtl"
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-1">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/${locale}/search?category_id=${cat.id}`} onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-[#1B3A6B] text-sm">
                  {cat.name}
                </Link>
              ))}
              <hr className="my-2" />
              {!isAuthenticated && (
                <button onClick={() => { setIsSignInModalOpen(true); setIsMenuOpen(false); }} className="block w-full text-right py-2 text-[#1B3A6B] font-medium text-sm">
                  تسجيل الدخول
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
    </>
  );
};

export default Navbar;
