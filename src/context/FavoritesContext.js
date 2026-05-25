// context/FavoritesContext.js
import ecommerceAPI from "@/utils";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const response = await ecommerceAPI.wishlist.get();
      if (response.data?.data) {
        const items = response.data.data;
        setFavorites(items);
        // Create a Set of favorite product IDs for quick lookup
        const ids = new Set(items.map((item) => item.id || item.product_id));
        setFavoriteIds(ids);
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToFavorites = async (productId) => {
    try {
      await ecommerceAPI.wishlist.addItem(productId);
      toast.success("Added to favorites");
      // Update local state
      setFavoriteIds((prev) => new Set([...prev, productId]));
      // Refetch to get full data
      fetchFavorites();
    } catch (error) {
      console.error("Failed to add to favorites:", error);
      toast.error("Failed to add to favorites");
    }
  };

  const removeFromFavorites = async (productId) => {
    try {
      await ecommerceAPI.wishlist.removeItem(productId);
      toast.success("Removed from favorites");
      // Update local state
      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
      setFavorites((prev) => prev.filter((item) => (item.id || item.product_id) !== productId));
    } catch (error) {
      console.error("Failed to remove from favorites:", error);
      toast.error("Failed to remove from favorites");
    }
  };

  const toggleFavorite = async (productId) => {
    if (isFavorite(productId)) {
      await removeFromFavorites(productId);
    } else {
      await addToFavorites(productId);
    }
  };

  const isFavorite = (productId) => {
    return favoriteIds.has(productId);
  };

  const value = {
    favorites,
    favoriteIds,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    fetchFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
};
