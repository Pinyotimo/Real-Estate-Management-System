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
    <>
      <style>{`
        .navbar {
          padding: 1rem 2rem;
          background: var(--brand-navy, #262262);
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .navbar-brand {
          color: #fff;
          text-decoration: none;
          font-size: 1.25rem;
          font-weight: bold;
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .navbar-link {
          color: #fff;
          text-decoration: none;
        }
        .navbar-link--accent {
          color: var(--brand-cyan, #00AFEF);
          font-weight: bold;
          text-decoration: none;
        }
        .navbar-link--admin {
          color: #C4B5FD;
          font-weight: bold;
          text-decoration: none;
        }
        .navbar-user {
          font-size: 0.9rem;
          color: var(--brand-sky, #8ED8F8);
        }
        .navbar-logout-btn {
          background: var(--danger);
          color: #fff;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .navbar-logout-btn:hover {
          background: #dc2626;
        }
        .navbar-register-btn {
          background: var(--primary);
          color: #fff;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          text-decoration: none;
          transition: background 0.2s ease;
        }
        .navbar-register-btn:hover {
          background: var(--primary-hover);
        }
      `}</style>

      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          🏡 RealEstateApp
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Properties
          </Link>
          {user ? (
            <>
              {isAgentOrAdmin && (
                <>
                  <Link to="/add" className="navbar-link--accent">
                    + Add Listing
                  </Link>
                  <Link to="/agent-dashboard" className="navbar-link--accent">
                    📊 Landlord ERP
                  </Link>
                </>
              )}

              {isAdmin && (
                <Link to="/admin" className="navbar-link--admin">
                  👑 Admin Portal
                </Link>
              )}

              {isTenant && (
                <Link to="/tenant-dashboard" className="navbar-link--accent">
                  🔑 Tenant Portal
                </Link>
              )}

              <span className="navbar-user">
                Hello, {user.name} ({user.role})
              </span>
              <button onClick={logout} className="navbar-logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-register-btn">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;