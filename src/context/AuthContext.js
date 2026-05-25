"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useReducer } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true, user: action.payload.user, isLoading: false };
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
  isLoading: false,
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

  const login = async (credentials) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: {
        user: {
          id: 1,
          name: credentials.name || "Guest User",
          email: credentials.email || "user@example.com",
          image: null,
          phone: credentials.phone || "",
        },
      },
    });
    toast.success("Login successful");
    router.push(`/${getLocale()}`);
    return { success: true };
  };

  const register = async (userData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: {
        user: {
          id: 1,
          name: userData.name || "New User",
          email: userData.email || "",
          image: null,
          phone: userData.phone || "",
        },
      },
    });
    toast.success("Registration successful");
    router.push(`/${getLocale()}`);
    return { success: true };
  };

  const logout = async () => {
    dispatch({ type: "LOGOUT_SUCCESS" });
    router.push(`/${getLocale()}`);
    return { success: true };
  };

  const updateProfile = (userData) => {
    dispatch({ type: "UPDATE_USER", payload: userData });
    return { success: true };
  };

  const hasRole = (role) => state.user?.role === role;
  const hasAnyRole = (roles) => roles.includes(state.user?.role);

  const value = {
    ...state,
    login,
    register,
    logout,
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
