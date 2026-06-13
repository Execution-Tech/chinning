"use client";

const colorOptions = [
  { id: "lightblue", hex: "#38BDF8", name: "أزرق فاتح" },
  { id: "green", hex: "#10B981", name: "أخضر" },
  { id: "red", hex: "#EF4444", name: "أحمر" },
  { id: "black", hex: "#111827", name: "أسود" },
  { id: "navy", hex: "#1B3A6B", name: "كحلي" },
  { id: "white", hex: "#FFFFFF", name: "أبيض" },
];

const sizeOptions = ["صغير", "متوسط", "كبير", "كبير 2x", "كبير 3x"];

const ratingOptions = [5, 4, 3];

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={`w-3.5 h-3.5 ${filled ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
  >
    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const CheckIcon = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={2.5} stroke="currentColor" className={`w-3.5 h-3.5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

interface CategoryFiltersProps {
  priceMin: number;
  priceMax: number;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  selectedColors: string[];
  setSelectedColors: (value: string[]) => void;
  selectedSize: string;
  setSelectedSize: (value: string) => void;
  selectedRatings: number[];
  setSelectedRatings: (value: number[]) => void;
  handleFilterChange: () => void;
  handleReset: () => void;
}

export default function CategoryFilters({
  priceMin,
  priceMax,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  selectedColors,
  setSelectedColors,
  selectedSize,
  setSelectedSize,
  selectedRatings,
  setSelectedRatings,
  handleFilterChange,
  handleReset,
}: CategoryFiltersProps) {
  const step = 100;
  const minVal = minPrice ? Number(minPrice) : priceMin;
  const maxVal = maxPrice ? Number(maxPrice) : priceMax;
  const minPercent = ((minVal - priceMin) / (priceMax - priceMin)) * 100;
  const maxPercent = ((maxVal - priceMin) / (priceMax - priceMin)) * 100;

  const toggleColor = (id: string) => {
    setSelectedColors(
      selectedColors.includes(id) ? selectedColors.filter((c) => c !== id) : [...selectedColors, id]
    );
  };

  const toggleRating = (rating: number) => {
    setSelectedRatings(
      selectedRatings.includes(rating) ? selectedRatings.filter((r) => r !== rating) : [...selectedRatings, rating]
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-fit">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-bold text-gray-800">تصفية النتائج</h2>
        <button onClick={handleReset} className="text-xs text-[#2563EB] hover:underline font-medium">
          إعادة تعيين
        </button>
      </div>

      {/* Price range */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">نطاق السعر</h3>
        <div className="relative h-1.5 mt-2">
          <div className="absolute inset-0 h-1.5 bg-gray-200 rounded-full" />
          <div
            className="absolute h-1.5 bg-[#1B3A6B] rounded-full"
            style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
          />
          <input
            type="range"
            min={priceMin}
            max={priceMax}
            step={step}
            value={minVal}
            onChange={(e) => {
              const v = Math.min(Number(e.target.value), maxVal - step);
              setMinPrice(String(v));
            }}
            className="range-thumb absolute top-0 w-full h-1.5 m-0 appearance-none bg-transparent"
          />
          <input
            type="range"
            min={priceMin}
            max={priceMax}
            step={step}
            value={maxVal}
            onChange={(e) => {
              const v = Math.max(Number(e.target.value), minVal + step);
              setMaxPrice(String(v));
            }}
            className="range-thumb absolute top-0 w-full h-1.5 m-0 appearance-none bg-transparent"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-4">
          <span className="font-semibold text-gray-700">{minVal.toLocaleString()} ج.م</span>
          <span className="font-semibold text-gray-700">{maxVal.toLocaleString()} ج.م</span>
        </div>
      </div>

      {/* Color */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">اللون</h3>
        <div className="flex items-center gap-3 flex-wrap">
          {colorOptions.map((color) => {
            const selected = selectedColors.includes(color.id);
            return (
              <button
                key={color.id}
                type="button"
                title={color.name}
                onClick={() => toggleColor(color.id)}
                style={{ backgroundColor: color.hex }}
                className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                  selected ? "ring-2 ring-offset-2 ring-[#1B3A6B]" : "ring-0"
                } ${color.id === "white" ? "border-gray-300" : "border-transparent"}`}
              >
                {selected && <CheckIcon className={color.id === "white" || color.id === "lightblue" ? "text-gray-700" : "text-white"} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">المقاس</h3>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                selectedSize === size
                  ? "bg-[#1B3A6B] text-white border-[#1B3A6B]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#1B3A6B]/40 hover:text-[#1B3A6B]"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">التقييم</h3>
        <div className="space-y-2.5">
          {ratingOptions.map((rating) => (
            <label key={rating} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedRatings.includes(rating)}
                onChange={() => toggleRating(rating)}
                className="w-4 h-4 rounded border-gray-300 text-[#1B3A6B] focus:ring-[#1B3A6B]/30 accent-[#1B3A6B]"
              />
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} filled={i < rating} />
                ))}
              </span>
              <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">{rating} نجوم</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleFilterChange}
        className="w-full bg-[#1B3A6B] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2563EB] transition-colors"
      >
        تطبيق الفلتر
      </button>
    </div>
  );
}
