import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, MessageSquare, Search, Menu, X, Home, LogOut, Heart, ClipboardList, ChevronDown, Building2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const navLinks = [
    { label: "Deals", path: "/deals" },
    { label: "Roomies", path: "/roomies" },
    { label: "Stays", path: "/stays" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                <Building2 size={18} className="text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900">ClockIt</span>
                <p className="text-[10px] text-gray-400 leading-none hidden sm:block">Your Campus, Your Community</p>
              </div>
            </div>
          </Link>

          {/* Search bar (desktop) */}
          <div className="hidden md:flex flex-1 max-w-sm">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search flats, areas, marketplace..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/stays?location=${e.target.value}`);
                  }
                }}
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition">
                  <MessageSquare size={20} />
                </button>
                <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition">
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
                </button>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen((p) => !p)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white text-sm font-semibold">
                      {user.phone?.slice(-2) || "U"}
                    </div>
                    <ChevronDown size={14} className={`text-gray-500 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 z-50">
                      <Link
                        to="/stays/my-listings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        <Home size={16} />My Listings
                      </Link>
                      <Link
                        to="/stays/saved"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        <Heart size={16} />Saved Flats
                      </Link>
                      <Link
                        to="/stays/inquiries"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        <ClipboardList size={16} />My Inquiries
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition w-full"
                      >
                        <LogOut size={16} />Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl hover:shadow-md transition"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Main nav */}
        <nav className="hidden md:flex items-center gap-1 pb-0 border-t border-gray-100">
          {[
            { label: "Home", path: "/" },
            { label: "Marketplace", path: "/marketplace" },
            { label: "Roomies", path: "/roomies" },
            { label: "Stays", path: "/stays" },
            { label: "Deals", path: "/deals" },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition ${
                isActive(link.path)
                  ? "border-cyan-500 text-cyan-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {/* Mobile search */}
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search flats, areas..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
            {[
              { label: "Home", path: "/" },
              { label: "Marketplace", path: "/marketplace" },
              { label: "Roomies", path: "/roomies" },
              { label: "Stays", path: "/stays" },
              { label: "Deals", path: "/deals" },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 text-sm font-medium rounded-xl transition ${
                  isActive(link.path)
                    ? "bg-cyan-50 text-cyan-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
