import { getLocale } from "@/context/AuthContext";
import axios from "axios";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://yousr.mangjornal.com/api/v1/",
  timeout: 15000, // 15 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from cookies (server-side) or localStorage (client-side)
    let token;

    if (typeof window === "undefined") {
      // Server-side: get token from cookies (in getServerSideProps context)
      // This would be handled in individual page functions
    } else {
      // Client-side
      token = document.cookie.match(/(?:^|; )access_token=([^;]*)/)?.[1];
      const sessionToken = sessionStorage.getItem("session_token");

      // Use session token if no access token
      if (!token && sessionToken) {
        token = sessionToken;
      }
    }

    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add API key for public endpoints
    if (process.env.NEXT_PUBLIC_API_KEY) {
      config.headers["X-API-Key"] = process.env.NEXT_PUBLIC_API_KEY;
    }

    // Add device/user info headers
    if (typeof window !== "undefined") {
      config.headers["X-Device-Type"] = /Mobile|Android/i.test(
        navigator.userAgent,
      )
        ? "mobile"
        : "desktop";

      // Get locale from URL path (e.g., /en/... or /ar/...)
      const pathLocale = window.location.pathname.split("/")[1];
      const locale = ["en", "ar"].includes(pathLocale) ? pathLocale : "en";
      config.headers["Accept-Language"] = locale;
      config.headers["lang"] = locale;
      config.headers["X-User-Language"] = locale;
    }

    console.log(`🚀 ${config.method.toUpperCase()} ${config.url}`);

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // You can modify response data here
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error for debugging
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
    });

    // add token if there is a token
    if (typeof window !== "undefined") {
      const token = document.cookie.match(/(?:^|; )access_token=([^;]*)/)?.[1];
      if (token) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
    }

    // Handle other common errors
    // if (error.response?.status === 403) {
    //   if (typeof window !== "undefined") {
    //     // Show permission denied message
    //     // alert("You do not have permission to access this resource.");
    //   }
    // }

    // if (error.response?.status === 404) {
    //   // Resource not found - you might want to redirect or show 404 page
    //   console.warn("Resource not found:", error.config.url);
    // }

    // if (error.response?.status === 429) {
    //   // Rate limited
    //   if (typeof window !== "undefined") {
    //     alert("Too many requests. Please try again later.");
    //   }
    // }

    // Format error message for consistent error handling
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    // Create a formatted error object
    const formattedError = {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
      isAxiosError: true,
    };

    return Promise.reject(formattedError);
  },
);

// Add a retry mechanism for failed requests
const retryApiClient = async (config, retries = 3, delay = 1000) => {
  try {
    return await apiClient(config);
  } catch (error) {
    if (retries > 0 && error.response?.status >= 500) {
      // Wait for delay then retry (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryApiClient(config, retries - 1, delay * 2);
    }
    throw error;
  }
};

