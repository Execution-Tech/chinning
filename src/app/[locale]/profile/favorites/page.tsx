"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import ecommerceAPI from "@/utils";

const getText = (value: any, locale: string): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if (locale === "ar" && value.ar) return value.ar;
    if (value.en) return value.en;
    if (value.ar) return value.ar;
  }
  return String(value);
};

const stripHtml = (html: string): string => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\r\n/g, " ")
    .trim();
};

interface FavoriteItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

const FavoriteItemCard = ({
  item,
  onRemove,
  onClick,
}: {
  item: FavoriteItem;
  onRemove: (itemId: number) => void;
  onClick: (itemId: number) => void;
}) => (
  <div
    className="bg-white min-h-[250px] rounded-lg border border-gray-200 p-4 flex gap-4 cursor-pointer hover:shadow-md transition-shadow"
    onClick={() => onClick(item.id)}
  >
    <div className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
      <Image
        src={item.image || "/placeholder.png"}
        alt={item.name}
        width={112}
        height={112}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-1">
      <h4 className="font-medium text-gray-800">{item.name}</h4>
      <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
      <p className="font-semibold text-[#4ABD86] mt-2">
        {parseFloat(item.price).toLocaleString()}{" "}
        <span className="text-sm">EGP</span>
      </p>
    </div>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onRemove(item.id);
      }}
      className="w-10 h-10 flex items-center justify-center border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors self-start"
    >
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
    </button>
  </div>
);

export default function FavoritesPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("Profile");
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await ecommerceAPI.wishlist.get();
      if (response.data?.data) {
        setFavorites(
          response.data.data.map((item: any) => ({
            id: item.id,
            name: getText(item.name, locale),
            description: stripHtml(getText(item.description, locale)),
            price: item.price || "0",
            image: item.image || "",
          })),
        );
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (itemId: number) => {
    try {
      await ecommerceAPI.wishlist.removeItem(itemId);
      setFavorites(favorites.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const handleFavoriteClick = (itemId: number) => {
    router.push(`/${locale}/product-overview/${itemId}`);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {t("myFavorites")}
      </h2>
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4ABD86]"></div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <p className="text-gray-500">{t("noFavorites")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((item) => (
            <FavoriteItemCard
              key={item.id}
              item={item}
              onRemove={handleRemoveFavorite}
              onClick={handleFavoriteClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
