import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

const gold = "#B8960C";
const ivory = "#FAFAF7";
const near = "#1A1A1A";
const warm = "#6B6560";
const divC = "#E8E4DC";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-40 border-b"
      style={{
        background: "rgba(250,250,247,0.97)",
        borderColor: divC,
        backdropFilter: "blur(16px)",
      }}>
      <div className="max-w-screen-xl mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <span style={{ color: gold, fontSize: "16px" }}>⚒</span>
          <span className="serif text-sm tracking-widest font-normal"
            style={{ color: near, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Karigor
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard"
            className="text-xs font-medium tracking-widest transition-colors duration-200"
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: location.pathname === "/dashboard" ? gold : warm,
              borderBottom: location.pathname === "/dashboard" ? `1px solid ${gold}` : "none",
              paddingBottom: "2px",
            }}>
            Dashboard
          </Link>

          {user?.role === "admin" && (
            <Link to="/admin"
              className="text-xs font-medium tracking-widest transition-colors duration-200"
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: location.pathname === "/admin" ? gold : warm,
                borderBottom: location.pathname === "/admin" ? `1px solid ${gold}` : "none",
                paddingBottom: "2px",
              }}>
              Admin
            </Link>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center text-xs font-bold text-white"
              style={{ background: gold }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-medium leading-none" style={{ color: near }}>
                {user?.name}
              </p>
              <p className="text-xs leading-none mt-0.5 capitalize"
                style={{ color: warm, fontSize: "10px", letterSpacing: "0.08em" }}>
                {user?.role}
              </p>
            </div>
          </div>

          <button onClick={logout}
            className="text-xs font-medium tracking-widest transition-colors duration-200"
            style={{ color: warm, letterSpacing: "0.15em", textTransform: "uppercase" }}
            onMouseEnter={(e) => (e.target.style.color = "#dc2626")}
            onMouseLeave={(e) => (e.target.style.color = warm)}>
            Sign Out
          </button>
        </div>
      </div>

      <style>{`.serif { font-family: Georgia, 'Times New Roman', serif; }`}</style>
    </nav>
  );
}