// Custom methods for common e-commerce operations
const ecommerceAPI = {
  // GET requests
  get: (url, config = {}) => retryApiClient({ ...config, method: "GET", url }),

  // POST requests
  post: (url, data = {}, config = {}) =>
    retryApiClient({ ...config, method: "POST", url, data }),

  // PUT requests
  put: (url, data = {}, config = {}) =>
    retryApiClient({ ...config, method: "PUT", url, data }),

  // PATCH requests
  patch: (url, data = {}, config = {}) =>
    retryApiClient({ ...config, method: "PATCH", url, data }),

  // DELETE requests
  delete: (url, config = {}) =>
    retryApiClient({ ...config, method: "DELETE", url }),

  // Product endpoints
  products: {
    getAll: (path = "", params = {}) => {
      const url = path ? `/products/${path}` : "/products";
      return apiClient.get(url, {
        params,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },

    getById: (id) => apiClient.get(`/products/${id}`),
    getByCategory: (categoryId, params = {}) =>
      apiClient.get(`/categories/${categoryId}/products`, { params }),
    search: (query, params = {}) =>
      apiClient.get("/products/search", { params: { q: query, ...params } }),
    create: (productData) => apiClient.post("/products", productData),
    update: (id, productData) => apiClient.put(`/products/${id}`, productData),
    delete: (id) => apiClient.delete(`/products/${id}`),
    uploadImage: (productId, imageFile) => {
      const formData = new FormData();
      formData.append("image", imageFile);
      return apiClient.post(`/products/${id}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  },

  // Category endpoints
  categories: {
    getAll: (params = {}) => apiClient.get("/categories", { params }),
    getById: (id) => apiClient.get(`/categories/${id}`),
    getTree: () => apiClient.get("/categories/tree"),
  },

  // Cart endpoints
  cart: {
    get: () => apiClient.get("/carts"),
    addItem: (productId, quantity = 1, variantId = null) =>
      apiClient.post("/carts", {
        product_id: productId,
        quantity,
        variantId,
      }),
    updateItem: (itemId, quantity) =>
      apiClient.put(`/carts/${itemId}`, { quantity }),
    removeItem: (itemId) => apiClient.delete(`/carts/${itemId}`),
    clear: () => apiClient.delete("/carts"),
    applyCoupon: (code) => apiClient.post("/carts/coupon", { code }),
    removeCoupon: () => apiClient.delete("/carts/coupon"),
  },

  // User/Auth endpoints
  auth: {
    login: (data) =>
      apiClient.post("/auth/login", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          // remove Authorization header for login
          authorization: undefined,
        },
      }),
    register: (userData) =>
      apiClient.post("/auth/registration", userData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: undefined,
        },
      }),
    logout: () => apiClient.post("/auth/logout"),
    refreshToken: (refreshToken) =>
      apiClient.post("/auth/refresh", { refreshToken }),
    forgotPassword: (phone) =>
      apiClient.post("/auth/forgot-password", { phone }),
    resetPassword: (phone, code, password, password_confirmation) =>
      apiClient.post("/auth/reset-password", {
        phone,
        token: code,
        password,
        password_confirmation,
      }),
    getProfile: () => apiClient.get("/auth/me"),
    updateProfile: (userData) =>
      apiClient.post("/auth/update-profile", userData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    verifyToken: (phone, token) =>
      apiClient.post("/auth/verify-token", { phone, token }),
    verifyCode: (code, identifier) =>
      apiClient.post("/auth/verify-code", { code, identifier }),
    resendVerificationCode: (identifier) =>
      apiClient.post("/auth/resend-code", { identifier }),
    deleteAccount: () => apiClient.delete("/auth/delete-account"),
  },

  // Order endpoints
  orders: {
    create: (orderData) => apiClient.post("/orders", orderData),
    getAll: (params = {}) => apiClient.get("/orders", { params }),
    getById: (id) => apiClient.get(`/orders/${id}`),
    cancel: (id) => apiClient.delete(`/orders/${id}`),
    return: (id) => apiClient.post(`/orders/return/${id}`),
    track: (id) => apiClient.get(`/orders/${id}/track`),
  },

  // Payment endpoints
  payments: {
    createIntent: (orderId) => apiClient.post(`/payments/${orderId}/intent`),
    confirm: (paymentId) => apiClient.post(`/payments/${paymentId}/confirm`),
    getMethods: () => apiClient.get("/payments/methods"),
  },

  // Address endpoints
  addresses: {
    getAll: () => apiClient.get("/addresses"),
    getById: (id) => apiClient.get(`/addresses/${id}`),
    create: (addressData) => apiClient.post("/addresses", addressData),
    update: (id, addressData) => apiClient.put(`/addresses/${id}`, addressData),
    delete: (id) => apiClient.delete(`/addresses/${id}`),
    setDefault: (id) => apiClient.post(`/addresses/${id}/default`),
    getShippingFees: () => apiClient.post("/settings/settings"),
  },

  // Wishlist endpoints
  wishlist: {
    get: () => apiClient.get("/products/get-favorites"),
    addItem: (itemId) => apiClient.post(`/products/favorites/${itemId}`),
    removeItem: (itemId) => apiClient.post(`/products/favorites/${itemId}`),
    moveToCart: (itemId) =>
      apiClient.post(`/products/get-favorites/items/${itemId}/move-to-cart`),
  },
  // governance endpoints
  governorates: {
    getAll: () => apiClient.get("/governorates"),
  },
  // store endpoints
  stores: {
    getAll: () => apiClient.get("/stores"),
  },
  // notifications endpoints
  notifications: {
    getAll: () => apiClient.get("/notifications"),
    markAsRead: (notification_id) =>
      apiClient.post("/notifications/mark-as-read", { notification_id }),
  },
  // installment plans endpoints
  installmentPlans: {
    getAll: () => apiClient.get("/installment_plans"),
    paymobPay: (id) =>
      apiClient.post(`/payments/paymob/pay-order-installment/${id}/`, {
        type_device: "web",
      }),
  },
  // paymob cash payment
  paymobPayCache: (orderId) =>
    apiClient.post(`/payments/paymob/pay-order-cache`, {
      order_id: orderId,
      type_device: "web",
    }),
  // paymob applicant payment
  paymobPayApplicant: (orderId) =>
    apiClient.post(`/payments/paymob/pay-applicant-payment`, {
      order_id: orderId,
      type_device: "web",
    }),
  // paymob pay single installment item
  paymobPayInstallment: (installmentId) =>
    apiClient.post(`/payments/paymob/pay-order-installment/`, {
      installment_id: [installmentId],
      type_device: "web",
    }),
  // Review endpoints
  reviews: {
    getByProduct: (productId, params = {}) =>
      apiClient.get(`/products/${productId}/reviews`, { params }),
    create: (productId, reviewData) =>
      apiClient.post(`/products/${productId}/reviews`, reviewData),
    update: (reviewId, reviewData) =>
      apiClient.put(`/reviews/${reviewId}`, reviewData),
    delete: (reviewId) => apiClient.delete(`/reviews/${reviewId}`),
  },
  // banners
  banners: {
    getAll: () => apiClient.get("/banners"),
  },
  // Utility methods
  setAuthToken: (token) => {
    if (token) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    } else {
      delete apiClient.defaults.headers.common["Authorization"];
      document.cookie = "access_token=; path=/; max-age=0";
    }
  },

  setSessionToken: (token) => {
    if (token) {
      sessionStorage.setItem("session_token", token);
    } else {
      sessionStorage.removeItem("session_token");
    }
  },

  clearAuth: () => {
    delete apiClient.defaults.headers.common["Authorization"];
    sessionStorage.removeItem("session_token");
    document.cookie = "access_token=; path=/; max-age=0";
  },

  // For SSR/SSG data fetching
  getServerSidePropsConfig: (context) => {
    // Get token from cookies for server-side requests
    const token = context.req?.cookies?.access_token;

    return {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        "X-API-Key": process.env.API_KEY,
        Cookie: context.req?.headers?.cookie || "",
      },
    };
  },
};

// Export for both default and named imports
export default ecommerceAPI;
export { apiClient as axiosClient };
