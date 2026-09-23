import React from "react";
import PropTypes from "prop-types";
import { BarChart3, UserCheck, DoorOpen, Wrench } from "lucide-react";

const AgentAnalyticsStrip = ({
  occupancyRate = 0,
  occupiedUnits = 0,
  vacantUnits = 0,
  pendingRepairs = 0,
}) => {
  // Safe bounds for progress bar width calculation
  const safeRate = Math.min(Math.max(Number(occupancyRate) || 0, 0), 100);

  // Dynamic progress bar color depending on occupancy health
  const getOccupancyColorClass = (rate) => {
    if (rate >= 80) return "bg-emerald-500";
    if (rate >= 50) return "bg-amber-500";
    return "bg-destructive";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Occupancy Rate */}
      <div className="p-4 rounded-xl border border-border bg-card text-card-foreground shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-primary" />
            Occupancy Rate
          </span>
          <span className="text-xs font-bold text-muted-foreground">
            {safeRate}%
          </span>
        </div>

        <div>
          <span className="text-2xl font-bold text-foreground">
            {safeRate}%
          </span>

          <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-3">
            <div
              className={`h-full transition-all duration-500 rounded-full ${getOccupancyColorClass(
                safeRate
              )}`}
              style={{ width: `${safeRate}%` }}
              role="progressbar"
              aria-valuenow={safeRate}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>

      {/* 2. Occupied Units */}
      <div className="p-4 rounded-xl border border-border bg-card text-card-foreground shadow-xs flex flex-col justify-between">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Occupied Units
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-foreground">
            {occupiedUnits}
          </span>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            Active
          </span>
        </div>
      </div>

      {/* 3. Vacant Units */}
      <div className="p-4 rounded-xl border border-border bg-card text-card-foreground shadow-xs flex flex-col justify-between">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          <DoorOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          Vacant Units
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-foreground">
            {vacantUnits}
          </span>
          {vacantUnits > 0 && (
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              Ready to Rent
            </span>
          )}
        </div>
      </div>

      {/* 4. Repairs Pending */}
      <div className="p-4 rounded-xl border border-border bg-card text-card-foreground shadow-xs flex flex-col justify-between">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          <Wrench className="w-4 h-4 text-destructive" />
          Repairs Pending
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-foreground">
            {pendingRepairs}
          </span>
          {pendingRepairs > 0 ? (
            <span className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded-md border border-destructive/20">
              Action Needed
            </span>
          ) : (
            <span className="text-xs font-medium text-muted-foreground">
              Clear
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

AgentAnalyticsStrip.propTypes = {
  occupancyRate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  occupiedUnits: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  vacantUnits: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  pendingRepairs: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default AgentAnalyticsStrip;