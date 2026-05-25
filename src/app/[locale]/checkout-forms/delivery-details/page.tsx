"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import AddAddressModal, {
  AddressData,
} from "@/componant/checkout-modal/AddAddressModal";
import ecommerceAPI from "@/utils";

interface Address {
  id: number;
  full_name: string;
  phone: string;
  governorate_id: number;
  area: string;
  building: string;
  apartment: string;
}

interface Store {
  id: number;
  name: string;
  description: string | null;
  latitude: string;
  longitude: string;
  working_from: string;
  working_to: string;
}

// Governorate names mapping
const governorateNames: Record<number, string> = {
  1: "Cairo",
  2: "Alexandria",
  3: "Giza",
  4: "Sharm El Sheikh",
  5: "Hurghada",
  6: "Luxor",
  7: "Aswan",
  8: "Port Said",
  9: "Suez",
  10: "Mansoura",
};

export default function DeliveryDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("Checkout");
  const [deliveryType, setDeliveryType] = useState<"doorstep" | "store">(
    "doorstep",
  );
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [storesLoading, setStoresLoading] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);
  // Fetch addresses from API

  const searchParams = useSearchParams();
  const paymentMethod = searchParams.get("paymentMethod");
  useEffect(() => {
    fetchAddresses();
    fetchStores();
    ecommerceAPI.addresses
      .getShippingFees()
      .then((response) => {
        setDeliveryFee(response.data?.data?.shipping);
      })
      .catch((error) => {
        console.error("Failed to fetch shipping fees:", error);
      });
  }, []);

  // Load checkout data from sessionStorage
  useEffect(() => {
    const checkoutData = sessionStorage.getItem("checkoutData");
    if (checkoutData) {
      const data = JSON.parse(checkoutData);
      if (data.deliveryType) setDeliveryType(data.deliveryType);
      if (data.selectedAddress)
        setSelectedAddressId(Number(data.selectedAddress));
    }
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await ecommerceAPI.addresses.getAll();
      if (response.data?.data) {
        setAddresses(response.data.data);
        // Select first address by default if none selected
        if (response.data.data.length > 0 && !selectedAddressId) {
          setSelectedAddressId(response.data.data[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    setStoresLoading(true);
    try {
      const response = await ecommerceAPI.stores.getAll();
      if (response.data?.data) {
        setStores(response.data.data);
        if (response.data.data.length > 0 && !selectedStoreId) {
          setSelectedStoreId(response.data.data[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    } finally {
      setStoresLoading(false);
    }
  };

  const handleAddAddress = (newAddress: AddressData) => {
    if (newAddress.id) {
      const address: Address = {
        id: newAddress.id,
        full_name: newAddress.full_name,
        phone: newAddress.phone,
        governorate_id: newAddress.governorate_id,
        area: newAddress.area,
        building: newAddress.building,
        apartment: newAddress.apartment,
      };
      setAddresses([...addresses, address]);
      setSelectedAddressId(address.id);
    }
    setShowAddAddressModal(false);
    // Refetch to ensure we have the latest data
    fetchAddresses();
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await ecommerceAPI.addresses.delete(id);
      setAddresses(addresses.filter((addr) => addr.id !== id));
      if (selectedAddressId === id) {
        const remaining = addresses.filter((addr) => addr.id !== id);
        setSelectedAddressId(remaining[0]?.id || null);
      }
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  const getGovernorateName = (id: number) => {
    return governorateNames[id] || `Governorate ${id}`;
  };

  const handleContinue = () => {
    // Get existing checkout data
    const existingData = sessionStorage.getItem("checkoutData");
    const checkoutData = existingData ? JSON.parse(existingData) : {};

    // Update with delivery details
    const updatedData = {
      ...checkoutData,
      paymentMethod,
      deliveryType,
      selectedAddress: deliveryType === "doorstep" ? selectedAddressId : null,
      selectedStore: deliveryType === "store" ? selectedStoreId : null,
    };

    sessionStorage.setItem("checkoutData", JSON.stringify(updatedData));

    // Navigate to payment info if payment method is installments, otherwise go to order summary
    if (paymentMethod == "installments") {
      router.push(`/${locale}/checkout-forms/payment-info`);
    } else {
      router.push(`/${locale}/checkout-forms`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {t("deliveryDetails")}
      </h2>

      {/* Delivery Type Selection */}
      <div className="mb-6">
        {/* Doorstep Delivery */}
        <div
          className={`flex items-center justify-between p-4 rounded-lg border-2 mb-4 cursor-pointer ${
            deliveryType === "doorstep"
              ? "border-[#4ABD86] bg-[#E8F5EE]"
              : "border-gray-200"
          }`}
          onClick={() => setDeliveryType("doorstep")}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                deliveryType === "doorstep"
                  ? "border-[#4ABD86]"
                  : "border-gray-300"
              }`}
            >
              {deliveryType === "doorstep" && (
                <div className="w-3 h-3 rounded-full bg-[#4ABD86]"></div>
              )}
            </div>
            <span className="font-medium text-[#4ABD86]">
              {t("doorstepDelivery")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#4ABD86]">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <span className="font-semibold">{(deliveryFee ?? 0).toLocaleString()} EGP</span>
          </div>
        </div>

        {/* Address Cards - Show only if doorstep delivery is selected */}
        {deliveryType === "doorstep" && (
          <div className="space-y-3 mb-4">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#4ABD86]"></div>
              </div>
            ) : addresses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                {t("noSavedAddresses")}
              </p>
            ) : (
              addresses.map((address) => (
                <div
                  key={address.id}
                  className={`p-4 rounded-lg border-2 ${
                    selectedAddressId === address.id
                      ? "border-[#4ABD86] bg-[#E8F5EE]"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 cursor-pointer ${
                          selectedAddressId === address.id
                            ? "border-[#4ABD86]"
                            : "border-gray-300"
                        }`}
                        onClick={() => setSelectedAddressId(address.id)}
                      >
                        {selectedAddressId === address.id && (
                          <div className="w-3 h-3 rounded-full bg-[#4ABD86]"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {t("deliveryAddress")}
                        </h4>
                        <p className="text-gray-700 font-medium">
                          {address.full_name}
                        </p>
                        <p className="text-gray-600">{address.phone}</p>
                        <p className="text-gray-600">
                          {getGovernorateName(address.governorate_id)},{" "}
                          {address.area}
                        </p>
                        <p className="text-gray-600">
                          {address.building}, {t("apt")} {address.apartment}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Delete address"
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
                  </div>
                </div>
              ))
            )}

            {/* Add New Address Button */}
            <button
              onClick={() => setShowAddAddressModal(true)}
              className="w-full p-4 border-2 border-dashed border-[#4ABD86] rounded-lg text-[#4ABD86] font-medium hover:bg-[#E8F5EE] transition flex items-center justify-center gap-2"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {t("addNewAddress")}
            </button>
          </div>
        )}

        {/* Store Pickup */}
        <div
          className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer ${
            deliveryType === "store"
              ? "border-[#4ABD86] bg-[#E8F5EE]"
              : "border-gray-200"
          }`}
          onClick={() => setDeliveryType("store")}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                deliveryType === "store"
                  ? "border-[#4ABD86]"
                  : "border-gray-300"
              }`}
            >
              {deliveryType === "store" && (
                <div className="w-3 h-3 rounded-full bg-[#4ABD86]"></div>
              )}
            </div>
            <span className="font-medium text-gray-800">{t("storePickup")}</span>
          </div>
          <div className="flex items-center gap-2 text-[#4ABD86]">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="font-semibold">{t("free")}</span>
          </div>
        </div>

        {/* Store Cards - Show only if store pickup is selected */}
        {deliveryType === "store" && (
          <div className="space-y-3 mt-4">
            {storesLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#4ABD86]"></div>
              </div>
            ) : stores.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                {t("noStoresAvailable")}
              </p>
            ) : (
              stores.map((store) => (
                <div
                  key={store.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedStoreId === store.id
                      ? "border-[#4ABD86] bg-[#E8F5EE]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedStoreId(store.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
                        selectedStoreId === store.id
                          ? "border-[#4ABD86]"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedStoreId === store.id && (
                        <div className="w-3 h-3 rounded-full bg-[#4ABD86]"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {store.name}
                      </h4>
                      {store.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {store.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 text-[#4ABD86]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          {store.working_from} - {store.working_to}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-[#4ABD86]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={
          (deliveryType === "doorstep" && !selectedAddressId) ||
          (deliveryType === "store" && !selectedStoreId)
        }
        className="w-full py-3 bg-[#4ABD86] hover:bg-[#26c579] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition duration-200"
      >
        {t("continue")}
      </button>

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <AddAddressModal
          onClose={() => setShowAddAddressModal(false)}
          onSave={handleAddAddress}
        />
      )}
    </div>
  );
}
