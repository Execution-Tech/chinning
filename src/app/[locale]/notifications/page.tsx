"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import ecommerceAPI from "@/utils";
import Navbar from "@/componant/nav-bar";
import Footer from "@/componant/footer";

interface Notification {
  id: string | number;
  type: string;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

type Category = "offer" | "payment" | "order" | "other";

const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 rotate-180">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const BoxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M9 8h1m4.5-5.5H7.5A2.25 2.25 0 0 0 5.25 4.75v14.5A2.25 2.25 0 0 0 7.5 21.5h9a2.25 2.25 0 0 0 2.25-2.25V8.25L13.5 2.5Z" />
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008M12 2.25c-.69 0-1.36.276-1.85.766L3.016 10.15a2.625 2.625 0 0 0-.766 1.85v0c0 .69.276 1.36.766 1.85l7.134 7.134a2.625 2.625 0 0 0 1.85.766v0c.69 0 1.36-.276 1.85-.766l7.134-7.134a2.625 2.625 0 0 0 .766-1.85v0c0-.69-.276-1.36-.766-1.85L13.85 3.016A2.625 2.625 0 0 0 12 2.25Z" />
  </svg>
);

const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h13.5m-13.5 0V8.25A1.5 1.5 0 0 1 9.75 6.75h6.75a1.5 1.5 0 0 1 1.5 1.5v10.5m-9.75 0h9.75m0 0a1.5 1.5 0 0 0 3 0m-3 0a1.5 1.5 0 0 1 3 0m0 0h1.5V13.5a1.5 1.5 0 0 0-.44-1.06l-2.5-2.5a1.5 1.5 0 0 0-1.06-.44h-.75" />
  </svg>
);

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
  </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
);

const EmptyBellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-300 mb-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
);

const getCategory = (type: string): Category => {
  const t = (type || "").toLowerCase();
  if (/(offer|promo|discount|deal)/.test(t)) return "offer";
  if (/(payment|paid|invoice|installment)/.test(t)) return "payment";
  if (/(order|ship|deliver|return|damage|claim|cancel)/.test(t)) return "order";
  return "other";
};

const getTypeVisual = (type: string) => {
  const t = (type || "").toLowerCase();
  if (/(damage|claim|cancel|reject)/.test(t))
    return { bg: "bg-red-100", color: "text-red-500", Icon: AlertIcon };
  if (/(pending|review)/.test(t))
    return { bg: "bg-yellow-100", color: "text-yellow-500", Icon: ClockIcon };
  if (/(ship|deliver|way|transit|track)/.test(t))
    return { bg: "bg-[#E8F5EE]", color: "text-[#4ABD86]", Icon: TruckIcon };
  if (/(payment|paid|invoice|installment)/.test(t))
    return { bg: "bg-blue-100", color: "text-blue-600", Icon: DocumentIcon };
  if (/(offer|promo|discount|deal)/.test(t))
    return { bg: "bg-orange-100", color: "text-orange-500", Icon: TagIcon };
  if (/(order|placed|confirm|success)/.test(t))
    return { bg: "bg-[#1B3A6B]/10", color: "text-[#1B3A6B]", Icon: BoxIcon };
  return { bg: "bg-gray-100", color: "text-gray-500", Icon: BellIcon };
};

