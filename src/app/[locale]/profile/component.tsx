"use client";

import Navbar from "@/componant/nav-bar";
import Footer from "@/componant/footer";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import ecommerceAPI from "@/utils";

type OrderStatus =
  | "received"
  | "ready"
  | "on_way"
  | "delivered"
  | "cancelled"
  | "return_request"
  | "returned";

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  }[];
  total: number;
  createdAt: string;
}

interface FavoriteItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

// Status badge colors
const statusConfig: Record<OrderStatus, { color: string; bgColor: string }> = {
  received: { color: "text-green-600", bgColor: "bg-green-50" },
  ready: { color: "text-blue-600", bgColor: "bg-blue-50" },
  on_way: { color: "text-orange-600", bgColor: "bg-orange-50" },
  delivered: { color: "text-green-600", bgColor: "bg-green-50" },
  cancelled: { color: "text-red-600", bgColor: "bg-red-50" },
  return_request: { color: "text-yellow-600", bgColor: "bg-yellow-50" },
  returned: { color: "text-gray-600", bgColor: "bg-gray-50" },
};

const statusTransKey: Record<OrderStatus, string> = {
  received: "received",
  ready: "ready",
  on_way: "onWay",
  delivered: "delivered",
  cancelled: "cancelled",
  return_request: "returnRequest",
  returned: "returned",
};

