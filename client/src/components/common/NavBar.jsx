import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MessageCircle, Bell, Menu, X, ChevronDown, Heart, Home, ClipboardList, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Stay", path: "/stays" },
  { label: "Roomies", path: "/roomies" },
  { label: "Marketplace", path: "/marketplace" },
  { label: "About Us", path: "/about" },
];

export default function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header style={{ backgroundColor: "#18100E" }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link
            to="/"
            className="text-white text-xl font-bold tracking-tight flex-shrink-0"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            ClockIt
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-4 py-1.5 text-sm font-medium transition-colors"
                style={{
                  color: isActive(link.path) ? "#FFFFFF" : "#9CA3AF",
                }}
              >
                {link.label}
                {isActive(link.path) && (
                  <span
                    className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                    style={{ backgroundColor: "#FFFFFF" }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <MessageCircle size={18} />
                </button>
                <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                  <Bell size={18} />
                  <span
                    className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#7B3045" }}
                  />
                </button>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen((p) => !p)}
                    className="flex items-center gap-1.5"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: "#F3EEE7", color: "#18100E" }}
                    >
                      {user.phone?.slice(-2)?.toUpperCase() || "U"}
                    </div>
                    <ChevronDown
                      size={12}
                      className={`text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {profileOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-48 rounded-2xl py-1 z-50"
                      style={{ backgroundColor: "#FDFAF5", boxShadow: "0 8px 32px rgba(24,16,14,0.14)", border: "1px solid rgba(24,16,14,0.08)" }}
                    >
                      <Link
                        to="/stays/my-listings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                        style={{ color: "#18100E" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F3EEE7"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        <Home size={15} /> My Listings
                      </Link>
                      <Link
                        to="/stays/saved"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                        style={{ color: "#18100E" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F3EEE7"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        <Heart size={15} /> Saved Flats
                      </Link>
                      <Link
                        to="/stays/inquiries"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                        style={{ color: "#18100E" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F3EEE7"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        <ClipboardList size={15} /> My Inquiries
                      </Link>
                      <div className="mx-4 my-1 h-px" style={{ backgroundColor: "#E8E0D8" }} />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                        style={{ color: "#7B3045" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FEF2F2"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        <LogOut size={15} /> Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-semibold rounded-xl transition-all"
                  style={{ backgroundColor: "#7B3045", color: "#F3EEE7" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#6a2638"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#7B3045"}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ backgroundColor: "#1F1208", borderTop: "1px solid rgba(255,255,255,0.06)" }} className="md:hidden">
          <div className="px-6 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{
                  color: isActive(link.path) ? "#F3EEE7" : "#9CA3AF",
                  backgroundColor: isActive(link.path) ? "rgba(243,238,231,0.08)" : "transparent",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
