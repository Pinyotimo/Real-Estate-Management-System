import React from "react";
import { Heart } from "lucide-react";
import { useFavourites } from "../../context/FavouritesContext";

const FavouriteButton = ({ property, className = "" }) => {
  const { isFavourite, toggleFavourite } = useFavourites();
  const id = property._id || property.id;
  const active = isFavourite(id);

  const handleClick = (e) => {
    e.preventDefault(); // Prevents link navigation
    e.stopPropagation(); // Prevents parent click events
    toggleFavourite(property);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`p-2 rounded-xl transition-all duration-200 cursor-pointer backdrop-blur-md shadow-xs border ${
        active
          ? "bg-rose-500 text-white border-rose-500 hover:bg-rose-600 shadow-rose-500/20"
          : "bg-white/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-slate-800 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-900"
      } ${className}`}
      title={active ? "Remove from favourites" : "Add to favourites"}
      aria-label={active ? "Remove from favourites" : "Add to favourites"}
    >
      <Heart
        className={`w-4 h-4 transition-transform duration-150 active:scale-125 ${
          active ? "fill-white stroke-white" : ""
        }`}
      />
    </button>
  );
};

export default FavouriteButton;