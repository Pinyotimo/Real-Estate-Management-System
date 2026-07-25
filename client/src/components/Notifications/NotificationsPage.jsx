import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useNotifications } from "./NotificationsContext";

const NotificationsPage = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;
    if (filter === "unread") filtered = filtered.filter((n) => !n.read);
    else if (filter === "read") filtered = filtered.filter((n) => n.read);
    return filtered;
  }, [notifications, filter, sortBy]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="dashboard-shell">
      <div className="dashboard-stack" style={{ marginBottom: "1.5rem" }}>
        <div className="dashboard-space-between">
          <div>
            <h1 className="dashboard-title">Notifications</h1>
            <p className="dashboard-subtitle">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              className="dashboard-btn dashboard-btn--outline"
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="dashboard-form-row" style={{ marginBottom: "1.5rem" }}>
        <div>
          <label className="dashboard-label">Filter</label>
          <select
            className="dashboard-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>
        </div>
        <div>
          <label className="dashboard-label">Sort By</label>
          <select
            className="dashboard-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {filteredNotifications.length > 0 ? (
        <div className="dashboard-stack" style={{ gap: "0.75rem" }}>
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className="dashboard-card"
              style={{
                borderLeft: `4px solid ${notification.read ? "var(--border)" : "var(--brand-blue)"}`,
                backgroundColor: notification.read
                  ? "var(--surface)"
                  : "var(--surface-soft)",
              }}
            >
              <div className="dashboard-space-between">
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.35rem",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                      }}
                    >
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span
                        style={{
                          display: "inline-block",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: "var(--brand-blue)",
                        }}
                      />
                    )}
                  </div>
                  <p
                    style={{
                      margin: "0 0 0.5rem",
                      fontSize: "0.9rem",
                      color: "var(--text-muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    {notification.message}
                  </p>
                  <span
                    style={{ fontSize: "0.78rem", color: "var(--text-subtle)" }}
                  >
                    {notification.timeAgo}
                  </span>
                </div>

                <div
                  className="dashboard-inline-actions"
                  style={{ marginLeft: "1rem" }}
                >
                  {!notification.read && (
                    <button
                      className="icon-button"
                      onClick={() => markAsRead(notification.id)}
                      title="Mark as read"
                      style={{ width: "36px", height: "36px", padding: 0 }}
                    >
                      ✓
                    </button>
                  )}
                  <button
                    className="icon-button"
                    onClick={() => deleteNotification(notification.id)}
                    title="Delete"
                    style={{ width: "36px", height: "36px", padding: 0 }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {notification.actionUrl && (
                <div style={{ marginTop: "0.75rem" }}>
                  <Link
                    to={notification.actionUrl}
                    className="dashboard-link"
                    style={{ fontSize: "0.85rem" }}
                  >
                    View details →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state" style={{ padding: "3rem 1rem" }}>
          <p style={{ marginBottom: "0.25rem" }}>No notifications here!</p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            {filter === "unread"
              ? "You're all caught up"
              : filter === "read"
                ? "No read notifications"
                : "You'll see important updates here"}
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
