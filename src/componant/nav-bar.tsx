"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const signIn = searchParams.get("signIn");
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const { items } = useCart();

  const cartCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const locale = getLocale();

  useEffect(() => {
    if (signIn === "true" && !isSignInModalOpen) {
      setIsSignInModalOpen(true);
    }
  }, []);

  const handleSearch = (e: any) => {
    e.preventDefault();
    router.push(`/${locale}/search?name=${searchQuery}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
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
        🔥 عروض حصرية على أحدث المنتجات — شحن مجاني للطلبات فوق 500 جنيه
      </div>

      {/* Main navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Right: Logo + Categories (RTL = right side) */}
            <div className="flex items-center gap-6">
              <Link href={`/${locale}`}>
                <ChinningLogo />
              </Link>

              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center gap-1.5 text-gray-700 hover:text-[#1B3A6B] font-medium text-sm transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                  التصنيفات
                  <svg xmlns="http://www.w3.org/2000/svg" className={`w-3 h-3 transition-transform ${isCategoriesOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {isCategoriesOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white shadow-xl rounded-xl border border-gray-100 w-52 z-50 py-2">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/${locale}/search?category_id=${category.id}`}
                        onClick={() => setIsCategoriesOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-[#1B3A6B] text-sm transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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
              {/* Cart */}
              <Link href={`/${locale}/shopping-carts`} className="relative p-2 text-gray-600 hover:text-[#1B3A6B] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px]">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-[#1B3A6B] transition-colors hidden md:block">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              {isAuthenticated ? (
                <div className="relative hidden md:block" ref={profileDropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#1B3A6B] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1B3A6B] text-white flex items-center justify-center text-sm font-bold">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <span className="hidden lg:block">{user?.name}</span>
                  </button>
                  {isProfileOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-xl border border-gray-100 w-44 z-50 py-2">
                      <Link href={`/${locale}/profile`} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1B3A6B]">
                        الملف الشخصي
                      </Link>
                      <Link href={`/${locale}/shopping-carts`} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1B3A6B]">
                        طلباتي
                      </Link>
                      <hr className="my-1" />
                      <button onClick={() => { logout(); setIsProfileOpen(false); }} className="w-full text-right flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
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
