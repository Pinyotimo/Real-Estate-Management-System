import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bell, Check } from "lucide-react";
import { useNotifications } from "./NotificationsContext";

const indicatorClass = (type) => {
  switch (type) {
    case "complaint":
      return "notif-dot--danger";
    case "payment":
      return "notif-dot--success";
    case "arrears":
      return "notif-dot--warning";
    default:
      return "notif-dot--info";
  }
};

const NotificationBell = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

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
    markAsRead(notification.id);
    setIsOpen(false);
    navigate(notification.actionUrl || "/notifications");
  };

  return (
    <div className="notif-popover-wrapper" ref={popoverRef}>
      <button
        type="button"
        className="icon-button optional-mobile"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        aria-expanded={isOpen}
        title="View notifications"
        style={{ position: "relative", color: "var(--brand-blue)" }}
      >
        <Bell size={15} strokeWidth={1.5} />
        {unreadCount > 0 && (
          <span
            className="notification-badge"
            aria-label={`${unreadCount} unread notifications`}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notif-popover">
          <div className="notif-popover-header">
            <span>Notifications</span>
            {unreadCount > 0 && (
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
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <Bell size={18} strokeWidth={1.5} />
                <span>You're all caught up!</span>
              </div>
            ) : (
              notifications.slice(0, 6).map((n) => (
                <div
                  key={n.id}
                  className={`notif-item${n.read ? " notif-item--read" : ""}`}
                  onClick={() => handleNotificationClick(n)}
                >
                  <div className="notif-item-top">
                    <span className="notif-item-title">{n.title}</span>
                    {!n.read && (
                      <span className={`notif-dot ${indicatorClass(n.type)}`} />
                    )}
                  </div>
                  <p className="notif-item-message">{n.message}</p>
                  <span className="notif-item-time">{n.timeAgo}</span>
                </div>
              ))
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
