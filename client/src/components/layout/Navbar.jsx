import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const isAgentOrAdmin =
    user && (user.role === "agent" || user.role === "admin");
  const isAdmin = user && user.role === "admin";
  const isTenant = user && user.role === "tenant";

  return (
    <nav
      style={{
        padding: "1rem 2rem",
        background: "#262262",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link
        to="/"
        style={{
          color: "#fff",
          textDecoration: "none",
          fontSize: "1.25rem",
          fontWeight: "bold",
        }}
      >
        🏡 RealEstateApp
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
          Properties
        </Link>
        {user ? (
          <>
            {isAgentOrAdmin && (
              <>
                <Link
                  to="/add"
                  style={{
                    color: "#8ED8F8",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                >
                  + Add Listing
                </Link>
                <Link
                  to="/agent-dashboard"
                  style={{
                    color: "#8ED8F8",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                >
                  📊 Agent ERP
                </Link>
              </>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                style={{
                  color: "#8ED8F8",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                👑 Admin Portal
              </Link>
            )}

            {isTenant && (
              <Link
                to="/tenant-dashboard"
                style={{
                  color: "#8ED8F8",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                🔑 Tenant Portal
              </Link>
            )}

            <span style={{ fontSize: "0.9rem", color: "#cbd5e1" }}>
              Hello, {user.name} ({user.role})
            </span>
            <button
              onClick={logout}
              style={{
                background: "#ef4444",
                color: "#fff",
                border: "none",
                padding: "0.4rem 0.8rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>
              Login
            </Link>
            <Link
              to="/register"
              style={{
                background: "#1C75BC",
                color: "#fff",
                padding: "0.4rem 0.8rem",
                borderRadius: "4px",
                textDecoration: "none",
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;