// Sidebar Menu Item Component
const SidebarMenuItem = ({
  icon,
  label,
  isActive,
  onClick,
  isDanger = false,
}: {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  isDanger?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? "bg-[#E8F5EE] text-[#4ABD86]"
        : isDanger
          ? "text-red-500 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    <span
      className={`w-10 h-10 flex items-center justify-center rounded-full ${
        isActive
          ? "bg-[#4ABD86] text-white"
          : isDanger
            ? "bg-red-100 text-red-500"
            : "bg-gray-100 text-gray-500"
      }`}
    >
      {icon}
    </span>
    <span className="font-medium">{label}</span>
    {!isDanger && (
      <svg
        className="w-5 h-5 ms-auto text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    )}
  </button>
);

// User Info Card Component
const UserInfoCard = ({
  user,
  hi,
  noPhone,
}: {
  user: { name: string; phone: string } | null;
  hi: string;
  noPhone: string;
}) => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
      <svg
        className="w-6 h-6 text-gray-500"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
    <div>
      <p className="font-semibold text-gray-800">
        {hi} {user?.name}
      </p>
      <p className="text-gray-500 text-sm">{user?.phone || noPhone}</p>
    </div>
  </div>
);

// Stats Card Component
const StatsCard = ({
  label,
  value,
  hasArrow = false,
}: {
  label: string;
  value: string;
  hasArrow?: boolean;
}) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
    {hasArrow && (
      <svg
        className="w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    )}
  </div>
);

// Order Card Component
const OrderCard = ({
  order,
  onViewOrder,
  onCancelOrder,
  onReturnOrder,
  t,
  tStatus,
}: {
  order: Order;
  onViewOrder: (orderId: string) => void;
  onCancelOrder?: (orderId: string) => void;
  onReturnOrder?: (orderId: string) => void;
  t: (key: string) => string;
  tStatus: (key: string) => string;
}) => {
  const status = statusConfig[order.status];
  const canCancel = ["received", "ready"].includes(order.status);
  const canReturn = ["delivered"].includes(order.status);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-600">
          {t("ordersLabel")}{" "}
          <span className="font-semibold">#{order.orderNumber}</span>
        </p>
        <span className={`text-sm ${status.color}`}>
          {tStatus(statusTransKey[order.status])}
        </span>
      </div>

      {order.items.map((item) => (
        <div key={item.id} className="flex gap-4 mb-4">
          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={item.image || "/placeholder.png"}
              alt={item.name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-800">{item.name}</h4>
            <p className="text-sm text-gray-500 line-clamp-2">
              {item.description}
            </p>
            <p className="font-semibold text-[#4ABD86] mt-2">
              {item.price.toLocaleString()} <span className="text-sm">EGP</span>
            </p>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
        <button
          onClick={() => onViewOrder(order.id)}
          className="flex items-center gap-2 text-[#4ABD86] hover:underline"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          {t("viewOrder")}
        </button>

        {canCancel && onCancelOrder && (
          <button
            onClick={() => onCancelOrder(order.id)}
            className="flex items-center gap-2 text-red-500 hover:underline"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            {t("cancelOrder")}
          </button>
        )}

        {canReturn && onReturnOrder && (
          <button
            onClick={() => onReturnOrder(order.id)}
            className="flex items-center gap-2 text-orange-500 hover:underline"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            {t("returnOrder")}
          </button>
        )}
      </div>
    </div>
  );
};

// Favorite Item Card Component
const FavoriteItemCard = ({
  item,
  onRemove,
  onClick,
}: {
  item: FavoriteItem;
  onRemove: (itemId: string) => void;
  onClick: (itemId: string) => void;
}) => (
  <div
    className="bg-white rounded-lg border border-gray-200 p-4 flex gap-4 cursor-pointer hover:shadow-md transition-shadow"
    onClick={() => onClick(item.id)}
  >
    <div className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
      <Image
        src={item.image || "/placeholder.png"}
        alt={item.name}
        width={112}
        height={112}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-1">
      <h4 className="font-medium text-gray-800">{item.name}</h4>
      <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
      <p className="font-semibold text-[#4ABD86] mt-2">
        {item.price.toLocaleString()} <span className="text-sm">EGP</span>
      </p>
    </div>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onRemove(item.id);
      }}
      className="w-10 h-10 flex items-center justify-center border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors self-start"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  </div>
);

// Main Profile Container Component
// export const ProfileContainer = () => {
//   const { user, logout, isAuthenticated, isLoading } = useAuth();
//   const router = useRouter();
//   const locale = useLocale();
//   const t = useTranslations("Profile");
//   const tStatus = useTranslations("OrderStatus");
//   const [activeTab, setActiveTab] = useState<"orders" | "favorites">("orders");
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
//   const [loadingOrders, setLoadingOrders] = useState(false);
//   const [loadingFavorites, setLoadingFavorites] = useState(false);

//   // Mock data for demonstration - replace with actual API calls
//   useEffect(() => {
//     if (activeTab === "orders") {
//       fetchOrders();
//     } else {
//       fetchFavorites();
//     }
//   }, [activeTab]);

//   const fetchOrders = async () => {
//     setLoadingOrders(true);
//     try {
//       const response = await ecommerceAPI.orders.getAll();
//       if (response.data?.data) {
//         setOrders(
//           response.data.data.map((order: any) => ({
//             id: order.id,
//             orderNumber: order.order_number || order.id,
//             status: order.status || "received",
//             items: order.items || [],
//             total: order.total || 0,
//             createdAt: order.created_at,
//           })),
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       // Set mock data for demonstration
//       setOrders([
//         {
//           id: "1",
//           orderNumber: "1234567",
//           status: "received",
//           items: [
//             {
//               id: "1",
//               name: "Samsung 65 Inch",
//               description: "4K UHD Smart LED TV with Built-i",
//               price: 23313,
//               image: "/placeholder.png",
//             },
//           ],
//           total: 23313,
//           createdAt: new Date().toISOString(),
//         },
//       ]);
//     } finally {
//       setLoadingOrders(false);
//     }
//   };

//   const fetchFavorites = async () => {
//     setLoadingFavorites(true);
//     try {
//       const response = await ecommerceAPI.wishlist.get();
//       if (response.data?.data) {
//         setFavorites(
//           response.data.data.map((item: any) => ({
//             id: item.id,
//             name: item.name || item.product?.name,
//             description: item.description || item.product?.description,
//             price: item.price || item.product?.price,
//             image: item.image || item.product?.image,
//           })),
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching favorites:", error);
//       // Set mock data for demonstration
//       setFavorites([
//         {
//           id: "1",
//           name: "Samsung 65 Inch",
//           description: "4K UHD Smart LED TV with Built-i",
//           price: 23313,
//           image: "/placeholder.png",
//         },
//       ]);
//     } finally {
//       setLoadingFavorites(false);
//     }
//   };

//   const handleViewOrder = (orderId: string) => {
//     router.push(`/${locale}/orders/${orderId}`);
//   };

//   const handleCancelOrder = async (orderId: string) => {
//     try {
//       await ecommerceAPI.orders.cancel(orderId);
//       fetchOrders();
//     } catch (error) {
//       console.error("Error cancelling order:", error);
//     }
//   };

//   const handleReturnOrder = async (orderId: string) => {
//     // Implement return order logic
//     console.log("Return order:", orderId);
//   };

//   const handleRemoveFavorite = async (itemId: string) => {
//     try {
//       await ecommerceAPI.wishlist.removeItem(itemId);
//       setFavorites(favorites.filter((item) => item.id !== itemId));
//     } catch (error) {
//       console.error("Error removing favorite:", error);
//     }
//   };

//   const handleFavoriteClick = (itemId: string) => {
//     router.push(`/${locale}/product-overview/${itemId}`);
//   };

//   const handleLogout = async () => {
//     await logout();
//     router.push(`/${locale}`);
//   };

//   const handleDeleteAccount = () => {
//     if (confirm(t("deleteConfirm"))) {
//       // Call delete account API
//       console.log("Delete account");
//     }
//   };

//   // Redirect to login if not authenticated
//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       router.push(`/${locale}?signIn=true`);
//     }
//   }, [isAuthenticated, isLoading, router]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4ABD86]"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar />
//       <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 py-6 gap-6">
//         {/* Sidebar */}
//         <aside className="w-full md:w-72 flex-shrink-0">
//           <div className="bg-white rounded-lg p-4 space-y-2">
//             <SidebarMenuItem
//               icon={
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                   />
//                 </svg>
//               }
//               label={t("myOrders")}
//               isActive={activeTab === "orders"}
//               onClick={() => setActiveTab("orders")}
//             />
//             <SidebarMenuItem
//               icon={
//                 <svg
//                   className="w-5 h-5"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
//                 </svg>
//               }
//               label={t("myFavorites")}
//               isActive={activeTab === "favorites"}
//               onClick={() => setActiveTab("favorites")}
//             />
//             <SidebarMenuItem
//               icon={
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                   />
//                 </svg>
//               }
//               label={t("logout")}
//               onClick={handleLogout}
//             />
//             <SidebarMenuItem
//               icon={
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                   />
//                 </svg>
//               }
//               label={t("deleteAccount")}
//               isDanger
//               onClick={handleDeleteAccount}
//             />
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1">
//           {/* User Info Section */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             <UserInfoCard user={user} hi={t("hi")} noPhone={t("noPhone")} />
//             <StatsCard label={t("availableLimit")} value="EGP 15,000" />
//             <StatsCard label={t("myPoints")} value="EGP 15,000" hasArrow />
//             {/* <StatsCard label={t("myPoints")} value={"0"} hasArrow /> */}
//           </div>

//           {/* Orders or Favorites Content */}
//           {activeTab === "orders" ? (
//             <div>
//               <h2 className="text-xl font-bold text-gray-800 mb-4">
//                 {t("myOrders")}
//               </h2>
//               {loadingOrders ? (
//                 <div className="flex justify-center py-12">
//                   <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4ABD86]"></div>
//                 </div>
//               ) : orders.length === 0 ? (
//                 <div className="bg-white rounded-lg p-12 text-center">
//                   <svg
//                     className="w-16 h-16 mx-auto text-gray-300 mb-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                     />
//                   </svg>
//                   <p className="text-gray-500">{t("noOrders")}</p>
//                 </div>
//               ) : (
//                 orders.map((order) => (
//                   <OrderCard
//                     key={order.id}
//                     order={order}
//                     onViewOrder={handleViewOrder}
//                     onCancelOrder={handleCancelOrder}
//                     onReturnOrder={handleReturnOrder}
//                     t={t}
//                     tStatus={tStatus}
//                   />
//                 ))
//               )}
//             </div>
//           ) : (
//             <div>
//               <h2 className="text-xl font-bold text-gray-800 mb-4">
//                 {t("myFavorites")}
//               </h2>
//               {loadingFavorites ? (
//                 <div className="flex justify-center py-12">
//                   <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4ABD86]"></div>
//                 </div>
//               ) : favorites.length === 0 ? (
//                 <div className="bg-white rounded-lg p-12 text-center">
//                   <svg
//                     className="w-16 h-16 mx-auto text-gray-300 mb-4"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
//                   </svg>
//                   <p className="text-gray-500">{t("noFavorites")}</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {favorites.map((item) => (
//                     <FavoriteItemCard
//                       key={item.id}
//                       item={item}
//                       onRemove={handleRemoveFavorite}
//                       onClick={handleFavoriteClick}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </main>
//       </div>
//       <Footer />
//     </div>
//   );
// };
