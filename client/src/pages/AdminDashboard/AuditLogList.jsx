import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  ClipboardList,
  Clock,
  User,
  Activity,
  Globe,
  Mail,
  Shield,
  Monitor,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const STATUS_CONFIG = {
  success: {
    bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
    label: "Success",
  },
  failed: {
    bg: "bg-destructive/10 text-destructive border-destructive/20",
    icon: XCircle,
    label: "Failed",
  },
  warning: {
    bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: AlertCircle,
    label: "Warning",
  },
};

const renderStatusBadge = (status = "success") => {
  const current = STATUS_CONFIG[status.toLowerCase()] || STATUS_CONFIG.success;
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${current.bg}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      {current.label}
    </span>
  );
};

const AuditLogList = ({ auditLogs = [], formatDateTime = null }) => {
  const [expandedId, setExpandedId] = useState(null);

  const safeFormatDateTime = (dateStr) => {
    if (typeof formatDateTime === "function") return formatDateTime(dateStr);
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (!auditLogs || auditLogs.length === 0) {
    return (
      <div className="p-8 sm:p-12 text-center rounded-xl border border-dashed border-border bg-muted/20 max-w-xl mx-auto my-6">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 border border-border">
          <ClipboardList className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">
          No Audit Log Entries
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          No system activity has been recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card text-card-foreground border border-border rounded-xl shadow-xs overflow-hidden">
      {/* Table Header */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-3 px-5 py-3 bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <div className="col-span-2 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Timestamp</span>
        </div>
        <div className="col-span-3 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-muted-foreground" />
          <span>User / Email</span>
        </div>
        <div className="col-span-3 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Activity</span>
        </div>
        <div className="col-span-2 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Network / IP</span>
        </div>
        <div className="col-span-2 flex items-center justify-between">
          <span>Status</span>
          <span className="sr-only">Actions</span>
        </div>
      </div>

      {/* Audit Log List */}
      <div className="divide-y divide-border">
        {auditLogs.map((log, idx) => {
          const key = log._id || `log-${idx}`;
          const actor = log.actorName || "System";
          const email = log.email || "N/A";
          const role = log.role || "guest";
          const ip = log.ipAddress || "0.0.0.0";
          const userAgent = log.userAgent || "Unknown";
          const module = log.module || "SYSTEM";
          const isExpanded = expandedId === key;
          const drawerId = `log-details-${key}`;

          return (
            <div
              key={key}
              className="hover:bg-muted/40 transition-colors"
            >
              {/* Primary Row */}
              <div className="p-4 sm:px-5 grid grid-cols-1 lg:grid-cols-12 gap-3 items-start lg:items-center">
                {/* Timestamp */}
                <div className="lg:col-span-2 text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0 lg:hidden" />
                  <span>{safeFormatDateTime(log.createdAt)}</span>
                </div>

                {/* User & Email */}
                <div className="lg:col-span-3 flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1">
                      <User className="w-3 h-3 text-primary shrink-0" />
                      {actor}
                    </span>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border">
                      <Shield className="w-2.5 h-2.5" />
                      {role}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3 shrink-0" />
                    {email}
                  </span>
                </div>

                {/* Activity & Module */}
                <div className="lg:col-span-3 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-primary/10 text-primary border border-primary/20">
                      {module}
                    </span>
                    <span className="text-xs font-medium text-foreground truncate">
                      {log.action || "No action specified"}
                    </span>
                  </div>
                </div>

                {/* Network / IP Address */}
                <div className="lg:col-span-2 text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span>{ip}</span>
                </div>

                {/* Status & Expand Trigger */}
                <div className="lg:col-span-2 flex items-center justify-between gap-2">
                  {renderStatusBadge(log.status)}
                  <button
                    type="button"
                    onClick={() => toggleExpand(key)}
                    aria-expanded={isExpanded}
                    aria-controls={drawerId}
                    aria-label={isExpanded ? "Collapse log details" : "Expand log details"}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible Metadata Drawer */}
              {isExpanded && (
                <div
                  id={drawerId}
                  className="px-5 py-3 bg-muted/30 border-t border-border text-xs space-y-2"
                >
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Monitor className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">
                        User Agent:{" "}
                      </strong>
                      <code className="font-mono text-[11px] break-all text-muted-foreground">
                        {userAgent}
                      </code>
                    </div>
                  </div>

                  {log.details && Object.keys(log.details).length > 0 && (
                    <div className="mt-2">
                      <strong className="text-foreground block mb-1">
                        Payload / Context Details:
                      </strong>
                      <pre className="p-2.5 rounded-lg bg-muted text-foreground border border-border font-mono text-[11px] overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

AuditLogList.propTypes = {
  auditLogs: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      createdAt: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]),
      actorName: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.string,
      action: PropTypes.string,
      module: PropTypes.string,
      ipAddress: PropTypes.string,
      userAgent: PropTypes.string,
      status: PropTypes.string,
      details: PropTypes.object,
    })
  ),
  formatDateTime: PropTypes.func,
};

export default AuditLogList;