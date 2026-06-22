"use client";
import ecommerceAPI from "@/utils";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = () => {
    setIsLoading(true);
    ecommerceAPI.cart
      .get()
      .then((response) => {
        setItems(response.data.data.cart);
        setTotal(response.data.data.total);
      })
      .catch((error) => {
        console.error("Failed to load cart:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addItem = async (id, quantity) => {
    setIsLoading(true);
    return await ecommerceAPI.cart.addItem(id, quantity).then(() => {
      toast.success("تمت إضافة المنتج للسلة");
      fetchCart();
    });
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      toast.error("الكمية يجب أن تكون 1 على الأقل");
      return;
    }
    setIsLoading(true);
    ecommerceAPI.cart
      .updateItem(itemId, newQuantity)
      .then(() => {
        toast.success("تم تحديث الكمية");
        fetchCart();
      })
      .catch(() => {
        toast.error("فشل في تحديث الكمية");
        setIsLoading(false);
      });
  };

  const removeItem = (itemId) => {
    setIsLoading(true);
    ecommerceAPI.cart
      .removeItem(itemId)
      .then(() => {
        toast.success("تم إزالة المنتج من السلة");
        fetchCart();
      })
      .catch(() => {
        toast.error("فشل في إزالة المنتج");
        setIsLoading(false);
      });
  };

  const clearCart = () => {
    setIsLoading(true);
    ecommerceAPI.cart
      .clear()
      .then(() => {
        setItems([]);
        setTotal(0);
      })
      .catch(() => {
        toast.error("فشل في تفريغ السلة");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    items,
    total,
    isLoading,
    addItem,
    removeItem,
    clearCart,
    getTotalItems,
    updateItemQuantity,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
