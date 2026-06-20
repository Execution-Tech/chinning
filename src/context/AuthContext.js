"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import ecommerceAPI from "@/utils";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        isLoading: false,
      };
    case "LOGOUT_SUCCESS":
      return { ...state, isAuthenticated: false, user: null, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "UPDATE_USER":
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
};

export const getLocale = () => {
  if (typeof window === "undefined") return "en";
  const pathLocale = window.location.pathname.split("/")[1];
  return ["en", "ar"].includes(pathLocale) ? pathLocale : "en";
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    if (typeof window === "undefined") return;
    let token = document.cookie.match(/(?:^|; )access_token=([^;]*)/)?.[1];
    if (!token) {
      token = localStorage.getItem("access_token");
      if (token) {
        ecommerceAPI.setAuthToken(token);
        localStorage.removeItem("access_token");
      }
    }
    if (!token) {
      dispatch({ type: "LOGOUT_SUCCESS" });
      return;
    }
    ecommerceAPI.setAuthToken(token);
    try {
      const response = await ecommerceAPI.auth.getProfile();
      const user = response.data?.data || response.data?.user || response.data;
      dispatch({ type: "LOGIN_SUCCESS", payload: { user } });
    } catch (err) {
      dispatch({ type: "LOGOUT_SUCCESS" });
      ecommerceAPI.clearAuth();
    }
  };

  const login = async (credentials) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const loginData = new FormData();
      loginData.append("phone", credentials.phone);
      loginData.append("password", credentials.password);
      loginData.append("fcm_token", "web");
      loginData.append("lang", getLocale());
      loginData.append("type", "web");
      const response = await ecommerceAPI.auth.login(loginData);
      const data = response.data?.data || response.data;
      const token = data?.token || data?.access_token;
      const user = data?.user || data;

      ecommerceAPI.setAuthToken(token);
      dispatch({ type: "LOGIN_SUCCESS", payload: { user } });
      toast.success("تم تسجيل الدخول بنجاح");
      router.push(`/${getLocale()}`);
      return { success: true };
    } catch (err) {
      dispatch({ type: "SET_LOADING", payload: false });
      toast.error(err?.data?.message || err?.message || "فشل تسجيل الدخول");
      return { success: false };
    }
  };

  const register = async (userData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("password", userData.password);
      formData.append(
        "password_confirmation",
        userData.password_confirmation || userData.password,
      );
      await ecommerceAPI.auth.register(formData);
      dispatch({ type: "SET_LOADING", payload: false });
      toast.success("تم إنشاء الحساب، أدخل رمز التحقق");
      router.push(
        `/${getLocale()}/verification-code?identifier=${encodeURIComponent(userData.phone)}&flow=registration`,
      );
      return { success: true };
    } catch (err) {
      dispatch({ type: "SET_LOADING", payload: false });
      toast.error(err?.data?.message || err?.message || "فشل إنشاء الحساب");
      return { success: false };
    }
  };

  const logout = async () => {
    try {
      await ecommerceAPI.auth.logout();
    } catch {
      // always clear local state even if server call fails
    }
    ecommerceAPI.clearAuth();
    dispatch({ type: "LOGOUT_SUCCESS" });
    router.push(`/${getLocale()}`);
    return { success: true };
  };

  const forgotPassword = async (phone) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await ecommerceAPI.auth.forgotPassword(phone);
      dispatch({ type: "SET_LOADING", payload: false });
      router.push(
        `/${getLocale()}/verification-code?phone=${encodeURIComponent(phone)}&flow=forgot-password`,
      );
      return { success: true };
    } catch (err) {
      dispatch({ type: "SET_LOADING", payload: false });
      toast.error(err?.data?.message || err?.message || "فشل إرسال رمز التحقق");
      return { success: false };
    }
  };

  const deleteAccount = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await ecommerceAPI.auth.deleteAccount();
      if (response.data?.status) {
        ecommerceAPI.clearAuth();
        dispatch({ type: "LOGOUT_SUCCESS" });
        return { success: true };
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
        return { success: false, error: response.data?.data || "Delete failed" };
      }
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      return { success: false, error: error.message || "Delete failed" };
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await ecommerceAPI.auth.updateProfile(userData);
      const user = response.data?.data || response.data?.user || response.data;
      dispatch({ type: "UPDATE_USER", payload: user });
      toast.success("تم تحديث البيانات");
      return { success: true };
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "فشل تحديث البيانات");
      return { success: false };
    }
  };

  const hasRole = (role) => state.user?.role === role;
  const hasAnyRole = (roles) => roles.includes(state.user?.role);

  const value = {
    ...state,
    login,
    register,
    logout,
    forgotPassword,
    deleteAccount,
    updateProfile,
    hasRole,
    hasAnyRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
