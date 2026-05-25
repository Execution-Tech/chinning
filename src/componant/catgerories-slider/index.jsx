"use client";
import React, { useState } from "react";
import { Virtual, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { topOffers } from "@/data/products";
import { getLocale } from "@/context/AuthContext";

const CategoriesSlider = () => {
  const [swiperRef, setSwiperRef] = useState(null);
  const router = useRouter();
  const locale = getLocale();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">أفضل العروض</h2>
        <button
          onClick={() => router.push(`/${locale}/search`)}
          className="text-sm text-[#2563EB] hover:underline font-medium"
        >
          عرض الكل
        </button>
      </div>

      <div className="px-2 py-4">
        <Swiper
          modules={[Virtual, Navigation, Pagination]}
          onSwiper={setSwiperRef}
          slidesPerView={2}
          breakpoints={{
            480: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          spaceBetween={12}
          navigation={true}
          className="mySwiper py-2 px-6 cursor-pointer"
          virtual
        >
          {topOffers.map((item) => (
            <SwiperSlide
              key={item.id}
              virtualIndex={item.id}
              onClick={() => router.push(`/${locale}/product-overview/${item.id}`)}
            >
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 hover:border-[#1B3A6B]/30 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="aspect-square flex items-center justify-center mb-2 bg-white rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={120}
                    height={120}
                    className="object-contain w-full h-full"
                    unoptimized
                  />
                </div>
                <p className="text-xs text-gray-700 font-medium line-clamp-2 mb-1">{item.name}</p>
                <span className="text-sm font-bold text-[#1B3A6B]">
                  {item.price.toLocaleString()} ج.م
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CategoriesSlider;
