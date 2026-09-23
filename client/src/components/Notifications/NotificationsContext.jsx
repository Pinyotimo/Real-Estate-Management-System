import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Create Context
const NotificationsContext = createContext();

// 2. Export Provider Component
export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ... your fetch / state logic here ...

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        loading,
        // add any other functions you need here (markAsRead, deleteNotification, etc.)
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

// 3. EXPORT CUSTOM HOOK (MUST BE A NAMED EXPORT)
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
};

// Optional: Default export the context object if needed elsewhere
export default NotificationsContext;