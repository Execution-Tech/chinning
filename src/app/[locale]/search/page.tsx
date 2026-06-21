"use client";
import Footer from "@/componant/footer";
import Navbar from "@/componant/nav-bar";
import CategoryFilters from "@/componant/category-filters";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { products as allProducts } from "@/data/products";
import { brands, categories } from "@/data/categories";
import { getLocale } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const productPrices = allProducts.map((p) => p.price);
const PRICE_MIN = Math.floor(Math.min(...productPrices) / 1000) * 1000;
const PRICE_MAX = Math.ceil(Math.max(...productPrices) / 1000) * 1000;

const getRating = (product: (typeof allProducts)[number]) => {
  if (product.product_review?.length) {
    const avg =
      product.product_review.reduce((sum, r) => sum + r.rating, 0) /
      product.product_review.length;
    return Math.round(avg * 10) / 10;
  }
  return 4.6;
};

const getOriginalPrice = (price: number) => Math.round((price * 2.4) / 10) * 10;
const getStockLeft = (id: number) => ((id * 7) % 12) + 3;
const isNewProduct = (id: number) => id % 3 === 0;

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
  const rating = getRating(product);
  const originalPrice = getOriginalPrice(product.price);
  const stockLeft = getStockLeft(product.id);
  const isNew = isNewProduct(product.id);

  return (
    <div
      onClick={() => router.push(`/${locale}/product-overview/${product.id}`)}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#1B3A6B]/20 transition-all cursor-pointer group p-3"
    >
      <div className="relative aspect-square mb-3 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
        {isNew && (
          <span className="absolute top-2 left-2 z-10 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
            جديد
          </span>
        )}

        <Image
          src={product.image}
          alt={product.name}
          className="object-contain w-full h-full p-2"
          width={220}
          height={220}
          unoptimized
        />

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
        <span className="flex items-center gap-1 bg-red-50 text-red-500 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          باقي {stockLeft} قطع فقط
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-base font-bold text-[#1B3A6B]">{product.price.toLocaleString()} ج.م</span>
        <span className="text-xs text-gray-400 line-through">{originalPrice.toLocaleString()} ج.م</span>
      </div>
    </div>
  );
};

const SearchPage = () => {
  const [sortBy, setSortBy] = useState("newest");
  const [productsList, setProducts] = useState(allProducts);
  const [selectedBrandChip, setSelectedBrandChip] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [newName, setNewName] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = getLocale();
  const { addItem } = useCart();

  const categoryId = searchParams.get("category_id") || "";
  const activeCategory = categories.find((c) => String(c.id) === categoryId);

  useEffect(() => {
    const name = searchParams.get("name") || "";

    let filtered = allProducts;

    if (name) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (categoryId) {
      filtered = filtered.filter((p) => String(p.category?.id) === categoryId);
    }
    if (selectedBrandChip !== "all") {
      filtered = filtered.filter((p) => p.brand?.name === selectedBrandChip);
    }
    if (minPrice) filtered = filtered.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    if (selectedRatings.length > 0) {
      filtered = filtered.filter((p) => selectedRatings.includes(Math.floor(getRating(p))));
    }

    filtered = [...filtered];
    if (sortBy === "price-low") filtered.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") filtered.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") filtered.sort((a, b) => getRating(b) - getRating(a));
    if (sortBy === "newest") filtered.sort((a, b) => b.id - a.id);

    setProducts(filtered);
  }, [searchParams.toString(), selectedBrandChip, minPrice, maxPrice, selectedRatings.join(","), sortBy]);

  const handleResetFilters = () => {
    setSelectedBrandChip("all");
    setMinPrice("");
    setMaxPrice("");
    setSelectedColors([]);
    setSelectedSize("");
    setSelectedRatings([]);
  };

  const filtersAppliedCount =
    (selectedBrandChip !== "all" ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    selectedColors.length +
    (selectedSize ? 1 : 0) +
    selectedRatings.length;

  const chipOptions = [{ id: "all", name: "الكل" }, ...brands.map((b) => ({ id: b.name, name: b.name }))];

  return (
    <div className="min-h-screen bg-[#F0F4FF] stripe-bg" dir="rtl">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href={`/${locale}`} className="hover:text-[#1B3A6B] transition-colors">الرئيسية</Link>
          <ChevronIcon />
          {activeCategory ? (
            <>
              <Link href={`/${locale}/search`} className="hover:text-[#1B3A6B] transition-colors">الفئات</Link>
              <ChevronIcon />
              <span className="text-gray-800 font-medium">{activeCategory.name}</span>
            </>
          ) : (
            <span className="text-gray-800 font-medium">الفئات</span>
          )}
        </nav>

        {/* Category chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {chipOptions.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setSelectedBrandChip(chip.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors flex-shrink-0 ${
                selectedBrandChip === chip.id
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
              handleFilterChange={() => {}}
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
                <span className="text-sm text-gray-500 font-medium whitespace-nowrap">عرض {productsList.length} منتج</span>
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

            {/* Product Grid */}
            {productsList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {productsList.map((product) => (
                  <ProductCard key={product.id} product={product} locale={locale} router={router} addItem={addItem} />
                ))}
              </div>
            ) : (
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
                    onClick={() => {
                      handleResetFilters();
                      router.push(`/${locale}/search`);
                    }}
                    className="bg-[#1B3A6B] text-white py-2.5 px-5 rounded-xl text-sm font-medium hover:bg-[#2563EB] transition-colors whitespace-nowrap"
                  >
                    جميع المنتجات
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
