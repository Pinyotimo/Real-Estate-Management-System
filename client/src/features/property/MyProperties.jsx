import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  MapPin,
  Eye,
  Pencil,
  Trash2,
  Home,
  AlertCircle,
  RefreshCw,
  Building2,
  Loader2,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import API from "../../api";

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const fetchProperties = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await API.get("/agent/overview");
      setProperties(data.data.properties || []);
    } catch (err) {
      console.error("Failed to load properties:", err);
      setError("Could not load your properties. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to remove this property listing?")) return;
    
    setDeletingId(propertyId);
    try {
      await API.delete(`/properties/${propertyId}`);
      setProperties((current) => current.filter((p) => p._id !== propertyId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete property.");
    } finally {
      setDeletingId(null);
    }
  };

  // --- Loading Skeleton View ---
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 animate-pulse"
            >
              <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="space-y-2">
                <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
              <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="pt-2 flex gap-2">
                <div className="h-9 flex-1 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-9 flex-1 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-9 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- Error View ---
  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 rounded-2xl shadow-sm text-center">
        <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
          Unable to fetch properties
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          {error}
        </p>
        <button
          type="button"
          onClick={fetchProperties}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer shadow-sm shadow-indigo-500/20"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              My Properties
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/40">
              {properties.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your real estate listings and tenant assignments
          </p>
        </div>

        <Link
          to="/add"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all cursor-pointer shadow-sm shadow-indigo-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>Add Property</span>
        </Link>
      </div>

      {/* Empty State */}
      {properties.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            No properties listed yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Get started by creating your first property listing to manage tenants and view analytics.
          </p>
          <Link
            to="/add"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Listing</span>
          </Link>
        </div>
      ) : (
        /* Property Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => {
            const isOccupied = property.status === "occupied";
            const imageUrl = property.images?.[0] || property.imageUrl;

            return (
              <div
                key={property._id}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-200 flex flex-col"
              >
                {/* Image Header / Fallback Preview */}
                <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800/60 overflow-hidden shrink-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                      <Building2 className="w-10 h-10 mb-1 opacity-60" />
                      <span className="text-[10px] font-medium uppercase tracking-wider">
                        No Preview Available
                      </span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                        isOccupied
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 bg-white/90 dark:bg-slate-900/90"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 bg-white/90 dark:bg-slate-900/90"
                      }`}
                    >
                      {isOccupied ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Clock className="w-3 h-3 text-amber-500" />
                      )}
                      {isOccupied ? "Occupied" : "Vacant"}
                    </span>
                  </div>

                  {/* Property Type Tag */}
                  {property.houseType && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-md">
                        {property.houseType}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
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

                  {/* Price */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                      Monthly Rent
                    </div>
                    <div className="text-base font-extrabold text-slate-900 dark:text-white">
                      KES {Number(property.price || 0).toLocaleString()}
                      <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
                        {" "}/ mo
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      to={`/properties/${property._id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>

                    <Link
                      to={`/properties/${property._id}/edit`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                      title="Edit Property"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(property._id)}
                      disabled={deletingId === property._id}
                      className="p-2 rounded-xl text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors disabled:opacity-50 cursor-pointer"
                      title="Delete Property"
                    >
                      {deletingId === property._id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
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

export default MyProperties;