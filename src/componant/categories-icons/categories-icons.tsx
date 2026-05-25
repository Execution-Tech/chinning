"use client";
import { categories } from "@/data/categories";
import { getLocale } from "@/context/AuthContext";
import Link from "next/link";

const categoryEmojis: Record<number, string> = {
  1: "📺",
  2: "📱",
  3: "💻",
  4: "📟",
  5: "🎧",
  6: "📷",
  7: "🎮",
  8: "🔌",
};

const CategoriesIcons = () => {
  const locale = getLocale();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">التصنيفات</h2>
        <Link href={`/${locale}/search`} className="text-sm text-[#2563EB] hover:underline font-medium">
          عرض الكل
        </Link>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {categories.map((category) => (
          <Link
            href={`/${locale}/search?category_id=${category.id}`}
            key={category.id}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="w-14 h-14 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center text-2xl group-hover:bg-[#EEF4FF] group-hover:border-[#1B3A6B]/30 transition-all duration-200 group-hover:shadow-md">
              {categoryEmojis[category.id] ?? "🛒"}
            </div>
            <span className="text-xs text-gray-600 text-center font-medium group-hover:text-[#1B3A6B] transition-colors">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesIcons;
