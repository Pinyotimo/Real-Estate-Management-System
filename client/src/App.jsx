import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationsProvider } from "./components/Notifications/NotificationsContext";
import Layout from "./components/layout/Layout";
import PropertyList from "./components/PropertyList/PropertyList";
import PropertyDetail from "./components/PropertyDetail/PropertyDetail";
import EditProperty from "./components/PropertyDetail/EditProperty";
import AddProperty from "./components/PropertyList/AddProperty";
import AgentDashboard from "./features/dashboard/agent/AgentDashboard";
import TenantDashboard from "./features/dashboard/tenant/TenantDashboard";
import AdminDashboard from "./features/dashboard/admin/AdminDashboard";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import MyProperties from "./components/PropertyList/MyProperties";
import NotificationsPage from "./components/Notifications/NotificationsPage";

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
    <BrowserRouter>
      <AuthProvider>
        <NotificationsProvider>
          <Routes>
            {/* Routes with Layout (sidebar + navbar) */}
            <Route element={<Layout />}>
              <Route path="/" element={<PropertyList />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
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
            </Route>

            {/* Auth routes without Layout (full-screen) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </NotificationsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
