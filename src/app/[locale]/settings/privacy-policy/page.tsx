"use client";
import { useEffect, useState } from "react";
import Navbar from "@/componant/nav-bar";
import Footer from "@/componant/footer";
import { axiosClient } from "@/utils";
import { useTranslations } from "next-intl";

const PrivacyPolicyPage = () => {
  const t = useTranslations("Footer");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await axiosClient.get("privacy-policy");
        setContent(response.data?.data?.content || "");
      } catch (error) {
        console.error("Error fetching privacy policy:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrivacyPolicy();
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t("privacyPolicy")}
        </h1>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-gray-100 p-5"
              >
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-4/5" />
              </div>
            ))}
          </div>
        ) : content ? (
          <div
            className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            No privacy policy available at this time.
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
