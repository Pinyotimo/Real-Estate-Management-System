import { createContext, useContext, useState, useMemo } from "react";

const NotificationsContext = createContext(null);

// TODO: replace with a real API call once a notifications backend/model exists
const initialNotifications = [
  {
    id: 1,
    type: "inquiry",
    title: "New Property Inquiry",
    message: "A prospective tenant asked about 'Modern 3BR Villa'",
    read: false,
    timeAgo: "15m ago",
    actionUrl: "/agent-dashboard",
  },
  {
    id: 2,
    type: "payment",
    title: "Rent Payment Received",
    message: "Alice Johnson paid $1,200 rent via M-Pesa",
    read: false,
    timeAgo: "2h ago",
    actionUrl: "/agent-dashboard",
  },
  {
    id: 3,
    type: "property",
    title: "Property Listed",
    message: "Your listing 'Retail Shop Along Westlands Main Road' is now live",
    read: true,
    timeAgo: "1d ago",
    actionUrl: "/my-properties",
  },
  {
    id: 4,
    type: "complaint",
    title: "New Maintenance Ticket",
    message: "Apex Logistics Ltd reported low water pressure in staff washrooms",
    read: true,
    timeAgo: "2d ago",
    actionUrl: "/agent-dashboard",
  },
  {
    id: 5,
    type: "assignment",
    title: "Unit Assigned",
    message: "You've been assigned to 'Industrial Storage Warehouse Unit 4B'",
    read: true,
    timeAgo: "3d ago",
    actionUrl: "/tenant-dashboard",
  },
  {
    id: 6,
    type: "arrears",
    title: "Rent Arrears Reminder",
    message: "Your account has an outstanding balance of $500",
    read: true,
    timeAgo: "5d ago",
    actionUrl: "/tenant-dashboard",
  },
];

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) => current.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((current) => current.filter((n) => n.id !== id));
  };

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
};