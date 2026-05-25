"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { topSelling } from "@/data/products";
import { getLocale } from "@/context/AuthContext";
import Link from "next/link";

const ItemChipsContainer = () => {
  const router = useRouter();
  const locale = getLocale();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">الأكثر مبيعاً</h2>
        <Link href={`/${locale}/search`} className="text-sm text-[#2563EB] hover:underline font-medium">
          عرض الكل
        </Link>
      </div>

      {/* Tag chips */}
      <div className="flex flex-wrap gap-2 px-6 pt-4">
        {topSelling.map((item) => (
          <button
            key={item.id}
            onClick={() => router.push(`/${locale}/product-overview/${item.id}`)}
            className="text-xs text-[#1B3A6B] border border-[#1B3A6B]/30 bg-[#EEF4FF] rounded-full px-3 py-1.5 hover:bg-[#1B3A6B] hover:text-white transition-colors duration-200 font-medium"
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Product cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-6">
        {topSelling.map((item) => (
          <div
            key={item.id}
            onClick={() => router.push(`/${locale}/product-overview/${item.id}`)}
            className="cursor-pointer group"
          >
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-3 aspect-square flex items-center justify-center mb-2 group-hover:border-[#1B3A6B]/30 group-hover:shadow-md transition-all overflow-hidden">
              <Image
                src={item.image}
                width={120}
                height={120}
                alt={item.name}
                unoptimized
                className="object-contain w-full h-full"
              />
            </div>
            <p className="text-xs text-gray-700 font-medium line-clamp-2 mb-1">{item.name}</p>
            <span className="text-sm font-bold text-[#1B3A6B]">
              {item.price.toLocaleString()} ج.م
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemChipsContainer;
