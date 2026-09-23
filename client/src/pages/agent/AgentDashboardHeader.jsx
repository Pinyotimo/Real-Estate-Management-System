import React from "react";
import PropTypes from "prop-types";
import { RefreshCw, AlertCircle, CheckCircle2, X } from "lucide-react";

const AgentDashboardHeader = ({
  onRefresh,
  isRefreshing = false,
  error = "",
  success = "",
  onClearError,
  onClearSuccess,
  className = "",
}) => {
  return (
    <header className={`space-y-4 ${className}`.trim()}>
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card text-card-foreground border border-border rounded-xl p-5 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Agent Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage units, rent roll, expenses, and tenant communications.
          </p>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh dashboard data"
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-foreground bg-muted hover:bg-muted/80 rounded-lg border border-border transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
          >
            <RefreshCw
              className={`w-4 h-4 text-muted-foreground ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        )}
      </div>

      {/* Error Alert Banner */}
      {error && (
        <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-xs sm:text-sm font-medium shadow-xs transition-all">
          <div className="flex items-center gap-2.5 min-w-0">
            <AlertCircle className="w-4 h-4 shrink-0 text-destructive" />
            <span className="truncate">{error}</span>
          </div>
          {onClearError && (
            <button
              type="button"
              onClick={onClearError}
              aria-label="Dismiss error message"
              className="p-1 rounded-lg hover:bg-destructive/20 text-destructive transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Success Alert Banner */}
      {success && (
        <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs sm:text-sm font-medium shadow-xs transition-all">
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="truncate">{success}</span>
          </div>
          {onClearSuccess && (
            <button
              type="button"
              onClick={onClearSuccess}
              aria-label="Dismiss success message"
              className="p-1 rounded-lg hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </header>
  );
};

AgentDashboardHeader.propTypes = {
  onRefresh: PropTypes.func,
  isRefreshing: PropTypes.bool,
  error: PropTypes.string,
  success: PropTypes.string,
  onClearError: PropTypes.func,
  onClearSuccess: PropTypes.func,
  className: PropTypes.string,
};

export default AgentDashboardHeader;