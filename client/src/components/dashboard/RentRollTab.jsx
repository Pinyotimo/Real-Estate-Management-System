import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  DollarSign,
  Phone,
  User,
  Search,
  ChevronDown,
  ChevronUp,
  Save,
  Users,
  Home,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  X,
  Loader2,
  Building2,
  Receipt,
} from "lucide-react";

const RentRollTab = ({
  properties = [],
  onUpdateTenant = () => {},
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedProperty, setExpandedProperty] = useState(null);
  const [saving, setSaving] = useState({});

  // Filter only occupied properties
  const occupiedProperties = properties.filter(
    (property) => property.status === "occupied"
  );

  // Filter by search query
  const filteredProperties = occupiedProperties.filter((property) => {
    const term = searchTerm.toLowerCase();
    return (
      property.title?.toLowerCase().includes(term) ||
      property.tenantName?.toLowerCase().includes(term) ||
      property.tenantPhone?.includes(term)
    );
  });

  // Calculate stats
  const totalOccupied = occupiedProperties.length;
  const totalArrears = occupiedProperties.reduce(
    (sum, p) => sum + Number(p.rentArrears || 0),
    0
  );
  const totalRentExpected = occupiedProperties.reduce(
    (sum, p) => sum + Number(p.price || 0),
    0
  );
  const totalRentCollected = occupiedProperties.reduce(
    (sum, p) => sum + Number(p.rentPaid || 0),
    0
  );
  const collectionRate =
    totalRentExpected > 0
      ? Math.min(100, Math.round((totalRentCollected / totalRentExpected) * 100))
      : 0;

  const toggleExpand = (propertyId) => {
    setExpandedProperty(expandedProperty === propertyId ? null : propertyId);
  };

  const handleSubmit = async (e, propertyId) => {
    e.preventDefault();
    setSaving((prev) => ({ ...prev, [propertyId]: true }));

    try {
      await onUpdateTenant(e, propertyId);
    } catch (error) {
      console.error("Error updating rent roll:", error);
    } finally {
      setTimeout(() => {
        setSaving((prev) => ({ ...prev, [propertyId]: false }));
      }, 600);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Tenant Rent Roll</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage rent collection, track balances, and maintain tenant records across occupied properties.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80">
            <Users className="w-3.5 h-3.5" />
            <span>{totalOccupied} Occupied</span>
          </span>

          {totalArrears > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>KES {totalArrears.toLocaleString()} Arrears</span>
            </span>
          )}
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs border-l-4 border-l-indigo-500 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Occupied Units
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {totalOccupied}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <Home className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs border-l-4 border-l-emerald-500 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Rent Collected
            </p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              KES {totalRentCollected.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs border-l-4 border-l-amber-500 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Arrears
            </p>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
              KES {totalArrears.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs border-l-4 border-l-purple-500 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Collection Rate
            </p>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-0.5">
              {collectionRate}%
            </p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by property unit, tenant name, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 dark:text-white placeholder-slate-400 outline-none transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0">
          Showing <strong className="text-slate-800 dark:text-slate-200">{filteredProperties.length}</strong> of{" "}
          <strong className="text-slate-800 dark:text-slate-200">{occupiedProperties.length}</strong> occupied units
        </span>
      </div>

      {/* Main Content Area */}
      {loading ? (
        /* Skeleton Loaders */
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-100 dark:bg-slate-800/50 h-36 rounded-2xl border border-slate-200 dark:border-slate-800"
            />
          ))}
        </div>
      ) : filteredProperties.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
            <Building2 className="w-8 h-8" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {occupiedProperties.length === 0
              ? "No Occupied Units Found"
              : "No Matching Records"}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {occupiedProperties.length === 0
              ? "There are currently no active tenants or occupied units assigned in the property ledger."
              : "No occupied property units matched your query. Try searching with a different keyword."}
          </p>
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              <span>Clear Search Filter</span>
            </button>
          )}
        </div>
      ) : (
        /* Property Cards List */
        <div className="space-y-4">
          {filteredProperties.map((property) => {
            const isExpanded = expandedProperty === property._id;
            const isSaving = saving[property._id];
            const arrears = Number(property.rentArrears || 0);
            const hasArrears = arrears > 0;

            return (
              <div
                key={property._id}
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 sm:p-5 shadow-xs transition-all border-l-4 ${
                  hasArrears
                    ? "border-amber-500 border-t-slate-200 border-r-slate-200 border-b-slate-200 dark:border-t-slate-800 dark:border-r-slate-800 dark:border-b-slate-800"
                    : "border-emerald-500 border-t-slate-200 border-r-slate-200 border-b-slate-200 dark:border-t-slate-800 dark:border-r-slate-800 dark:border-b-slate-800"
                }`}
              >
                <form onSubmit={(e) => handleSubmit(e, property._id)} className="space-y-4">
                  {/* Property Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {property.title}
                        </h4>

                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            hasArrears
                              ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/80"
                              : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80"
                          }`}
                        >
                          {hasArrears ? (
                            <>
                              <AlertCircle className="w-3 h-3" />
                              <span>Arrears: KES {arrears.toLocaleString()}</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Up To Date</span>
                            </>
                          )}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {property.houseType || "Property Unit"} • Target Rent:{" "}
                        <strong className="text-slate-700 dark:text-slate-300 font-semibold">
                          KES {Number(property.price || 0).toLocaleString()}
                        </strong>
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] rounded-xl shadow-xs shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleExpand(property._id)}
                        className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                        title={isExpanded ? "Collapse Details" : "Expand Details"}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Editable Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                        <User className="w-3 h-3 text-indigo-500" />
                        <span>Tenant Name</span>
                      </label>
                      <input
                        type="text"
                        name="tenantName"
                        defaultValue={property.tenantName || ""}
                        placeholder="Tenant Name"
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white placeholder-slate-400 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-indigo-500" />
                        <span>Tenant Phone</span>
                      </label>
                      <input
                        type="text"
                        name="tenantPhone"
                        defaultValue={property.tenantPhone || ""}
                        placeholder="Phone Number"
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white placeholder-slate-400 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-emerald-500" />
                        <span>Rent Paid (KES)</span>
                      </label>
                      <input
                        type="number"
                        name="rentPaid"
                        min="0"
                        step="0.01"
                        defaultValue={property.rentPaid || 0}
                        placeholder="0"
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-white placeholder-slate-400 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-500" />
                        <span>Rent Arrears (KES)</span>
                      </label>
                      <input
                        type="number"
                        name="rentArrears"
                        min="0"
                        step="0.01"
                        defaultValue={property.rentArrears || 0}
                        placeholder="0"
                        className={`w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border rounded-lg focus:ring-2 outline-none transition-all dark:text-white placeholder-slate-400 ${
                          hasArrears
                            ? "border-amber-300 dark:border-amber-700/80 focus:ring-amber-500/20 focus:border-amber-500"
                            : "border-slate-200 dark:border-slate-700 focus:ring-indigo-500/20 focus:border-indigo-500"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Expandable Meta Info */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] uppercase font-bold text-slate-400">
                          Unit ID
                        </span>
                        <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 truncate block">
                          #{property._id?.slice(-6) || "N/A"}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] uppercase font-bold text-slate-400">
                          Location
                        </span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate block">
                          {property.estate || "N/A"}, {property.county || "N/A"}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] uppercase font-bold text-slate-400">
                          Monthly Rent
                        </span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate block">
                          KES {Number(property.price || 0).toLocaleString()}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] uppercase font-bold text-slate-400">
                          Rent Paid
                        </span>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 truncate block">
                          KES {Number(property.rentPaid || 0).toLocaleString()}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] uppercase font-bold text-slate-400">
                          Current Arrears
                        </span>
                        <span
                          className={`text-xs font-semibold truncate block ${
                            hasArrears
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          KES {Number(property.rentArrears || 0).toLocaleString()}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] uppercase font-bold text-slate-400">
                          Status
                        </span>
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 truncate block capitalize">
                          {property.status || "Occupied"}
                        </span>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

RentRollTab.propTypes = {
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string,
      status: PropTypes.string,
      houseType: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      tenantName: PropTypes.string,
      tenantPhone: PropTypes.string,
      rentPaid: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      rentArrears: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      estate: PropTypes.string,
      county: PropTypes.string,
    })
  ),
  onUpdateTenant: PropTypes.func,
  loading: PropTypes.bool,
};

export default RentRollTab;