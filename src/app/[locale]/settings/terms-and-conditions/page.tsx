"use client";
import { useEffect, useState } from "react";
import Navbar from "@/componant/nav-bar";
import Footer from "@/componant/footer";
import { axiosClient } from "@/utils";

interface TermItem {
  id: number;
  question: string;
  answer: string;
}

const TermsAndConditionsPage = () => {
  const [terms, setTerms] = useState<TermItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await axiosClient.get("settings/terms-and-conditions");
        setTerms(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching terms and conditions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Terms & Conditions
        </h1>
        <p className="text-gray-500 mb-8">
          Frequently asked questions about Yusr's policies and services.
        </p>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-gray-100 p-5">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : terms.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            No terms available at this time.
          </div>
        ) : (
          <div className="space-y-3">
            {terms.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-start bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 text-sm sm:text-base pr-4">
                    {item.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 transition-transform duration-200 ${
                      openId === item.id ? "rotate-180 bg-[#4ABD86] border-[#4ABD86]" : "bg-white"
                    }`}
                  >
                    <svg
                      className={`w-4 h-4 ${openId === item.id ? "text-white" : "text-gray-500"}`}
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
                  </span>
                </button>

                {openId === item.id && (
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3 bg-gray-50">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditionsPage;
