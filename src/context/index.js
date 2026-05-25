// context/index.js
"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";
// import { useSession } from "next-auth/react";

// Import individual contexts
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
// import { ThemeProvider } from './ThemeContext';
// import { CartProvider } from './CartContext';
// import { NotificationProvider } from './NotificationContext';
// import { UserPrefsProvider } from './UserPrefsContext';

// Main App Context
const AppContext = createContext();

const initialState = {
  isLoading: true,
  isInitialized: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case "INITIALIZE":
      return {
        ...state,
        isLoading: false,
        isInitialized: true,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  //   const { data: session, status } = useSession();

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load initial data here (cart from localStorage, user prefs, etc.)
        dispatch({ type: "INITIALIZE" });
      } catch (error) {
        console.error("App initialization failed:", error);
        dispatch({ type: "INITIALIZE" });
      }
    };

    initializeApp();
  }, []);

  // Sync auth state with context
  //   useEffect(() => {
  //     if (status === "loading") return;
  //     // Auth state is handled separately by AuthContext
  //   }, [session, status]);

  const value = {
    ...state,
    dispatch,
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={value}>
      <AuthProvider>
        <CartProvider>
          {/* <NotificationProvider>
          <ThemeProvider>
            <UserPrefsProvider>
              <CartProvider> */}
          {children}
          {/* </CartProvider>
            </UserPrefsProvider>
          </ThemeProvider>
          </NotificationProvider> */}
        </CartProvider>
      </AuthProvider>
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
