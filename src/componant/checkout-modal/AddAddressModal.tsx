"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ecommerceAPI from "@/utils";

export interface AddressData {
  id?: number;
  full_name: string;
  phone: string;
  governorate_id: number;
  area: string;
  building: string;
  apartment: string;
}

interface Governorate {
  id: number;
  name: string;
}

interface AddAddressModalProps {
  onClose: () => void;
  onSave: (address: AddressData) => void;
}

export default function AddAddressModal({
  onClose,
  onSave,
}: AddAddressModalProps) {
  const t = useTranslations("AddAddress");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [governorateId, setGovernorateId] = useState<number | "">("");
  const [area, setArea] = useState("");
  const [building, setBuilding] = useState("");
  const [apartment, setApartment] = useState("");
  const [saveAddress, setSaveAddress] = useState(true);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGovernorates = async () => {
      try {
        const response = await ecommerceAPI.governorates.getAll();
        setGovernorates(response.data.data);
      } catch (error) {
        console.error("Failed to fetch governorates:", error);
      }
    };
    fetchGovernorates();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !fullName ||
      !phone ||
      !governorateId ||
      !area ||
      !building ||
      !apartment
    ) {
      alert(t("fillAllFields"));
      return;
    }

    const addressData: AddressData = {
      full_name: fullName,
      phone,
      governorate_id: Number(governorateId),
      area,
      building,
      apartment,
    };

    if (saveAddress) {
      setLoading(true);
      try {
        const response = await ecommerceAPI.addresses.create(addressData);
        if (response.data?.data) {
          onSave({ ...addressData, id: response.data.data.id });
        } else {
          onSave(addressData);
        }
      } catch (error) {
        console.error("Failed to save address:", error);
        // Still pass the address data even if save fails
        onSave(addressData);
      } finally {
        setLoading(false);
      }
    } else {
      onSave(addressData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full border-2 border-[#4ABD86] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#4ABD86]"
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

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          {t("title")}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Input */}
          <input
            type="text"
            placeholder={t("fullName")}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ABD86] focus:border-transparent text-gray-800"
            required
          />

          {/* Phone Input */}
          <input
            type="tel"
            placeholder={t("phone")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ABD86] focus:border-transparent text-gray-800"
            required
          />

          {/* Governorate Dropdown */}
          <div className="relative">
            <select
              value={governorateId}
              onChange={(e) => setGovernorateId(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ABD86] focus:border-transparent appearance-none text-gray-800"
              required
            >
              <option value="">{t("selectGovernorate")}</option>
              {governorates.map((gov) => (
                <option key={gov.id} value={gov.id}>
                  {gov.name}
                </option>
              ))}
            </select>
            <svg
              className="absolute end-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Area Input */}
          <input
            type="text"
            placeholder={t("area")}
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ABD86] focus:border-transparent text-gray-800"
            required
          />

          {/* Building Input */}
          <input
            type="text"
            placeholder={t("building")}
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ABD86] focus:border-transparent text-gray-800"
            required
          />

          {/* Apartment Input */}
          <input
            type="text"
            placeholder={t("apartment")}
            value={apartment}
            onChange={(e) => setApartment(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ABD86] focus:border-transparent text-gray-800"
            required
          />

          {/* Save Address Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="saveAddress"
              checked={saveAddress}
              onChange={(e) => setSaveAddress(e.target.checked)}
              className="w-5 h-5 text-[#4ABD86] border-gray-300 rounded focus:ring-[#4ABD86]"
            />
            <label htmlFor="saveAddress" className="text-gray-700">
              {t("saveAddress")}
            </label>
          </div>

          {/* Add Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#4ABD86] hover:bg-[#26c579] text-white font-medium rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? t("saving") : t("add")}
          </button>
        </form>
      </div>
    </div>
  );
}
