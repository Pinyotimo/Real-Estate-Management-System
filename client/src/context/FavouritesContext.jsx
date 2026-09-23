import React, { createContext, useContext, useState, useEffect } from "react";

const FavouritesContext = createContext();

export const FavouritesProvider = ({ children }) => {
  const [favourites, setFavourites] = useState(() => {
    try {
      const saved = localStorage.getItem("favourite_properties");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Failed to load favourites from storage:", err);
      return [];
    }
  });

  // Sync with localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("favourite_properties", JSON.stringify(favourites));
    } catch (err) {
      console.error("Failed to save favourites to storage:", err);
    }
  }, [favourites]);

  // Check if property is favorited
  const isFavourite = (propertyId) => {
    return favourites.some((item) => (item._id || item.id) === propertyId);
  };

  // Toggle favorite on/off
  const toggleFavourite = (property) => {
    const id = property._id || property.id;
    setFavourites((prev) => {
      if (prev.some((item) => (item._id || item.id) === id)) {
        return prev.filter((item) => (item._id || item.id) !== id);
      } else {
        return [...prev, property];
      }
    });
  };

  // Explicit remove
  const removeFavourite = (propertyId) => {
    setFavourites((prev) =>
      prev.filter((item) => (item._id || item.id) !== propertyId)
    );
  };

  // Clear all
  const clearFavourites = () => {
    setFavourites([]);
  };

  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        isFavourite,
        toggleFavourite,
        removeFavourite,
        clearFavourites,
        count: favourites.length,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};

// Custom Hook for clean imports
export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error("useFavourites must be used within a FavouritesProvider");
  }
  return context;
};