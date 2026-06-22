"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getLocale } from "@/context/AuthContext";
import { axiosClient } from "@/utils";

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const pad = (n: number) => n.toString().padStart(2, "0");

const useCountdown = (startSeconds: number) => {
  const [seconds, setSeconds] = useState(startSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : startSeconds));
    }, 1000);
    return () => clearInterval(interval);
  }, [startSeconds]);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return { hours, minutes, secs };
};

const CountdownBoxes = ({ startSeconds }: { startSeconds: number }) => {
  const { hours, minutes, secs } = useCountdown(startSeconds);

  return (
    <div className="flex items-center gap-1.5">
      {[hours, minutes, secs].map((value, idx) => (
        <span key={idx} className="bg-black/25 rounded-md text-xs font-bold px-2 py-1 min-w-[28px] text-center">
          {pad(value)}
        </span>
      ))}
    </div>
  );
};

const DealProductCard = ({ item }: { item: any }) => {
  const router = useRouter();
  const locale = getLocale();

  return (
    <div
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
          className="object-cover w-full h-full"
        />
      </div>
      <p className="text-xs text-gray-700 font-medium text-center line-clamp-2">{item.name}</p>
      <span className="text-xs font-bold text-[#1B3A6B] mt-1 block text-center">
        {Number(item.price).toLocaleString()} ج.م
      </span>
    </div>
  );
};

const FlashDeals = () => {
  const [topOffers, setTopOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopOffers = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("tops");
        setTopOffers(response.data?.data?.top_offers || []);
      } catch (err) {
        console.error("Error fetching top offers:", err);
        setTopOffers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTopOffers();
  }, []);

  if (loading || topOffers.length === 0) return null;

  const half = Math.ceil(topOffers.length / 2);
  const firstHalf = topOffers.slice(0, half);
  const secondHalf = topOffers.slice(half);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {firstHalf.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 pt-4">
            <h3 className="font-bold text-gray-800 text-lg mb-3">عروض مميزة</h3>
            <div className="rounded-xl px-4 py-2.5 flex items-center justify-between text-white bg-gradient-to-l from-[#1B3A6B] to-[#0F172A]">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <ClockIcon />
                عروض لفترة محدودة
              </div>
              <CountdownBoxes startSeconds={19 * 3600 + 19 * 60 + 19} />
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-4">
            {firstHalf.map((item: any) => (
              <DealProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
      {secondHalf.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 pt-4">
            <h3 className="font-bold text-gray-800 text-lg mb-3">عروض التوفير</h3>
            <div className="rounded-xl px-4 py-2.5 flex items-center justify-between text-white bg-gradient-to-l from-[#1B3A6B] to-[#0EA5A6]">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <ClockIcon />
                عروض لفترة محدودة
              </div>
              <CountdownBoxes startSeconds={19 * 3600 + 19 * 60 + 19} />
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-4">
            {secondHalf.map((item: any) => (
              <DealProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashDeals;
