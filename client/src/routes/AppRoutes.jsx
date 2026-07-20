import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import PropertiesPage from "../pages/PropertiesPage";
import PropertyDetailPage from "../pages/PropertyDetailPage";
import FavoritesPage from "../pages/FavoritesPage";
import AgentDashboardPage from "../pages/AgentDashboardPage";
import NotFoundPage from "../pages/NotFoundPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/properties" element={<PropertiesPage />} />
    <Route path="/properties/:id" element={<PropertyDetailPage />} />
    <Route path="/favorites" element={<FavoritesPage />} />
    <Route path="/agent-dashboard" element={<AgentDashboardPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
