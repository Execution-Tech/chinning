"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ecommerceAPI from "@/utils";
import { useRouter } from "next/navigation";
import "./style.css";

interface Banner {
  id: number;
  product_id: number;
  image_url: string;
}

interface ApiResponse {
  status: boolean;
  data?: Banner[];
}

export default function BannerSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await ecommerceAPI.banners.getAll();
        console.log("response", response);
        if (response?.data.status && response?.data.data) {
          setBanners(response?.data.data);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const handleBannerClick = (productId: number) => {
    router.push(`/en/product-overview/${productId}`);
  };

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current && banners.length > 0) {
      const container = scrollContainerRef.current;
      const itemWidth = container.clientWidth;
      container.scrollTo({
        left: index * itemWidth,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (banners.length > 0) {
      let newIndex = currentIndex;
      if (direction === "left") {
        newIndex = Math.max(currentIndex - 1, 0);
      } else {
        newIndex = Math.min(currentIndex + 1, banners.length - 1);
      }
      scrollToIndex(newIndex);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current && banners.length > 0) {
      const container = scrollContainerRef.current;
      const scrollPosition = container.scrollLeft;
      const itemWidth = container.clientWidth;
      const newIndex = Math.round(scrollPosition / itemWidth);

      if (
        newIndex !== currentIndex &&
        newIndex >= 0 &&
        newIndex < banners.length
      ) {
        setCurrentIndex(newIndex);
      }
    }
  };

  // Touch events for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      scroll("right");
    }
    if (touchStart - touchEnd < -75) {
      // Swipe right
      scroll("left");
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);

      // Handle window resize to maintain correct positioning
      const handleResize = () => {
        if (container) {
          scrollToIndex(currentIndex);
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        container.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [currentIndex, banners]);

  // Auto-play functionality (optional)
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % banners.length;
        scrollToIndex(nextIndex);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [currentIndex, banners.length]);

  if (loading)
    return (
      <div className="w-full h-[455px] bg-gray-200 animate-pulse flex items-center justify-center">
        <span className="text-gray-500">Loading banners...</span>
      </div>
    );

  if (!banners.length)
    return (
      <div className="w-full h-[455px] bg-gray-100 flex items-center justify-center">
        <span className="text-gray-500">No banners available</span>
      </div>
    );

  return (
    <div className="relative w-full h-[255px] md:h-[auto] bg-gray-50">
      {/* Main Slider Container */}
      <div className="relative w-full overflow-hidden">
        {/* Left Arrow */}
        {currentIndex > 0 && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-3 transition-all duration-200 hover:scale-110 focus:outline-none backdrop-blur-sm"
            aria-label="Previous banner"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Right Arrow */}
        {currentIndex < banners.length - 1 && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-3 transition-all duration-200 hover:scale-110 focus:outline-none backdrop-blur-sm"
            aria-label="Next banner"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {/* Scrollable Container - Full Width */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {banners.map((banner) => (
            <div
              key={banner.id}
              onClick={() => handleBannerClick(banner.product_id)}
              className="flex-shrink-0 w-full h-[255px] md:h-[455px] sm:h-[200px] snap-start cursor-pointer relative"
            >
              <Image
                src={banner.image_url}
                alt={`Banner ${banner.id}`}
                fill
                priority={banner.id === banners[0]?.id}
                className="object-cover "
                style={{ objectFit: "fill" }}
              />
              {/* Optional overlay for better text readability */}
              <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-colors" />
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80"
              } h-2 rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Current Slide Counter */}
        <div className="absolute top-4 right-4 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
          {currentIndex + 1} / {banners.length}
        </div>
      </div>
    </div>
  );
}
