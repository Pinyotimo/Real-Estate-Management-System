import React from "react";
import PropTypes from "prop-types";
import { ShieldCheck, Unlock, Mail } from "lucide-react";

const SuspendedUsersTable = ({
  suspendedUsers = [],
  onUnsuspend,
  formatDateTime = null,
}) => {
  // Safe date formatter fallback
  const safeFormatDateTime = (dateStr) => {
    if (typeof formatDateTime === "function") {
      return formatDateTime(dateStr);
    }
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  // Safe user initials generator
  const getInitials = (name = "") => {
    if (!name || typeof name !== "string") return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Empty State View (Good Standing)
  if (!suspendedUsers || suspendedUsers.length === 0) {
    return (
      <div className="p-8 sm:p-12 text-center rounded-xl border border-dashed border-border bg-muted/20 max-w-xl mx-auto my-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
          <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">
          No Suspended Users
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          All user accounts are currently active and in good standing.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-card text-card-foreground border border-border rounded-xl shadow-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <th className="py-3 px-4">User</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Role</th>
            <th className="py-3 px-4">Suspended On</th>
            <th className="py-3 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-xs sm:text-sm">
          {suspendedUsers.map((u) => {
            const userId = u._id || u.id;
            const userName = u.name || "Unknown User";

            return (
              <tr
                key={userId}
                className="hover:bg-muted/40 transition-colors"
              >
                {/* User Info with Avatar */}
                <td className="py-3.5 px-4 font-semibold text-foreground">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-center font-bold text-xs shrink-0 select-none">
                      {getInitials(userName)}
                    </div>
                    <span className="truncate max-w-[160px] sm:max-w-none">
                      {userName}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="py-3.5 px-4 text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {u.email || "No email provided"}
                  </span>
                </td>

                {/* Role Badge */}
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 capitalize">
                    {u.role || "User"}
                  </span>
                </td>

                {/* Suspended Date */}
                <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                  {safeFormatDateTime(u.suspendedAt)}
                </td>

                {/* Unsuspend Action Button */}
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => onUnsuspend?.(userId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/20 text-primary bg-primary/10 hover:bg-primary/20 text-xs font-semibold transition-colors cursor-pointer"
                    aria-label={`Unsuspend ${userName}`}
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Unsuspend</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

SuspendedUsersTable.propTypes = {
  suspendedUsers: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      id: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.string,
      suspendedAt: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]),
    })
  ),
  onUnsuspend: PropTypes.func.isRequired,
  formatDateTime: PropTypes.func,
};

export default SuspendedUsersTable;