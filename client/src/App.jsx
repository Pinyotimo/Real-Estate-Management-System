import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import AddProperty from "./features/property/AddProperty";
import PropertyDetail from "./components/PropertyDetail";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import AdminDashboard from "./features/dashboard/admin/AdminDashboard";
import AgentDashboard from "./features/dashboard/agent/AgentDashboard";
import TenantDashboard from "./features/dashboard/tenant/TenantDashboard";
import PropertyList from "./components/PropertyList";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const AgentRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "agent" && user.role !== "admin")
    return <Navigate to="/" />;
  return children;
};

// 👑 Strictly guard Admin Dashboard
const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<PropertyList />} />
        <Route
          path="/add"
          element={
            <AgentRoute>
              <AddProperty />
            </AgentRoute>
          }
        />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
