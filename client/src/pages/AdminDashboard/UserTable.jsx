import React from "react";
import PropTypes from "prop-types";
import { Users, UserX, Trash2, Mail } from "lucide-react";

// Contextual role badge styling using theme design tokens
const getRoleBadgeClass = (role) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "agent":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    default:
      return "bg-primary/10 text-primary border-primary/20";
  }
};

const UserTable = ({
  users = [],
  onRoleChange,
  onSuspend,
  onDelete,
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

  // Empty State View
  if (!users || users.length === 0) {
    return (
      <div className="p-8 sm:p-12 text-center rounded-xl border border-dashed border-border bg-muted/20 max-w-xl mx-auto my-6">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 border border-border">
          <Users className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">
          No Active Users
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          There are currently no active user accounts on the platform.
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
            <th className="py-3 px-4">Joined</th>
            <th className="py-3 px-4">Last Active</th>
            <th className="py-3 px-4">Change Role</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-xs sm:text-sm">
          {users.map((u) => {
            const userId = u._id || u.id;
            const userName = u.name || "Unknown User";

            return (
              <tr
                key={userId}
                className="hover:bg-muted/40 transition-colors"
              >
                {/* User Avatar + Name */}
                <td className="py-3.5 px-4 font-semibold text-foreground">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-xs">
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
                    {u.email || "N/A"}
                  </span>
                </td>

                {/* Role Badge */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border capitalize ${getRoleBadgeClass(
                      u.role
                    )}`}
                  >
                    {u.role || "tenant"}
                  </span>
                </td>

                {/* Joined Date */}
                <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                  {safeFormatDateTime(u.createdAt)}
                </td>

                {/* Last Active Date */}
                <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                  {safeFormatDateTime(u.lastActiveAt)}
                </td>

                {/* Change Role Selector */}
                <td className="py-3.5 px-4">
                  <select
                    value={u.role || "tenant"}
                    onChange={(e) => onRoleChange?.(userId, e.target.value)}
                    className="py-1 px-2 text-xs bg-background border border-border rounded-md focus:ring-2 focus:ring-ring focus:outline-none text-foreground"
                    aria-label={`Change role for ${userName}`}
                  >
                    <option value="tenant">Tenant</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                {/* Action Buttons */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onSuspend?.(userId)}
                      className="p-2 rounded-lg border border-amber-500/20 text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-colors cursor-pointer"
                      title="Suspend user"
                      aria-label={`Suspend ${userName}`}
                    >
                      <UserX className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete?.(userId)}
                      className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 transition-colors cursor-pointer"
                      title="Delete user"
                      aria-label={`Delete ${userName}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

UserTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      id: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.string,
      createdAt: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]),
      lastActiveAt: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]),
    })
  ),
  onRoleChange: PropTypes.func.isRequired,
  onSuspend: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  formatDateTime: PropTypes.func,
};

export default UserTable;