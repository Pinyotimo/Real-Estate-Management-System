import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <Navbar />
          <AppRoutes />
        </BrowserRouter>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
