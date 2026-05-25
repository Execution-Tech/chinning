"use client";
import Footer from "@/componant/footer";
import Navbar from "@/componant/nav-bar";
import SearchFilters from "@/componant/search-filters/search-filters";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { products as allProducts } from "@/data/products";
import { brands } from "@/data/categories";
import { getLocale } from "@/context/AuthContext";

const SearchPage = () => {
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [productsList, setProducts] = useState(allProducts);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [newName, setNewName] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = getLocale();

  useEffect(() => {
    const name = searchParams.get("name") || "";
    const categoryId = searchParams.get("category_id") || "";

    let filtered = allProducts;

    if (name) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (categoryId) {
      filtered = filtered.filter((p) => String(p.category?.id) === categoryId);
    }
    setProducts(filtered);
  }, [searchParams.toString()]);

  const handleFilterChange = () => {
    let filtered = allProducts;

    if (minPrice) filtered = filtered.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    if (selectedBrands.length > 0) {
      const selectedBrandNames = brands
        .filter((b) => selectedBrands.includes(b.id))
        .map((b) => b.name.toLowerCase());
      filtered = filtered.filter((p) =>
        selectedBrandNames.some((name) => p.brand?.name?.toLowerCase() === name)
      );
    }

    if (sortBy === "price-low") filtered = [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") filtered = [...filtered].sort((a, b) => b.price - a.price);

    setProducts(filtered);
  };

  return (
    <div className="min-h-screen bg-[#F0F4FF] stripe-bg" dir="rtl">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Sidebar Filters */}
          <div className="md:w-64 flex-shrink-0">
            <SearchFilters
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              handleFilterChange={handleFilterChange}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
              <span className="text-sm text-gray-500 font-medium">{productsList.length} نتيجة</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <label htmlFor="sort-by" className="text-sm text-gray-500">ترتيب:</label>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); handleFilterChange(); }}
                    className="border border-gray-200 bg-white text-gray-700 rounded-xl py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30"
                  >
                    <option value="featured">مميز</option>
                    <option value="price-low">السعر: الأقل أولاً</option>
                    <option value="price-high">السعر: الأعلى أولاً</option>
                    <option value="newest">الأحدث</option>
                  </select>
                </div>
                <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-colors ${viewMode === "grid" ? "bg-[#1B3A6B] text-white" : "text-gray-500 hover:bg-gray-50"}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-colors ${viewMode === "list" ? "bg-[#1B3A6B] text-white" : "text-gray-500 hover:bg-gray-50"}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {productsList.length > 0 ? (
              <div className={`grid ${viewMode === "grid" ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-4`}>
                {productsList.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => router.push(`/${locale}/product-overview/${product.id}`)}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#1B3A6B]/20 transition-all cursor-pointer group"
                  >
                    <div className={`${viewMode === "list" ? "flex gap-4 p-4" : "p-4"}`}>
                      <div className={`${viewMode === "list" ? "w-28 h-28 flex-shrink-0" : "aspect-square mb-3"} bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100`}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          className="object-contain w-full h-full p-2"
                          width={180}
                          height={180}
                          unoptimized
                        />
                      </div>
                      <div className={viewMode === "list" ? "flex-1" : ""}>
                        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-2 group-hover:text-[#1B3A6B] transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {product.brand?.name && (
                            <span className="bg-[#EEF4FF] text-[#1B3A6B] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              {product.brand.name}
                            </span>
                          )}
                          {product.category?.name && (
                            <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              {product.category.name}
                            </span>
                          )}
                        </div>
                        {viewMode === "list" && (
                          <p className="text-gray-500 text-xs line-clamp-2 mb-3">{product.description}</p>
                        )}
                        <span className="text-base font-bold text-[#1B3A6B]">{product.price.toLocaleString()} ج.م</span>
                      </div>
                    </div>
                  </div>
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
                  <Link href={`/${locale}/search`} className="bg-[#1B3A6B] text-white py-2.5 px-5 rounded-xl text-sm font-medium hover:bg-[#2563EB] transition-colors whitespace-nowrap">
                    جميع المنتجات
                  </Link>
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
