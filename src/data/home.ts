// Demo data for the home page sections (categories, flash deals, best sellers)

export const homeCategories = [
  { id: 101, name: "تلفزيونات", emoji: "📺" },
  { id: 102, name: "موبيلات", emoji: "📱" },
  { id: 103, name: "اجهزة منزلية", emoji: "🏠" },
  { id: 104, name: "ملابس الرجال", emoji: "👔", badge: "جديد" },
  { id: 105, name: "احذية", emoji: "👟" },
  { id: 106, name: "شنط", emoji: "👜" },
  { id: 107, name: "العاب الفيديو", emoji: "🎮" },
  { id: 108, name: "أجهزة المطبخ", emoji: "🍳" },
  { id: 109, name: "أجهزة كهربائية", emoji: "🔌" },
];

export type DealItem = {
  id: number;
  name: string;
  image: string;
  discount: number;
};

export const megaOffers: DealItem[] = [
  { id: 201, name: "عروض الساعات", image: "https://placehold.co/300x300/1f2937/ffffff?text=Smart+Watch", discount: 60 },
  { id: 202, name: "عروض الساعات", image: "https://placehold.co/300x300/111827/ffffff?text=Smart+Watch", discount: 60 },
  { id: 203, name: "عروض الساعات", image: "https://placehold.co/300x300/1f2937/ffffff?text=Smart+Watch", discount: 60 },
];

export const saverOffers: DealItem[] = [
  { id: 211, name: "عروض الساعات", image: "https://placehold.co/300x300/1f2937/ffffff?text=Smart+Watch", discount: 60 },
  { id: 212, name: "عروض الساعات", image: "https://placehold.co/300x300/111827/ffffff?text=Smart+Watch", discount: 60 },
  { id: 213, name: "عروض الساعات", image: "https://placehold.co/300x300/1f2937/ffffff?text=Smart+Watch", discount: 60 },
  { id: 214, name: "عروض السماعات", image: "https://placehold.co/300x300/e5e7eb/1f2937?text=Earbuds", discount: 60 },
];

export type BestSellerItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  inCart?: boolean;
};

export const mostOrderedRow1: BestSellerItem[] = [
  { id: 301, name: "مصباح مكتب LED", image: "https://placehold.co/300x300/ffffff/1B3A6B?text=LED+Lamp", price: 1223, originalPrice: 2920, discount: 60, inCart: true },
  { id: 302, name: "دراجة كهربائية قابلة للطي", image: "https://placehold.co/300x300/ffffff/1B3A6B?text=E-Bike", price: 1223, originalPrice: 2920, discount: 60 },
  { id: 303, name: "سكوتر كهربائي للأطفال", image: "https://placehold.co/300x300/ffffff/1B3A6B?text=E-Scooter", price: 1223, originalPrice: 2920, discount: 60 },
  { id: 304, name: "دراجة كهربائية رياضية", image: "https://placehold.co/300x300/ffffff/1B3A6B?text=E-Bike", price: 1223, originalPrice: 2920, discount: 60 },
  { id: 305, name: "دراجة كهربائية للمدينة", image: "https://placehold.co/300x300/ffffff/1B3A6B?text=E-Bike", price: 1223, originalPrice: 2920, discount: 60 },
  { id: 306, name: "دراجة جبلية رياضية", image: "https://placehold.co/300x300/ffffff/1B3A6B?text=Bicycle", price: 1223, originalPrice: 2920, discount: 60 },
];

export const mostOrderedRow2: BestSellerItem[] = [
  { id: 311, name: "دراجة هوائية للطرق الجبلية", image: "https://placehold.co/300x300/ffffff/1B3A6B?text=Bicycle", price: 1223, originalPrice: 2920, discount: 60 },
  { id: 312, name: "دراجة هوائية رياضية", image: "https://placehold.co/300x300/ffffff/1B3A6B?text=Bicycle", price: 1223, originalPrice: 2920, discount: 60 },
  { id: 313, name: "دراجة هوائية للسيدات", image: "https://placehold.co/300x300/ffffff/1B3A6B?text=Bicycle", price: 1223, originalPrice: 2920, discount: 60 },
  { id: 314, name: "دراجة هوائية للأطفال", image: "https://placehold.co/300x300/ffffff/1B3A6B?text=Bicycle", price: 1223, originalPrice: 2920, discount: 60 },
  { id: 315, name: "دراجة هوائية كلاسيك", image: "https://placehold.co/300x300/ffffff/1B3A6B?text=Bicycle", price: 1223, originalPrice: 2920, discount: 60 },
  { id: 316, name: "دراجة هوائية للتمرين", image: "https://placehold.co/300x300/ffffff/1B3A6B?text=Bicycle", price: 1223, originalPrice: 2920, discount: 60 },
];
