"use client";
import Footer from "@/componant/footer";
import Navbar from "@/componant/nav-bar";
import CategoryFilters from "@/componant/category-filters";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getLocale } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { axiosClient } from "@/utils";

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400">
    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
  </svg>
);

const QcIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

const ProductCard = ({ product, locale, router, addItem }: any) => {
  const [qty, setQty] = useState(0);
  const rating = product.product_review?.length
    ? Math.round((product.product_review.reduce((s: number, r: any) => s + r.rating, 0) / product.product_review.length) * 10) / 10
    : 4.6;

  return (
    <div
      onClick={() => router.push(`/${locale}/product-overview/${product.id}`)}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#1B3A6B]/20 transition-all cursor-pointer group p-3"
    >
      <div className="relative aspect-square mb-3 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
        {product.image_url || product.image ? (
          <Image
            src={product.image_url || product.image}
            alt={product.name}
            className="object-contain w-full h-full p-2"
            width={220}
            height={220}
            unoptimized
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Add to cart */}
        {qty > 0 ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-2 left-2 flex items-center gap-1 bg-white rounded-full shadow px-1.5 py-1 z-10"
          >
            <button onClick={() => setQty((q) => q + 1)} className="w-5 h-5 flex items-center justify-center text-[#1B3A6B]">
              <PlusIcon />
            </button>
            <span className="text-xs font-bold text-gray-800 min-w-[14px] text-center">{qty}</span>
            <button onClick={() => setQty((q) => Math.max(0, q - 1))} className="w-5 h-5 flex items-center justify-center text-[#1B3A6B]">
              <MinusIcon />
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQty(1);
              addItem?.(product, 1);
            }}
            className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-[#1B3A6B] text-white flex items-center justify-center shadow z-10 hover:bg-[#2563EB] transition-colors"
          >
            <PlusIcon />
          </button>
        )}

        {/* QC badge */}
        <span className="absolute bottom-2 right-2 z-10 flex items-center gap-1 bg-white/95 text-[#1B3A6B] text-[10px] font-bold px-2 py-1 rounded-md border border-gray-100">
          <QcIcon />
          معتمد QC
        </span>
      </div>

      <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-2 group-hover:text-[#1B3A6B] transition-colors">
        {product.name}
      </h3>

      <div className="flex items-center justify-between mb-2 gap-2">
        <span className="flex items-center gap-1 text-xs font-bold text-gray-700">
          <StarIcon />
          {rating.toFixed(1)}
        </span>
        {product.brand?.name && (
          <span className="bg-[#EEF4FF] text-[#1B3A6B] text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
            {product.brand.name}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-base font-bold text-[#1B3A6B]">
          {parseFloat(product.price).toLocaleString()} ج.م
        </span>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse p-3">
    <div className="aspect-square bg-gray-200 rounded-xl mb-3" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
    <div className="h-5 bg-gray-200 rounded w-1/3 mt-2" />
  </div>
);

const PRICE_MIN = 0;
const PRICE_MAX = 100000;

const SearchPage = () => {
  const [sortBy, setSortBy] = useState("newest");
  const [productsList, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [newName, setNewName] = useState("");

  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState("all");

  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = getLocale();
  const { addItem } = useCart();

  // Fetch brand list for chips
  useEffect(() => {
    axiosClient.get("/brands")
      .then((r) => setBrands(r.data?.data || []))
      .catch(() => {});
  }, []);

  // Fetch products from API
  useEffect(() => {
    setLoading(true);
    const getAllProducts = async () => {
      try {
        const params = new URLSearchParams(searchParams.toString());
        params.set("paginate", "12");
        params.set("page", String(page));
        const response = await axiosClient.get(`products?${params.toString()}`);
        const productsData = response.data?.data?.data || [];
        setProducts((prev) => page === 1 ? productsData : [...prev, ...productsData]);
        setTotalPages(response.data?.data?.meta?.last_page || 1);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    getAllProducts();
  }, [searchParams.toString(), page]);

  // Reset to page 1 when search query changes
  const searchKey = searchParams.toString();
  useEffect(() => {
    setPage(1);
  }, [searchKey]);

  // Infinite scroll sentinel
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < totalPages) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loading, page, totalPages]);

  const handleFilterChange = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("priceMin", minPrice); else params.delete("priceMin");
    if (maxPrice) params.set("priceMax", maxPrice); else params.delete("priceMax");
    if (selectedColors.length > 0) params.set("color", JSON.stringify(selectedColors));
    else params.delete("color");
    router.replace(`/${locale}/search?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setSelectedBrandId("all");
    setMinPrice("");
    setMaxPrice("");
    setSelectedColors([]);
    setSelectedSize("");
    setSelectedRatings([]);
    router.replace(`/${locale}/search`);
  };

  const handleBrandChipClick = (brandId: string) => {
    setSelectedBrandId(brandId);
    const params = new URLSearchParams(searchParams.toString());
    if (brandId === "all") {
      params.delete("brand_id");
    } else {
      params.set("brand_id", JSON.stringify([brandId]));
    }
    router.replace(`/${locale}/search?${params.toString()}`);
  };

  // Client-side rating filter on top of API results
  const displayedProducts = selectedRatings.length > 0
    ? productsList.filter((p) => {
        const rating = p.product_review?.length
          ? p.product_review.reduce((s: number, r: any) => s + r.rating, 0) / p.product_review.length
          : 4.6;
        return selectedRatings.includes(Math.floor(rating));
      })
    : productsList;

  const filtersAppliedCount =
    (selectedBrandId !== "all" ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    selectedColors.length +
    (selectedSize ? 1 : 0) +
    selectedRatings.length;

  const chipOptions = [{ id: "all", name: "الكل" }, ...brands.map((b) => ({ id: String(b.id), name: b.name }))];

  const categoryId = searchParams.get("category_id") || "";

  return (
    <div className="min-h-screen bg-[#F0F4FF]" dir="rtl">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href={`/${locale}`} className="hover:text-[#1B3A6B] transition-colors">الرئيسية</Link>
          <ChevronIcon />
          {categoryId ? (
            <>
              <Link href={`/${locale}/search`} className="hover:text-[#1B3A6B] transition-colors">الفئات</Link>
              <ChevronIcon />
              <span className="text-gray-800 font-medium">
                {searchParams.get("name") || "نتائج البحث"}
              </span>
            </>
          ) : (
            <span className="text-gray-800 font-medium">الفئات</span>
          )}
        </nav>

        {/* Brand chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {chipOptions.map((chip) => (
            <button
              key={chip.id}
              onClick={() => handleBrandChipClick(chip.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors flex-shrink-0 ${
                selectedBrandId === chip.id
                  ? "bg-[#1B3A6B] text-white border-[#1B3A6B]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#1B3A6B]/40 hover:text-[#1B3A6B]"
              }`}
            >
              {chip.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-6">

          {/* Sidebar Filters */}
          <div className="md:w-72 flex-shrink-0">
            <CategoryFilters
              priceMin={PRICE_MIN}
              priceMax={PRICE_MAX}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              selectedColors={selectedColors}
              setSelectedColors={setSelectedColors}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              selectedRatings={selectedRatings}
              setSelectedRatings={setSelectedRatings}
              handleFilterChange={handleFilterChange}
              handleReset={handleResetFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-gray-800">الفلاتر</span>
                <span className="text-gray-400">
                  {filtersAppliedCount === 0 ? "لا توجد فلاتر مطبقة" : `${filtersAppliedCount} فلاتر مطبقة`}
                </span>
                {filtersAppliedCount > 0 && (
                  <button onClick={handleResetFilters} className="text-[#2563EB] text-xs hover:underline font-medium">
                    إعادة الضبط
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                  عرض {displayedProducts.length} منتج
                </span>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort-by" className="text-sm text-gray-500">ترتيب:</label>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-200 bg-white text-gray-700 rounded-xl py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
                  >
                    <option value="newest">الأحدث</option>
                    <option value="price-low">السعر: الأقل أولاً</option>
                    <option value="price-high">السعر: الأعلى أولاً</option>
                    <option value="rating">الأعلى تقييماً</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Top loading bar — refresh indicator */}
            {loading && page === 1 && productsList.length > 0 && (
              <div className="w-full h-1 bg-gray-100 rounded-full mb-4 overflow-hidden">
                <div className="h-full bg-[#1B3A6B] rounded-full animate-pulse" style={{ width: "60%" }} />
              </div>
            )}

            {/* Product Grid */}
            {loading && page === 1 && productsList.length === 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : displayedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedProducts.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    router={router}
                    addItem={addItem}
                  />
                ))}
              </div>
            ) : !loading ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
                <div className="w-16 h-16 bg-[#EEF4FF] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#1B3A6B]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">لم يتم العثور على نتائج</h3>
                <p className="text-gray-500 text-sm mb-6">جرّب البحث بكلمات مختلفة أو تصفح جميع المنتجات</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <div className="relative">
                    <input
                      onChange={(e) => setNewName(e.target.value)}
                      value={newName}
                      type="text"
                      placeholder="ابحث مجدداً..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] bg-gray-50"
                      dir="rtl"
                    />
                    <button
                      onClick={() => router.push(`/${locale}/search?name=${newName}`)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B3A6B]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={() => { handleResetFilters(); router.push(`/${locale}/search`); }}
                    className="bg-[#1B3A6B] text-white py-2.5 px-5 rounded-xl text-sm font-medium hover:bg-[#2563EB] transition-colors whitespace-nowrap"
                  >
                    جميع المنتجات
                  </button>
                </div>
              </div>
            ) : null}

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="mt-10 flex flex-col items-center gap-3 py-6">
              {loading && page > 1 && (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#1B3A6B] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-3 h-3 rounded-full bg-[#1B3A6B] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-3 h-3 rounded-full bg-[#1B3A6B] animate-bounce" />
                  </div>
                  <p className="text-sm text-gray-400 tracking-wide">جارٍ تحميل المزيد...</p>
                </div>
              )}

              {!loading && page < totalPages && productsList.length > 0 && (
                <div className="flex flex-col items-center gap-2 opacity-40">
                  <svg className="w-5 h-5 text-gray-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <p className="text-xs text-gray-400">مرر للمزيد</p>
                </div>
              )}

              {!loading && page >= totalPages && productsList.length > 0 && (
                <div className="flex items-center gap-3 w-full max-w-xs">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#1B3A6B]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    تم تحميل جميع المنتجات ({productsList.length})
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
