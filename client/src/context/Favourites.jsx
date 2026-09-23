import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Trash2,
  MapPin,
  Eye,
  Building2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useFavourites } from "../context/FavouritesContext";

const Favourites = () => {
  const { favourites, removeFavourite, clearFavourites } = useFavourites();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Saved Favourites
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
              {favourites.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Properties you have bookmarked for quick viewing
          </p>
        </div>

        {favourites.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clearFavourites}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Browse More</span>
            </Link>
          </div>
        )}
      </div>

      {/* Empty State */}
      {favourites.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/60 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            No saved properties yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Click the heart icon on any property listing to save it here for later reference.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore Properties</span>
          </Link>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favourites.map((property) => {
            const id = property._id || property.id;
            const imageUrl = property.images?.[0] || property.imageUrl;

            return (
              <div
                key={id}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-200 flex flex-col"
              >
                {/* Image Preview */}
                <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800/60 overflow-hidden shrink-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 dark:bg-slate-800">
                      <Building2 className="w-10 h-10 mb-1 opacity-60" />
                      <span className="text-[10px] font-medium uppercase">
                        No Preview
                      </span>
                    </div>
                  )}

                  {/* Remove Button Badge */}
                  <button
                    type="button"
                    onClick={() => removeFavourite(id)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/80 transition-colors shadow-xs backdrop-blur-md cursor-pointer"
                    title="Remove from favourites"
                  >
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">
                        {property.estate
                          ? `${property.estate}, ${property.county}`
                          : property.county || "Location not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400">Price</div>
                      <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                        KES {Number(property.price || 0).toLocaleString()}
                      </div>
                    </div>

                    <Link
                      to={`/properties/${id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Favourites;