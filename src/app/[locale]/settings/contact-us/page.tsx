"use client";
import { useState } from "react";
import Navbar from "@/componant/nav-bar";
import Footer from "@/componant/footer";
import { axiosClient } from "@/utils";
import { useTranslations } from "next-intl";

const ContactUsPage = () => {
  const t = useTranslations("ContactUs");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: [] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(false);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      await axiosClient.post("settings/contact-us", formData);
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: any) {
      if (err?.response?.data?.message) {
        setErrors(err.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fields: { name: keyof typeof form; type?: string; multiline?: boolean }[] = [
    { name: "name" },
    { name: "email", type: "email" },
    { name: "phone", type: "tel" },
    { name: "subject" },
    { name: "message", multiline: true },
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
        <p className="text-gray-500 mb-8">{t("subtitle")}</p>

        {success && (
          <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-5 py-4 text-green-700 font-medium">
            {t("successMessage")}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {fields.map(({ name, type = "text", multiline }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t(name)}
              </label>
              {multiline ? (
                <textarea
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  rows={5}
                  placeholder={t(`${name}Placeholder`)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4ABD86] resize-none"
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={t(`${name}Placeholder`)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4ABD86]"
                />
              )}
              {errors[name]?.map((msg, i) => (
                <p key={i} className="mt-1 text-sm text-red-500">
                  {msg}
                </p>
              ))}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-[#4ABD86] text-white font-semibold py-3 hover:bg-[#3aa872] transition-colors disabled:opacity-60"
          >
            {loading ? t("sending") : t("send")}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUsPage;
