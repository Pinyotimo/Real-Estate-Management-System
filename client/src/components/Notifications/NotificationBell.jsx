import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Bell,
  Check,
  MessageSquare,
  DollarSign,
  Wrench,
  AlertTriangle,
  Home,
  Key,
} from "lucide-react";
import { useNotifications } from "./NotificationsContext";

const typeConfig = {
  inquiry: { icon: MessageSquare, accent: "info" },
  payment: { icon: DollarSign, accent: "success" },
  rent: { icon: DollarSign, accent: "success" },
  complaint: { icon: Wrench, accent: "danger" },
  maintenance: { icon: Wrench, accent: "danger" },
  arrears: { icon: AlertTriangle, accent: "warning" },
  property: { icon: Home, accent: "info" },
  assignment: { icon: Key, accent: "info" },
  system: { icon: Bell, accent: "info" },
};

const getTypeConfig = (type) => typeConfig[type] || { icon: Bell, accent: "info" };

// Utility to calculate relative time for MongoDB ISO createdAt timestamps
const formatTimeAgo = (createdAt, fallbackTime) => {
  if (fallbackTime) return fallbackTime;
  if (!createdAt) return "Just now";

  const date = new Date(createdAt);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
};

const NotificationBell = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  // 1. Guard against non-array payloads (e.g. initial fetch loading states)
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  // 2. Safe fallback calculation for unread count
  const calculatedUnreadCount =
    typeof unreadCount === "number"
      ? unreadCount
      : safeNotifications.filter((n) => !(n.isRead ?? n.read)).length;

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleNotificationClick = (notification) => {
    const notifId = notification._id || notification.id;
    const isRead = notification.isRead ?? notification.read;
    const targetUrl = notification.actionUrl || notification.link || "/notifications";

    if (!isRead && markAsRead) {
      markAsRead(notifId);
    }
    setIsOpen(false);
    navigate(targetUrl);
  };

  return (
    <div className="notif-popover-wrapper" ref={popoverRef}>
      <button
        type="button"
        className="icon-button optional-mobile"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={`Notifications${
          calculatedUnreadCount > 0 ? ` (${calculatedUnreadCount} unread)` : ""
        }`}
        aria-expanded={isOpen}
        title="View notifications"
        style={{ position: "relative", color: "var(--brand-blue)" }}
      >
        <Bell size={15} strokeWidth={1.5} />
        {calculatedUnreadCount > 0 && (
          <span
            className="notification-badge"
            aria-label={`${calculatedUnreadCount} unread notifications`}
          >
            {calculatedUnreadCount > 9 ? "9+" : calculatedUnreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notif-popover">
          <div className="notif-popover-header">
            <span>
              Notifications
              {calculatedUnreadCount > 0 ? ` · ${calculatedUnreadCount} new` : ""}
            </span>
            {calculatedUnreadCount > 0 && (
              <button
                type="button"
                className="notif-mark-all"
                onClick={markAllAsRead}
              >
                <Check size={13} strokeWidth={2} /> Mark all
              </button>
            )}
          </div>

          <div className="notif-popover-list">
            {safeNotifications.length === 0 ? (
              <div className="notif-empty">
                <Bell size={20} strokeWidth={1.5} />
                <span>You're all caught up!</span>
              </div>
            ) : (
              safeNotifications.slice(0, 6).map((n) => {
                // Normalize field keys between Mock Data and Backend MongoDB Schema
                const id = n._id || n.id;
                const isRead = n.isRead ?? n.read;
                const timeAgo = formatTimeAgo(n.createdAt, n.timeAgo);
                const { icon: TypeIcon, accent } = getTypeConfig(n.type);

                return (
                  <div
                    key={id}
                    className={`notif-item${isRead ? " notif-item--read" : ""}`}
                    onClick={() => handleNotificationClick(n)}
                  >
                    <span
                      className={`notif-item-icon notif-item-icon--${accent}`}
                    >
                      <TypeIcon size={15} strokeWidth={1.75} />
                      {!isRead && <span className="notif-item-icon-dot" />}
                    </span>
                    <div className="notif-item-body">
                      <span className="notif-item-title">{n.title}</span>
                      <p className="notif-item-message">{n.message}</p>
                      <span className="notif-item-time">{timeAgo}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="notif-popover-footer">
            <Link
              to="/notifications"
              className="notif-view-all"
              onClick={() => setIsOpen(false)}
            >
              View All Activity
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;