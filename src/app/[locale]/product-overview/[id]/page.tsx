"use client";
import { useEffect, useState } from "react";
import Navbar from "@/componant/nav-bar";
import Footer from "@/componant/footer";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { getLocale } from "@/context/AuthContext";
import { toast } from "react-toastify";
import ecommerceAPI, { axiosClient } from "@/utils";
import Link from "next/link";

interface InstallmentPlan {
  id: number;
  name: string;
  installment_rate: number;
  installment_duration: number;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ))}
  </div>
);

const SkeletonLoader = () => (
  <div className="min-h-screen bg-[#F0F4FF]" dir="rtl">
    <Navbar />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-64 mb-6" />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="aspect-square bg-gray-200 rounded-2xl mb-4" />
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl" />)}
            </div>
          </div>
          <div className="md:w-1/2 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/4" />
            <div className="h-10 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-5/6" />
            <div className="h-12 bg-gray-200 rounded-xl w-full mt-4" />
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

const ProductOverview = () => {
  const { id } = useParams();
  const router = useRouter();
  const locale = getLocale();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [plans, setPlans] = useState<InstallmentPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`products/${id}`);
        setProduct(response.data?.data || response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "فشل في تحميل المنتج");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch installment plans
  useEffect(() => {
    ecommerceAPI.installmentPlans.getAll()
      .then((r: any) => {
        const data = r.data?.data || [];
        setPlans(data);
        if (data.length > 0) setSelectedPlanId(data[0].id);
      })
      .catch(() => {});
  }, []);

  const calcMonthlyPayment = (plan: InstallmentPlan) => {
    const price = parseFloat(product?.price || "0");
    const totalWithRate = price + price * (plan.installment_rate / 100) * plan.installment_duration;
    return Math.ceil(totalWithRate / plan.installment_duration);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("يرجى تسجيل الدخول لإضافة المنتج للسلة");
      return;
    }
    addItem(product, quantity);
    setAddedToCart(true);
  };

  if (loading) return <SkeletonLoader />;

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F0F4FF]" dir="rtl">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-500">{error || "المنتج غير موجود"}</p>
          <Link href={`/${locale}/search`} className="mt-4 inline-block text-[#2563EB] hover:underline">
            العودة للتسوق
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images: { url: string }[] = product.images?.length
    ? product.images
    : [{ url: product.image_url || product.image || "" }];

  const reviews: any[] = product.product_review || [];
  const specs: any[] = product.product_details || [];
  const avgRating = reviews.length
    ? Math.round(reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#F0F4FF]" dir="rtl">
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

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row gap-8">

            {/* Images */}
            <div className="md:w-1/2">
              <div className="bg-gray-50 rounded-2xl overflow-hidden mb-4 aspect-square flex items-center justify-center border border-gray-100">
                {images[selectedImage]?.url ? (
                  <Image
                    src={images[selectedImage].url}
                    alt={product.name}
                    width={420}
                    height={420}
                    className="w-full h-full object-contain p-4"
                    unoptimized
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="w-24 h-24 text-gray-300">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((image, index) => (
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
              )}
            </div>

            {/* Details */}
            <div className="md:w-1/2">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
              {product.sku && (
                <p className="text-gray-400 text-xs mb-3">SKU: {product.sku}</p>
              )}

              <div className="flex items-center gap-3 mb-4">
                <StarRating rating={avgRating} />
                {reviews.length > 0 && (
                  <span className="text-gray-400 text-sm">({reviews.length} تقييم)</span>
                )}
              </div>

              <div className="mb-5">
                <span className="text-3xl font-bold text-[#1B3A6B]">
                  {parseFloat(product.price).toLocaleString()} ج.م
                </span>
              </div>

              {product.description && (
                <p
                  className="text-gray-600 text-sm leading-relaxed mb-5"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}

              {/* Installment plans */}
              {plans.length > 0 && (
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    خطة التقسيط
                  </label>
                  <select
                    className="block w-full px-3 py-2.5 text-sm border border-[#1B3A6B]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3A6B]/30 text-gray-700 bg-white"
                    defaultValue={plans[0]?.id}
                    onChange={(e) => setSelectedPlanId(Number(e.target.value))}
                  >
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} — {calcMonthlyPayment(plan).toLocaleString()} ج.م / شهر
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quantity */}
              {!addedToCart && (
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
              )}

              {/* CTA buttons */}
              <div className="flex flex-col gap-3">
                {addedToCart ? (
                  <button
                    onClick={() => router.push(`/${locale}/shopping-carts`)}
                    className="w-full flex items-center justify-center gap-2 border-2 border-[#1B3A6B] text-[#1B3A6B] py-3.5 px-6 rounded-xl font-semibold hover:bg-[#EEF4FF] transition-colors text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    الذهاب إلى السلة
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-2 bg-[#1B3A6B] text-white py-3.5 px-6 rounded-xl font-semibold hover:bg-[#2563EB] transition-colors text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    إضافة إلى السلة
                  </button>
                )}
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
        {specs.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">المواصفات</h3>
            <div className="divide-y divide-gray-100">
              {specs.map(({ name, id: specId, value }: any) => (
                <div key={specId} className="flex justify-between py-3 text-sm">
                  <span className="text-gray-500">{name}</span>
                  <span className="font-medium text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About product */}
        {product.description && (
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">عن المنتج</h3>
            <div
              className="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        )}

        {/* Reviews */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">آراء العملاء</h3>
          {reviews.length === 0 ? (
            <p className="text-gray-400 text-sm">لا توجد تقييمات بعد. كن أول من يقيّم هذا المنتج!</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {reviews.map((review: any, index: number) => (
                <div key={index} className="py-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#EEF4FF] text-[#1B3A6B] flex items-center justify-center font-bold text-sm">
                      {(review.username || "م").charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{review.username || "مجهول"}</p>
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
