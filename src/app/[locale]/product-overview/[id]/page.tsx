"use client";
import { useState } from "react";
import Navbar from "@/componant/nav-bar";
import Footer from "@/componant/footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { getLocale } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { getProductById } from "@/data/products";
import Link from "next/link";

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ))}
  </div>
);

const ProductOverview = () => {
  const { id } = useParams();
  const product = getProductById(Number(id));
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const locale = getLocale();

  const handleAddToCart = (e: any) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("يرجى تسجيل الدخول لإضافة المنتج للسلة");
      return;
    }
    addItem(product, quantity);
    toast.success("تمت الإضافة إلى السلة");
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F0F4FF]" dir="rtl">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-500">المنتج غير موجود</p>
          <Link href={`/${locale}/search`} className="mt-4 inline-block text-[#2563EB] hover:underline">
            العودة للتسوق
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4FF] stripe-bg" dir="rtl">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href={`/${locale}`} className="hover:text-[#1B3A6B]">الرئيسية</Link>
          <span>/</span>
          <Link href={`/${locale}/search`} className="hover:text-[#1B3A6B]">المنتجات</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium line-clamp-1">{product.name}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Product Images */}
            <div className="md:w-1/2">
              <div className="bg-gray-50 rounded-2xl overflow-hidden mb-4 aspect-square flex items-center justify-center border border-gray-100">
                <Image
                  src={product.images[selectedImage]?.url ?? product.image}
                  alt={product.name}
                  width={420}
                  height={420}
                  className="w-full h-full object-contain p-4"
                  unoptimized
                />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-[#1B3A6B]" : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <img src={image.url} alt={`${product.name} ${index + 1}`} className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="md:w-1/2">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
              </div>
              <p className="text-gray-400 text-xs mb-3">SKU: {product.sku}</p>

              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={4} />
                <span className="text-gray-400 text-sm">(24 تقييم)</span>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-[#1B3A6B]">{product.price.toLocaleString()} ج.م</span>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

              {/* Quantity Selector */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">الكمية</h3>
                <div className="flex items-center gap-1 w-fit border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center text-gray-800 font-semibold border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 bg-[#1B3A6B] text-white py-3.5 px-6 rounded-xl font-semibold hover:bg-[#2563EB] transition-colors text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  إضافة إلى السلة
                </button>
                <Link
                  href={`/${locale}/shopping-carts`}
                  className="w-full text-center border-2 border-[#1B3A6B] text-[#1B3A6B] py-3 px-6 rounded-xl font-semibold hover:bg-[#EEF4FF] transition-colors text-sm"
                >
                  الشراء الآن
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-100">
                {[
                  { icon: "🛡️", text: "ضمان الجودة" },
                  { icon: "↩️", text: "إرجاع مجاني" },
                  { icon: "🚚", text: "شحن سريع" },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span>{b.icon}</span>
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.product_details.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">المواصفات</h3>
            <div className="divide-y divide-gray-100">
              {product.product_details.map(({ name, id, value }) => (
                <div key={id} className="flex justify-between py-3 text-sm">
                  <span className="text-gray-500">{name}</span>
                  <span className="font-medium text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">آراء العملاء</h3>
          {product.product_review.length === 0 ? (
            <p className="text-gray-400 text-sm">لا توجد تقييمات بعد. كن أول من يقيّم هذا المنتج!</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {product.product_review.map((review, index) => (
                <div key={index} className="py-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#EEF4FF] text-[#1B3A6B] flex items-center justify-center font-bold text-sm">
                      {review.username.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{review.username}</p>
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductOverview;
