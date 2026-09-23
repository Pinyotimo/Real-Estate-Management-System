import React, { useState, useMemo } from "react";
import {
  Home,
  MapPin,
  Zap,
  Wifi,
  Wrench,
  Building,
  ImageOff,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from "lucide-react";

const TenantPropertyTab = ({ property, properties, assignment }) => {
  // 1. Normalize prop inputs with fallback to assignment.property
  const unitList = useMemo(() => {
    if (Array.isArray(properties) && properties.length > 0) {
      return properties.filter(Boolean);
    }
    if (Array.isArray(property) && property.length > 0) {
      return property.filter(Boolean);
    }
    if (property && typeof property === "object" && Object.keys(property).length > 0) {
      return [property];
    }
    // Fallback: Check if unit details exist on the active assignment object
    if (assignment?.property && typeof assignment.property === "object") {
      return [assignment.property];
    }
    return [];
  }, [property, properties, assignment]);

  // Active selected unit index for multi-unit switching
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Calculate cumulative stats for multi-unit tenants
  const aggregateStats = useMemo(() => {
    return unitList.reduce(
      (acc, unit) => {
        acc.totalRent += Number(unit.price || 0);
        acc.totalPaid += Number(unit.rentPaid || 0);
        acc.totalArrears += Number(unit.rentArrears || 0);
        return acc;
      },
      { totalRent: 0, totalPaid: 0, totalArrears: 0 }
    );
  }, [unitList]);

  // 2. Empty State (No properties assigned)
  if (unitList.length === 0) {
    return (
      <div className="dashboard-panel empty-state p-8 sm:p-12 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 max-w-xl mx-auto my-6">
        <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-900/50">
          <Home className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
          No Unit Assigned
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
          You do not have an assigned unit yet. Ask your property manager to
          assign your house, warehouse, or business unit to your registered
          account.
        </p>
      </div>
    );
  }

  // Active property selected by tab
  const activeProperty = unitList[selectedIndex] || unitList[0];

  const rentArrears = Number(activeProperty.rentArrears || 0);
  const wifiStatus = (activeProperty.wifiStatus || "active").toLowerCase();
  const repairStatus = (activeProperty.repairStatus || "none").toLowerCase();
  const isRepairActive =
    repairStatus === "pending" || repairStatus === "in_progress";

  return (
    <div className="space-y-6">
      {/* Multi-Unit Switcher Header (Visible only when tenant has > 1 unit) */}
      {unitList.length > 1 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Assigned Properties ({unitList.length})
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Combined Arrears:{" "}
                <span
                  className={
                    aggregateStats.totalArrears > 0
                      ? "text-rose-600 font-bold"
                      : "text-emerald-600 font-bold"
                  }
                >
                  KES {aggregateStats.totalArrears.toLocaleString()}
                </span>
              </p>
            </div>
          </div>

          {/* Unit Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {unitList.map((unit, idx) => {
              const isActive = idx === selectedIndex;
              return (
                <button
                  key={unit._id || idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                    isActive
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>{unit.title || `Unit ${idx + 1}`}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Property Card Grid */}
      <div className="dashboard-card-grid grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Property Details Card */}
        <div className="dashboard-card lg:col-span-2 p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Property Media Preview */}
            <div className="property-card-media relative w-full sm:w-48 h-48 sm:h-auto rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-800">
              {activeProperty.images?.[0] ? (
                <img
                  src={activeProperty.images[0]}
                  alt={activeProperty.title || "Assigned Unit"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
                  <ImageOff className="w-8 h-8" />
                  <span>No image available</span>
                </div>
              )}
            </div>

            {/* Unit Info Breakdown */}
            <div className="flex flex-col justify-between flex-1 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 capitalize border border-indigo-100 dark:border-indigo-900/50">
                    <Building className="w-3 h-3 text-indigo-500" />
                    {activeProperty.houseType || "Property Unit"}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                  {activeProperty.title || "Assigned Unit"}
                </h3>

                <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>
                    {[
                      activeProperty.estate,
                      activeProperty.county
                        ? `${activeProperty.county} County`
                        : "",
                    ]
                      .filter(Boolean)
                      .join(", ") || "Location unmapped"}
                  </span>
                </p>
              </div>

              {/* Financial Summary */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
                    Monthly Rent
                  </span>
                  <strong className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    KES {Number(activeProperty.price || 0).toLocaleString()}
                  </strong>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
                    Total Paid
                  </span>
                  <strong className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    KES {Number(activeProperty.rentPaid || 0).toLocaleString()}
                  </strong>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
                    Balance / Arrears
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                      rentArrears > 0
                        ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50"
                        : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
                    }`}
                  >
                    KES {rentArrears.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Utilities & Meter Info Card */}
        <div className="dashboard-card p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="dashboard-section-title text-base font-bold text-slate-800 dark:text-slate-100 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Utilities & Meter Info</span>
            </h4>

            <div className="space-y-3 text-xs">
              {/* Electricity Meter */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Electricity Meter</span>
                </div>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">
                  {activeProperty.electricityMeter || "N/A"}
                </span>
              </div>

              {/* WiFi Status */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                  <Wifi className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>WiFi Status</span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                    wifiStatus === "active"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
                      : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50"
                  }`}
                >
                  {wifiStatus === "active" ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                  )}
                  {wifiStatus}
                </span>
              </div>

              {/* Active Repairs Status */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                  <Wrench className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Active Repairs</span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                    isRepairActive
                      ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50"
                      : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
                  }`}
                >
                  {isRepairActive ? (
                    <AlertCircle className="w-3 h-3 text-rose-500" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  )}
                  {repairStatus.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantPropertyTab;