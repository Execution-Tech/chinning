"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import YosrICon from "../../public/new-logo.jpg";

import ecommerceAPI from "@/utils";
import { useTranslations } from "next-intl";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

const NotificationDropdown = ({
  isOpen,
  onClose,
  locale,
  onMarkAsRead,
}: {
  isOpen: boolean;
  onClose: () => void;
  locale?: string;
  onMarkAsRead?: () => void;
}) => {
  const t = useTranslations("Notifications");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       dropdownRef.current &&
  //       !dropdownRef.current.contains(event.target as Node)
  //     ) {
  //       onClose();
  //     }
  //   };

  //   if (isOpen) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   }
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [isOpen, onClose]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await ecommerceAPI.notifications.getAll();
      setNotifications(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await ecommerceAPI.notifications.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n,
        ),
      );
      onMarkAsRead?.();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={dropdownRef}
        className={`fixed md:absolute top-16 md:top-full inset-x-0 md:mt-2 w-full md:w-[420px] max-h-[480px] bg-[#E8F5EE] md:rounded-2xl shadow-xl border border-gray-200 z-50 overflow-y-auto ${
          locale === "ar"
            ? "md:left-0 md:right-auto"
            : "md:left-auto md:right-0"
        }`}
      >
        {/* Pointer arrow - desktop only */}
        <div className="hidden md:block absolute -top-2 end-4 w-4 h-4 bg-[#E8F5EE] rotate-45 border-s border-t border-gray-200"></div>

        <div className="p-3 md:p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#4ABD86] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              {t("noNotifications")}
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAsRead(notification.id);
                }}
                className={`flex items-start gap-3 rounded-xl p-4 shadow-sm cursor-pointer transition-colors ${
                  notification.read_at ? "bg-white" : "bg-[#f0faf5]"
                }`}
              >
                {/* Logo */}
                <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Image src={YosrICon} alt="Yosr" className="w-8 h-8" />
                  {!notification.read_at && (
                    <span className="absolute top-0 end-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-sm text-gray-900 ${!notification.read_at ? "font-bold" : "font-medium"}`}
                  >
                    {notification.title}
                  </h4>
                  <p className="text-sm text-[#4ABD86] mt-0.5 leading-snug">
                    {notification.body}
                  </p>
                </div>

                {/* Time */}
                <span className="flex-shrink-0 text-xs text-gray-400 mt-0.5">
                  {timeAgo(notification.created_at)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;