const extractOrderId = (notification: Notification): string | null => {
  const text = `${notification.title} ${notification.body}`;
  const match = text.match(/(?:ord-|#)\s*0*(\d{2,})/i);
  return match ? match[1] : null;
};

const formatTimeAgo = (dateString: string, t: (key: string, values?: any) => string) => {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return t("justNow");
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return t("minutesAgo", { count: minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t("hoursAgo", { count: hours });
  const days = Math.floor(hours / 24);
  if (days < 30) return t("daysAgo", { count: days });
  const months = Math.floor(days / 30);
  return t("monthsAgo", { count: months });
};

interface NotificationGroup {
  key: string;
  orderId: string | null;
  items: Notification[];
}

const groupNotifications = (notifications: Notification[]): NotificationGroup[] => {
  const groups: NotificationGroup[] = [];
  notifications.forEach((notification) => {
    const orderId = extractOrderId(notification);
    const day = notification.created_at?.slice(0, 10);
    const key = orderId ? `${orderId}_${day}` : `single_${notification.id}`;
    const last = groups[groups.length - 1];
    if (orderId && last?.key === key) {
      last.items.push(notification);
    } else {
      groups.push({ key, orderId, items: [notification] });
    }
  });
  return groups;
};

const NotificationRow = ({
  notification,
  onClick,
  t,
}: {
  notification: Notification;
  onClick: (notification: Notification) => void;
  t: (key: string, values?: any) => string;
}) => {
  const visual = getTypeVisual(notification.type);
  const Icon = visual.Icon;
  const isUnread = !notification.read_at;

  return (
    <div
      onClick={() => onClick(notification)}
      className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${isUnread ? "bg-[#F7FAFF]" : "bg-white"}`}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${visual.bg} ${visual.color}`}>
        <Icon />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {isUnread && <span className="w-2 h-2 rounded-full bg-[#1B3A6B] flex-shrink-0" />}
          <h4 className={`text-sm text-gray-800 ${isUnread ? "font-bold" : "font-medium"}`}>
            {notification.title}
          </h4>
        </div>
        <p className="text-sm text-gray-500 mt-1 leading-snug">{notification.body}</p>
        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
          <ClockIcon />
          {formatTimeAgo(notification.created_at, t)}
        </div>
      </div>
    </div>
  );
};

export default function NotificationsPage() {
  const t = useTranslations("Notifications");
  const locale = useLocale();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "offer" | "payment" | "order">("all");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await ecommerceAPI.notifications.getAll();
      setNotifications(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notification: Notification) => {
    if (notification.read_at) return;
    try {
      await ecommerceAPI.notifications.markAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, read_at: new Date().toISOString() } : n,
        ),
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const counts = useMemo(() => {
    const result = { all: notifications.length, offer: 0, payment: 0, order: 0 };
    notifications.forEach((n) => {
      const category = getCategory(n.type);
      if (category !== "other") result[category]++;
    });
    return result;
  }, [notifications]);

  const tabs = [
    { key: "all" as const, label: t("all"), count: counts.all },
    { key: "offer" as const, label: t("offers"), count: counts.offer },
    { key: "payment" as const, label: t("payments"), count: counts.payment },
    { key: "order" as const, label: t("orders"), count: counts.order },
  ];

  const filtered = useMemo(() => {
    if (activeTab === "all") return notifications;
    return notifications.filter((n) => getCategory(n.type) === activeTab);
  }, [notifications, activeTab]);

  const groups = useMemo(() => groupNotifications(filtered), [filtered]);

  const featured = useMemo(
    () => notifications.find((n) => !n.read_at) || notifications[0] || null,
    [notifications],
  );

  return (
    <div className="min-h-screen bg-[#F0F4FF] stripe-bg" dir="rtl">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href={`/${locale}`} className="hover:text-[#1B3A6B] transition-colors">
            {t("home")}
          </Link>
          <ChevronIcon />
          <span className="text-gray-800 font-medium">{t("title")}</span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
          {notifications.length > 0 && (
            <span className="flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-full bg-[#1B3A6B] text-white text-sm font-bold">
              {notifications.length}
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors flex-shrink-0 ${
                activeTab === tab.key
                  ? "bg-[#1B3A6B] text-white border-[#1B3A6B]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#1B3A6B]/40 hover:text-[#1B3A6B]"
              }`}
            >
              {tab.label}
              <span
                className={`text-xs rounded-full px-2 py-0.5 ${
                  activeTab === tab.key ? "bg-white/20" : "bg-gray-100 text-gray-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4ABD86]" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <EmptyBellIcon />
            <p className="text-gray-500">{t("noNotifications")}</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Featured notification */}
            {featured && (
              <aside className="w-full lg:w-80 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                    <CalendarIcon />
                    {formatTimeAgo(featured.created_at, t)}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{featured.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">{featured.body}</p>
                  {extractOrderId(featured) && (
                    <Link
                      href={`/${locale}/profile/orders/${extractOrderId(featured)}`}
                      className="block text-center bg-[#1B3A6B] text-white font-medium rounded-xl py-3 hover:bg-[#15305a] transition-colors"
                    >
                      {t("viewOrder")}
                    </Link>
                  )}
                </div>
              </aside>
            )}

            {/* Notification groups */}
            <div className="flex-1 space-y-4">
              {groups.map((group) => (
                <div
                  key={group.key}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {group.orderId && (
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <Link
                        href={`/${locale}/profile/orders/${group.orderId}`}
                        className="flex items-center gap-1.5 text-sm font-medium text-[#1B3A6B] hover:underline"
                      >
                        <ChevronIcon />
                        {t("viewOrder")}
                      </Link>
                      <span className="flex items-center gap-1.5 font-bold text-gray-800 text-sm">
                        {t("order")} #{group.orderId}
                        <DocumentIcon />
                      </span>
                    </div>
                  )}
                  <div className="divide-y divide-gray-100">
                    {group.items.map((notification) => (
                      <NotificationRow
                        key={notification.id}
                        notification={notification}
                        onClick={handleMarkAsRead}
                        t={t}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
