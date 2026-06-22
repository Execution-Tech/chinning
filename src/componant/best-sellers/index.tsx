"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getLocale } from "@/context/AuthContext";
import { axiosClient } from "@/utils";

const getText = (value: any): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value.ar) return value.ar;
  if (typeof value === "object" && value.en) return value.en;
  return String(value);
};

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

const BestSellersRow = () => {
  const router = useRouter();
  const locale = getLocale();
  const [topSelling, setTopSelling] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [topsRes, catsRes] = await Promise.all([
          axiosClient.get("tops"),
          axiosClient.get("categories"),
        ]);
        const tops = topsRes.data?.data;
        const cats = catsRes.data?.data || catsRes.data || [];

        setTopSelling(tops?.top_selling || []);
        setSubCategories(tops?.sub_categories || []);
        setCategories(cats);

        if (cats.length > 0) {
          setSelectedCategoryId(cats[0].id);
        }
      } catch (err) {
        console.error("Error fetching best sellers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectedSubCategoryIds = subCategories
    .filter((sub: any) => sub.parent_id === selectedCategoryId)
    .map((sub: any) => sub.id);

  const filteredProducts = topSelling.filter((product: any) =>
    selectedSubCategoryIds.includes(product.category_id)
  );

  if (loading) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">الأكثر مبيعاً</h2>
        <button
          onClick={() => router.push(`/${locale}/search`)}
          className="flex items-center gap-1 text-sm text-[#2563EB] hover:underline font-medium"
        >
          عرض الكل
          <ArrowLeftIcon />
        </button>
      </div>

      {/* Category chips */}
      {categories.length > 0 && (
        <div className="overflow-x-auto scrollbar-hide mb-5">
          <div className="flex gap-2 min-w-max md:min-w-0 md:flex-wrap">
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium border transition duration-200 cursor-pointer whitespace-nowrap ${
                  selectedCategoryId === cat.id
                    ? "bg-[#1B3A6B] text-white border-[#1B3A6B]"
                    : "text-gray-700 border-gray-200 hover:border-[#1B3A6B] hover:text-[#1B3A6B]"
                }`}
              >
                {getText(cat.name)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-400 text-sm py-8 text-center">
          لا توجد منتجات في هذه الفئة
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredProducts.map((item: any) => (
            <div
              key={item.id}
              onClick={() => router.push(`/${locale}/product-overview/${item.id}`)}
              className="cursor-pointer group"
            >
              <div className="relative bg-gray-50 rounded-xl border border-gray-100 aspect-square overflow-hidden mb-2 group-hover:border-[#1B3A6B]/30 group-hover:shadow-md transition-all">
                <Image
                  src={item.image || item.image_url || ""}
                  alt={item.name}
                  width={150}
                  height={150}
                  unoptimized
                  className="object-contain w-full h-full p-2"
                />
              </div>
              <p className="text-xs text-gray-700 font-medium line-clamp-2 mb-1">{item.name}</p>
              <span className="text-sm font-bold text-[#1B3A6B]">
                {Number(item.price).toLocaleString()} ج.م
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BestSellersRow;
