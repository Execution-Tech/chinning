"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { axiosClient } from "@/utils";
import { getLocale } from "@/context/AuthContext";
import Link from "next/link";

const getText = (value: any): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value.ar) return value.ar;
  if (typeof value === "object" && value.en) return value.en;
  return String(value);
};

const CategoriesIcons = () => {
  const locale = getLocale();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("categories");
        setCategories(response.data?.data || response.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading || categories.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">فئات التسوق</h2>
        <Link href={`/${locale}/search`} className="text-sm text-[#2563EB] hover:underline font-medium">
          عرض الكل
        </Link>
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 min-w-max md:min-w-0 md:flex-wrap md:justify-start">
          {categories.map((category: any) => (
            <Link
              href={`/${locale}/search?main_category_id=${category.id}`}
              key={category.id}
              className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center overflow-hidden group-hover:bg-[#EEF4FF] group-hover:border-[#1B3A6B]/30 transition-all duration-200 group-hover:shadow-md">
                {category.image ? (
                  <Image
                    src={category.image}
                    width={40}
                    height={40}
                    alt={getText(category.name)}
                    className="w-8 h-8 object-contain"
                    unoptimized
                  />
                ) : (
                  <span className="text-2xl">📦</span>
                )}
              </div>
              <span className="text-xs text-gray-600 text-center font-medium group-hover:text-[#1B3A6B] transition-colors max-w-[72px] line-clamp-2">
                {getText(category.name)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesIcons;
