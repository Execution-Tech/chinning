"use client";
import Footer from "@/componant/footer";
import Navbar from "@/componant/nav-bar";
import SearchFilters from "@/componant/search-filters/search-filters";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { axiosClient } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";
import { useLocale } from "next-intl";

const TopsPage = () => {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState("grid");
  const [productsList, setProducts] = useState<any[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchText, setSearchText] = useState(
    searchParams.get("general_search") || ""
  );

  const { isFavorite, toggleFavorite } = useFavorites();

  // Build query and fetch tops
  useEffect(() => {
    setLoading(true);
    const fetchTops = async () => {
      try {
        const params = new URLSearchParams(searchParams.toString());
        params.set("paginate", "10");
        params.set("page", String(page));
        const response = await axiosClient.get(`tops?${params.toString()}`);
        const raw = response.data?.data;
        // support both paginated and flat responses
        const items: any[] = Array.isArray(raw)
          ? raw
          : raw?.data || raw?.top_offers || [];
        setProducts((prev) => (page === 1 ? items : [...prev, ...items]));
        setTotalPages(raw?.meta?.last_page || 1);
      } catch (error) {
        console.error("Error fetching tops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTops();
  }, [searchParams.toString(), page]);

  // Reset page when search params change
  useEffect(() => {
    setPage(1);
  }, [searchParams.toString()]);

  // Infinite scroll sentinel
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < totalPages) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loading, page, totalPages]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchText) params.set("general_search", searchText);
    if (minPrice) params.set("priceMin", minPrice);
    if (maxPrice) params.set("priceMax", maxPrice);
    if (selectedBrands.length > 0)
      params.set("brand_id", JSON.stringify(selectedBrands));
    if (selectedColors.length > 0)
      params.set("color", JSON.stringify(selectedColors));
    router.replace(`/${locale}/tops?${params.toString()}`);
    setIsMobileFilterOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  return (
    <div className="bg-white">
      <Navbar />
      <div className="max-w-7xl bg-white mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="mb-6 flex gap-2">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search top offers..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ABD86] focus:border-[#4ABD86] text-gray-800"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#4ABD86] text-white rounded-lg font-medium hover:bg-[#3aa873] transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filter Button */}
          <div className="md:hidden flex items-center gap-3 mb-2">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#4ABD86] text-white rounded-lg font-medium text-sm shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>

          {/* Mobile Filter Drawer */}
          {isMobileFilterOpen && (
            <div className="md:hidden fixed inset-0 z-50">
              <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileFilterOpen(false)} />
              <div className="absolute bottom-0 start-0 end-0 bg-white rounded-t-2xl max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                  <button onClick={() => setIsMobileFilterOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="overflow-y-auto flex-1 p-4">
                  <SearchFilters
                    selectedBrands={selectedBrands}
                    setSelectedBrands={setSelectedBrands}
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    handleFilterChange={applyFilters}
                    selectedColors={selectedColors}
                    setSelectedColors={setSelectedColors}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sidebar Filters - Desktop */}
          <div className="md:w-1/4 max-w-[250px] hidden md:block">
            <SearchFilters
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              handleFilterChange={applyFilters}
              selectedColors={selectedColors}
              setSelectedColors={setSelectedColors}
            />
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            {/* Results Header */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <h1 className="text-xl font-semibold text-gray-800">Top Offers</h1>
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button onClick={() => setViewMode("grid")} className={`p-2 ${viewMode === "grid" ? "bg-gray-200" : "bg-white"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button onClick={() => setViewMode("list")} className={`p-2 ${viewMode === "list" ? "bg-gray-200" : "bg-white"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <div className={`grid ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
              {productsList.length > 0 &&
                productsList.map((product: any) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                      className="absolute top-3 end-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-md hover:scale-110 transition-transform"
                    >
                      {isFavorite(product.id) ? (
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </button>
                    <div className={`${viewMode === "list" ? "flex" : ""}`}>
                      <div className={`${viewMode === "list" ? "w-1/3" : "h-48"}`}>
                        {product.image_url || product.image ? (
                          <Image
                            src={product.image_url || product.image}
                            alt={product.name}
                            className="w-auto h-[95%] object-cover p-2 m-auto"
                            width={100}
                            height={100}
                            style={{ objectFit: "fill" }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <svg className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className={`p-4 ${viewMode === "list" ? "w-2/3" : ""}`}>
                        <h3
                          onClick={() => router.push(`/${locale}/product-overview/${product.id}`)}
                          className="hover:underline cursor-pointer text-lg line-clamp-2 font-medium text-gray-900 mb-2"
                        >
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          {product.brand?.name && (
                            <span className="bg-[#4ABD86] text-white text-xs font-semibold px-2.5 py-0.5 rounded">
                              {product.brand.name}
                            </span>
                          )}
                          {product.category?.name && (
                            <span className="bg-[#4ABD86] text-white text-xs font-semibold px-2.5 py-0.5 rounded">
                              {product.category.name}
                            </span>
                          )}
                        </div>
                        {product.description && (
                          <p
                            dangerouslySetInnerHTML={{ __html: product.description }}
                            className="text-gray-500 text-sm mt-1 whitespace-nowrap overflow-hidden text-ellipsis h-[40px]"
                          />
                        )}
                        <div className="mt-3">
                          <span className="text-lg font-bold text-[#4ABD86]">
                            EGP {parseFloat(product.price).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Skeleton loading */}
              {loading && page === 1 && productsList.length === 0 &&
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-5 bg-gray-200 rounded w-1/3 mt-2" />
                    </div>
                  </div>
                ))}
            </div>

            {/* Empty state */}
            {productsList.length === 0 && !loading && (
              <div className="flex flex-col items-center py-16 text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-[#4ABD86]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No results found</h2>
                <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                <Link href={`/${locale}/tops`} className="px-6 py-3 bg-[#4ABD86] text-white rounded-xl font-medium hover:bg-[#3aa873] transition-colors">
                  Clear all filters
                </Link>
              </div>
            )}

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="mt-10 flex flex-col items-center gap-3 py-6">
              {loading && page > 1 && (
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#4ABD86] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-3 h-3 rounded-full bg-[#4ABD86] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-3 h-3 rounded-full bg-[#4ABD86] animate-bounce" />
                </div>
              )}
              {!loading && page >= totalPages && productsList.length > 0 && (
                <div className="flex items-center gap-3 w-full max-w-xs">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#4ABD86]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    All {productsList.length} products loaded
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

export default TopsPage;
