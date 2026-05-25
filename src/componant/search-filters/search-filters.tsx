"use client";
import { brands } from "@/data/categories";

export default function SearchFilters({
  selectedBrands,
  setSelectedBrands,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  handleFilterChange,
  setSelectedColors,
}: {
  selectedBrands: string[];
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
  minPrice: string;
  setMinPrice: React.Dispatch<React.SetStateAction<string>>;
  maxPrice: string;
  setMaxPrice: React.Dispatch<React.SetStateAction<string>>;
  handleFilterChange: () => void;
  selectedColors?: string[];
  setSelectedColors?: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const handleBrandChange = (brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]
    );
  };

  const handleResetFilters = () => {
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    setSelectedColors?.([]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-fit">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-bold text-gray-800">الفلاتر</h2>
        <button
          onClick={handleResetFilters}
          className="text-xs text-[#2563EB] hover:underline font-medium"
        >
          إعادة الضبط
        </button>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">الماركات</h3>
        <div className="space-y-2.5">
          {brands.map((brand) => (
            <label key={brand.id} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand.id)}
                onChange={() => handleBrandChange(brand.id)}
                className="w-4 h-4 rounded border-gray-300 text-[#1B3A6B] focus:ring-[#1B3A6B]/30 accent-[#1B3A6B]"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                {brand.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">نطاق السعر (ج.م)</h3>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1">من</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full border border-gray-200 rounded-xl py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] bg-gray-50"
              placeholder="0"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1">إلى</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border border-gray-200 rounded-xl py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 focus:border-[#1B3A6B] bg-gray-50"
              placeholder="50000"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleFilterChange}
        className="w-full bg-[#1B3A6B] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2563EB] transition-colors"
      >
        تطبيق الفلاتر
      </button>
    </div>
  );
}
