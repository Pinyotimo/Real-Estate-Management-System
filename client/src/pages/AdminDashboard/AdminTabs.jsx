import React from "react";
import PropTypes from "prop-types";
import { Users, UserX, Building2, ClipboardList } from "lucide-react";

const AdminTabs = ({
  activeTab,
  onTabChange,
  counts = { users: 0, suspended: 0, properties: 0, audit: 0 },
}) => {
  const tabs = [
    {
      id: "users",
      label: "Active Users",
      count: counts?.users ?? 0,
      icon: Users,
    },
    {
      id: "suspended",
      label: "Suspended",
      count: counts?.suspended ?? 0,
      icon: UserX,
      alertBadge: (counts?.suspended ?? 0) > 0,
    },
    {
      id: "properties",
      label: "Properties",
      count: counts?.properties ?? 0,
      icon: Building2,
    },
    {
      id: "audit",
      label: "Audit Logs",
      count: counts?.audit ?? 0,
      icon: ClipboardList,
    },
  ];

  return (
    <div
      className="flex flex-wrap gap-2 p-1.5 bg-muted rounded-xl border border-border mb-6"
      role="tablist"
      aria-label="Admin Dashboard Navigation"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isActive
                ? "bg-card text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            }`}
          >
            <Icon
              className={`w-4 h-4 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <span>{tab.label}</span>

            {/* Count Badge */}
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors border ${
                isActive
                  ? "bg-primary/10 text-primary border-primary/20"
                  : tab.alertBadge
                  ? "bg-destructive/10 text-destructive border-destructive/20"
                  : "bg-muted-foreground/10 text-muted-foreground border-border/50"
              }`}
            >
              {tab.count.toLocaleString()}
            </span>
          </button>
        );
      })}
    </div>
  );
};

AdminTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  counts: PropTypes.shape({
    users: PropTypes.number,
    suspended: PropTypes.number,
    properties: PropTypes.number,
    audit: PropTypes.number,
  }),
};

export default AdminTabs;