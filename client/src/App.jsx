import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationsProvider } from "./components/Notifications/NotificationsContext";
import { FavouritesProvider } from "./context/FavouritesContext";
import { ThemeProvider } from "./context/ThemeProvider";

import Layout from "./components/layout/Layout";
import PropertyList from "./components/PropertyList/PropertyList";
import PropertyDetail from "./components/PropertyDetail/PropertyDetail";

import AgentDashboard from "./pages/agent";
import TenantDashboard from "./pages/tenant";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";

import NotificationsPage from "./components/Notifications/NotificationsPage";
import ProfilePage from "./features/profile/ProfilePage";
import SettingsPage from "./features/settings/SettingsPage";
import EditProperty from "./features/property/EditProperty";
import AddProperty from "./features/property/AddProperty";
import MyProperties from "./features/property/MyProperties";
import AssignmentDetail from "./pages/agent/AssignmentDetail";
import Favourites from "./context/Favourites";

// ----- Route Guards -----
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AgentRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "agent" && user.role !== "admin")
    return <Navigate to="/" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <NotificationsProvider>
            <FavouritesProvider>
              {/* Global Toaster */}
              <Toaster position="top-right" richColors />

              <Routes>
                {/* Routes with Layout (sidebar + navbar) */}
                <Route element={<Layout />}>
                  <Route path="/" element={<PropertyList />} />
                  <Route path="/properties/:id" element={<PropertyDetail />} />
                  <Route path="/favourites" element={<Favourites />} />

                  <Route
                    path="/properties/:id/edit"
                    element={
                      <AgentRoute>
                        <EditProperty />
                      </AgentRoute>
                    }
                  />
                  <Route
                    path="/add"
                    element={
                      <AgentRoute>
                        <AddProperty />
                      </AgentRoute>
                    }
                  />
                  <Route
                    path="/agent-dashboard"
                    element={
                      <AgentRoute>
                        <AgentDashboard />
                      </AgentRoute>
                    }
                  />
                  <Route
                    path="/tenant-dashboard"
                    element={
                      <ProtectedRoute>
                        <TenantDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-properties"
                    element={
                      <AgentRoute>
                        <MyProperties />
                      </AgentRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/notifications"
                    element={
                      <ProtectedRoute>
                        <NotificationsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                <Route
                  path="/assignments/:id"
                  element={
                    <AgentRoute>
                      <AssignmentDetail />
                    </AgentRoute>
                  }
                />

                {/* Auth routes without Layout (full-screen) */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </FavouritesProvider>
          </NotificationsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;