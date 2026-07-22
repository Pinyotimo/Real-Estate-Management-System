import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const isAgentOrAdmin =
    user && (user.role === "agent" || user.role === "admin");
  const isAdmin = user && user.role === "admin";

  return (
    <nav
      style={{
        padding: "1rem 2rem",
        background: "#1e293b",
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
                    color: "#38bdf8",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                >
                  + Add Listing
                </Link>
                <Link
                  to="/agent-dashboard"
                  style={{
                    color: "#38bdf8",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                >
                  📊 Landlord ERP
                </Link>
              </>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                style={{
                  color: "#a855f7",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                👑 Admin Portal
              </Link>
            )}

            {user && user.role === "buyer" && (
              <Link
                to="/tenant-dashboard"
                style={{
                  color: "#38bdf8",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                🔑 Tenant Portal
              </Link>
            )}

            <span style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
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
                background: "#0284c7",
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
