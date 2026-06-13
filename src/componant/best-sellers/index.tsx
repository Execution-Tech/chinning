"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getLocale } from "@/context/AuthContext";
import { BestSellerItem } from "@/data/home";

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

const CartBadgeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

const BestSellerCard = ({ item }: { item: BestSellerItem }) => {
  const router = useRouter();
  const locale = getLocale();
  const [qty, setQty] = useState(item.inCart ? 1 : 0);

  return (
    <div className="group">
      <div
        onClick={() => router.push(`/${locale}/product-overview/${item.id}`)}
        className="relative bg-gray-50 rounded-xl border border-gray-100 aspect-square overflow-hidden mb-2 cursor-pointer group-hover:border-[#1B3A6B]/30 group-hover:shadow-md transition-all"
      >
        <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10">
          خصم {item.discount}%
        </span>
        <Image
          src={item.image}
          alt={item.name}
          width={150}
          height={150}
          unoptimized
          className="object-cover w-full h-full"
        />
        <span className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center z-10">
          <CartBadgeIcon />
        </span>

        {qty > 0 ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-2 right-2 flex items-center gap-1 bg-white rounded-full shadow px-1.5 py-1 z-10"
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
            }}
            className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-[#1B3A6B] text-white flex items-center justify-center shadow z-10 hover:bg-[#2563EB] transition-colors"
          >
            <PlusIcon />
          </button>
        )}
      </div>
      <p className="text-xs text-gray-700 font-medium line-clamp-2 mb-1">{item.name}</p>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-gray-900">{item.price.toLocaleString()} ج.م</span>
        <span className="text-xs text-gray-400 line-through">{item.originalPrice.toLocaleString()} ج.م</span>
      </div>
    </div>
  );
};

const BestSellersRow = ({ title, items }: { title: string; items: BestSellerItem[] }) => {
  const router = useRouter();
  const locale = getLocale();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <button
          onClick={() => router.push(`/${locale}/search`)}
          className="flex items-center gap-1 text-sm text-[#2563EB] hover:underline font-medium"
        >
          عرض الكل
          <ArrowLeftIcon />
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {items.map((item) => (
          <BestSellerCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default BestSellersRow;
