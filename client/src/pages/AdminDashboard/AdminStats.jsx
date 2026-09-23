import React from "react";
import PropTypes from "prop-types";
import {
  Users,
  UserCheck,
  Key,
  Building2,
  Coins,
  UserX,
} from "lucide-react";

const formatCurrencyAbbrev = (val) => {
  const num = Number(val) || 0;
  if (num >= 1_000_000_000) {
    return `KES ${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `KES ${(num / 1_000_000).toFixed(1)}M`;
  }
  return `KES ${num.toLocaleString()}`;
};

const AdminStats = ({
  stats = {},
  totalListings = 0,
  totalListingValue = 0,
  suspendedCount = 0,
}) => {
  const statCards = [
    {
      id: "total-users",
      title: "Total Users",
      value: (stats?.totalUsers || 0).toLocaleString(),
      icon: Users,
      badgeStyle: "bg-primary/10 text-primary border-primary/20",
    },
    {
      id: "active-agents",
      title: "Active Agents",
      value: (stats?.totalAgents || 0).toLocaleString(),
      icon: UserCheck,
      badgeStyle: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    {
      id: "total-tenants",
      title: "Total Tenants",
      value: (stats?.totalTenants || 0).toLocaleString(),
      icon: Key,
      badgeStyle: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    },
    {
      id: "listed-properties",
      title: "Listed Properties",
      value: Number(totalListings || 0).toLocaleString(),
      icon: Building2,
      badgeStyle: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
    {
      id: "listed-value",
      title: "Total Listed Value",
      value: formatCurrencyAbbrev(totalListingValue),
      icon: Coins,
      badgeStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      id: "suspended-users",
      title: "Suspended Users",
      value: Number(suspendedCount || 0).toLocaleString(),
      icon: UserX,
      badgeStyle:
        suspendedCount > 0
          ? "bg-destructive/10 text-destructive border-destructive/20"
          : "bg-muted text-muted-foreground border-border",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="p-4 rounded-xl bg-card text-card-foreground border border-border shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg border ${card.badgeStyle}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <span className="text-2xl font-bold text-foreground tracking-tight">
                {card.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

AdminStats.propTypes = {
  stats: PropTypes.shape({
    totalUsers: PropTypes.number,
    totalAgents: PropTypes.number,
    totalTenants: PropTypes.number,
  }),
  totalListings: PropTypes.number,
  totalListingValue: PropTypes.number,
  suspendedCount: PropTypes.number,
};

export default AdminStats;