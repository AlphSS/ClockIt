import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, MessageCircle, Bell, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!phone.trim() || !password) {
      setError("Phone number and password are required.");
      return;
    }

    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    setLoading(true);
    try {
      await login(formattedPhone, password);
      navigate("/stays");
    } catch (err) {
      setError(err.message || "Invalid phone number or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F3EEE7" }}>

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header style={{ backgroundColor: "#18100E" }} className="flex items-center justify-between px-8 py-4">
        {/* Logo */}
        <Link to="/" className="text-white text-xl font-bold tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
          ClockIt
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "Home", path: "/" },
            { label: "Stay", path: "/stays" },
            { label: "Roomies", path: "/roomies" },
            { label: "Marketplace", path: "/marketplace" },
            { label: "About Us", path: "/about" },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          <button className="text-gray-400 hover:text-white transition-colors p-1">
            <MessageCircle size={18} />
          </button>
          <button className="relative text-gray-400 hover:text-white transition-colors p-1">
            <Bell size={18} />
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-sm font-bold">
            N
          </div>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="flex flex-1 min-h-0">

        {/* Left — Hero text */}
        <div className="hidden lg:flex flex-1 flex-col justify-center px-16 xl:px-24 py-16">
          {/* Breadcrumb label */}
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-6" style={{ color: "#7B3045" }}>
            ClockIt &bull; Sign In
          </p>

          {/* Big heading */}
          <h1
            className="font-bold leading-none mb-6"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(3rem, 5vw, 5rem)",
              color: "#18100E",
              lineHeight: 1.05,
            }}
          >
            Welcome<br />back.
          </h1>

          <p className="text-gray-500 text-base max-w-xs leading-relaxed">
            Sign in to find your place, connect with roomies, and access everything your campus community offers.
          </p>

          {/* Decorative side text — matching image style */}
          <div className="absolute right-[52%] bottom-24 hidden xl:block text-right" style={{ color: "#7B3045", fontFamily: "Georgia, serif" }}>
            <p className="text-base font-semibold leading-tight italic">
              Better<br />Roomies<br />Brighter<br />Days ♡
            </p>
          </div>
        </div>

        {/* Right — Login form */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-16">
          <div
            className="w-full max-w-md rounded-3xl p-8 sm:p-10"
            style={{
              backgroundColor: "#FDFAF5",
              boxShadow: "0 4px 40px rgba(24,16,14,0.08)",
              border: "1px solid rgba(24,16,14,0.06)",
            }}
          >
            {/* Mobile logo */}
            <div className="lg:hidden mb-8 text-center">
              <span className="text-2xl font-bold" style={{ color: "#18100E", fontFamily: "Georgia, serif" }}>
                ClockIt
              </span>
              <p className="text-xs text-gray-400 mt-1 tracking-widest uppercase">Your Campus, Your Community</p>
            </div>

            <h2
              className="font-bold mb-1"
              style={{ color: "#18100E", fontFamily: "Georgia, serif", fontSize: "1.75rem" }}
            >
              Sign in
            </h2>
            <p className="text-sm text-gray-400 mb-8">Enter your credentials to continue</p>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#18100E" }}>
                  Phone Number
                </label>
                <div className="flex gap-2">
                  {/* Country code pill */}
                  <div
                    className="flex items-center px-4 rounded-xl text-sm font-semibold flex-shrink-0"
                    style={{ backgroundColor: "#18100E", color: "#F3EEE7" }}
                  >
                    +91
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit number"
                    className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      backgroundColor: "#F3EEE7",
                      border: "1.5px solid transparent",
                      color: "#18100E",
                    }}
                    onFocus={(e) => { e.target.style.border = "1.5px solid #7B3045"; }}
                    onBlur={(e) => { e.target.style.border = "1.5px solid transparent"; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold tracking-widest uppercase" style={{ color: "#18100E" }}>
                    Password
                  </label>
                  <button type="button" className="text-xs font-medium" style={{ color: "#7B3045" }}>
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all pr-11"
                    style={{
                      backgroundColor: "#F3EEE7",
                      border: "1.5px solid transparent",
                      color: "#18100E",
                    }}
                    onFocus={(e) => { e.target.style.border = "1.5px solid #7B3045"; }}
                    onBlur={(e) => { e.target.style.border = "1.5px solid transparent"; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "#9CA3AF" }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 mt-2"
                style={{
                  backgroundColor: loading ? "#5a2030" : "#18100E",
                  color: "#F3EEE7",
                  letterSpacing: "0.06em",
                }}
                onMouseEnter={(e) => { if (!loading) e.target.style.backgroundColor = "#7B3045"; }}
                onMouseLeave={(e) => { if (!loading) e.target.style.backgroundColor = "#18100E"; }}
              >
                {loading && (
                  <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px" style={{ backgroundColor: "#E5DDD5" }} />
              <span className="text-xs text-gray-400 font-medium">or</span>
              <div className="flex-1 h-px" style={{ backgroundColor: "#E5DDD5" }} />
            </div>

            <p className="text-center text-sm" style={{ color: "#6B7280" }}>
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-bold transition-colors"
                style={{ color: "#7B3045" }}
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
