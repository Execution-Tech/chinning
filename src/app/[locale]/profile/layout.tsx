"use client";

import Navbar from "@/componant/nav-bar";
import Footer from "@/componant/footer";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";

// Sidebar Menu Item Component
const SidebarMenuItem = ({
  icon,
  label,
  isActive,
  onClick,
  isDanger = false,
}: {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  isDanger?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? "bg-[#E8F5EE] text-[#4ABD86]"
        : isDanger
          ? "text-red-500 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    <span
      className={`w-10 h-10 flex items-center justify-center rounded-full ${
        isActive
          ? "bg-[#4ABD86] text-white"
          : isDanger
            ? "bg-red-100 text-red-500"
            : "bg-gray-100 text-gray-500"
      }`}
    >
      {icon}
    </span>
    <span className="font-medium">{label}</span>
    {!isDanger && (
      <svg
        className="w-5 h-5 ms-auto text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    )}
  </button>
);

// User Info Card Component
const UserInfoCard = ({
  user,
  hi,
  noPhone,
}: {
  user: { name: string; phone: string } | null;
  hi: string;
  noPhone: string;
}) => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
      <svg
        className="w-6 h-6 text-gray-500"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
    <div>
      <p className="font-semibold text-gray-800">
        {hi} {user?.name}
      </p>
      <p className="text-gray-500 text-sm">{user?.phone || noPhone}</p>
    </div>
  </div>
);

// Stats Card Component
const StatsCard = ({
  label,
  value,
  hasArrow = false,
}: {
  label: string;
  value: string;
  hasArrow?: boolean;
}) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
    {hasArrow && (
      <svg
        className="w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    )}
  </div>
);

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, deleteAccount, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Profile");
  const locale = useLocale();

  const handleLogout = async () => {
    await logout();
    router.push(`/${locale}`);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = () => setShowDeleteModal(true);

  const confirmDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAccount();
    setIsDeleting(false);
    if (result.success) {
      setShowDeleteModal(false);
      router.push(`/${locale}`);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/${locale}?signIn=true`);
    }
  }, [isAuthenticated, isLoading, locale, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4ABD86]"></div>
      </div>
    );
  }

  const isOrdersPage = pathname?.includes("/orders");
  const isFavoritesPage = pathname?.includes("/favorites");

  console.log("isOrdersPage", user);
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 py-6 gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-72 flex-shrink-0">
          <div className="bg-white rounded-lg p-4 space-y-2">
            <SidebarMenuItem
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              }
              label={t("myOrders")}
              isActive={isOrdersPage}
              onClick={() => router.push(`/${locale}/profile/orders`)}
            />
            <SidebarMenuItem
              icon={
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              }
              label={t("myFavorites")}
              isActive={isFavoritesPage}
              onClick={() => router.push(`/${locale}/profile/favorites`)}
            />
            <SidebarMenuItem
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              }
              label={t("logout")}
              onClick={handleLogout}
            />
            <SidebarMenuItem
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              }
              label={t("deleteAccount")}
              isDanger
              onClick={handleDeleteAccount}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* User Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <UserInfoCard user={user} hi={t("hi")} noPhone={t("noPhone")} />
            <StatsCard
              label={t("availableLimit")}
              value={`EGP ${user.score}`}
            />
            <StatsCard label={t("myPoints")} value={"0"} hasArrow />
          </div>

          {/* Nested page content */}
          {children}
        </main>
      </div>
      <Footer />

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {t("deleteAccount")}
            </h2>
            <p className="text-gray-500 text-center text-sm">
              {t("deleteConfirm")}
            </p>
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                {t("cancel")}
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isDeleting && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {t("deleteAccount")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
