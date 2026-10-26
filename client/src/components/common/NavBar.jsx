import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
<<<<<<< Updated upstream
=======
import { getNotifications } from "../../services/notificationApi";
>>>>>>> Stashed changes

function Navbar() {
  const navigate = useNavigate();

<<<<<<< Updated upstream
=======
  // ==================== USERNAME STATE ====================
  const [username, setUsername] = useState("");
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // ==================== FETCH USERNAME ====================
  useEffect(() => {
    let isMounted = true;

    async function fetchUsername() {
      try {
        // Get the currently logged-in user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("Error fetching authenticated user:", userError);
          return;
        }

        // If no user is logged in
        if (!user) {
          if (isMounted) {
            setUsername("");
          }
          return;
        }

        // Fetch username from the profiles table
        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching username from profiles:", error);
        }

        if (isMounted) {
          setUsername(
            data?.username ||
              user.user_metadata?.username ||
              user.email?.split("@")[0] ||
              "User",
          );
        }
      } catch (error) {
        console.error("Unexpected error fetching username:", error);
      }
    }

    // Fetch username when Navbar loads
    fetchUsername();

    // Listen for login/logout events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setUsername("");
      } else if (session?.user) {
        fetchUsername();
      }
    });

    // Cleanup subscription when Navbar unmounts
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Keep the navbar badge connected to the signed-in user's stored notifications.
  useEffect(() => {
    let active = true;
    const loadUnread = async () => {
      try {
        const result = await getNotifications("all");
        if (active) setUnreadNotifications(result.unreadCount || 0);
      } catch {
        if (active) setUnreadNotifications(0);
      }
    };
    loadUnread();
    const timer = window.setInterval(loadUnread, 30000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  // ==================== LOGOUT ====================
>>>>>>> Stashed changes
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error);
      return;
    }

    navigate("/login", { replace: true });
  }

  return (
<<<<<<< Updated upstream
    <nav className="flex items-center justify-between border-b border-gray-200 px-8 py-4">
      {/* Logo */}
      <button onClick={() => navigate("/")} className="text-2xl font-bold">
        ClockIt
      </button>

      {/* Navigation */}
      <div className="flex items-center gap-2">
=======
    <nav
      className={
        isRoomies
          ? "border-b border-[#7B694E]/30 bg-[#280B0F] text-[#F5EEE6]"
          : "border-b border-white/10 bg-[#0a0a0a] text-white"
      }
    >
      <div className="mx-auto flex h-[88px] max-w-6xl items-center justify-between px-6">
        {/* ==================== LOGO ==================== */}
>>>>>>> Stashed changes
        <button
          onClick={() => navigate("/")}
          className="rounded-lg px-4 py-2 hover:bg-gray-100"
        >
          Home
        </button>

<<<<<<< Updated upstream
        <button
          onClick={() => navigate("/marketplace")}
          className="rounded-lg px-4 py-2 hover:bg-gray-100"
        >
          Marketplace
        </button>

        <button
          onClick={() => navigate("/roomies")}
          className="rounded-lg px-4 py-2 hover:bg-gray-100"
        >
          Roomies
        </button>
=======
        {/* ==================== NAVIGATION ==================== */}
        <div className="flex items-center gap-1">
          <NavLink to="/" className={navLinkStyle}>
            Home
          </NavLink>
>>>>>>> Stashed changes

        <button
          onClick={() => navigate("/stay")}
          className="rounded-lg px-4 py-2 hover:bg-gray-100"
        >
          Stay
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="rounded-lg px-4 py-2 hover:bg-gray-100"
        >
          Profile
        </button>

<<<<<<< Updated upstream
        <button
          onClick={handleLogout}
          className="ml-2 rounded-lg px-4 py-2 hover:bg-gray-100"
        >
          Logout
        </button>
=======
          <NavLink to="/marketplace" className={navLinkStyle}>
            Marketplace
          </NavLink>

          <NavLink to="/about" className={navLinkStyle}>
            About Us
          </NavLink>
        </div>

        {/* ==================== RIGHT SIDE ==================== */}
        <div className="flex items-center gap-5">
          {/* ==================== CHAT ==================== */}
          <button
            onClick={() => navigate("/chat")}
            aria-label="Chat"
            className={`group relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
              isRoomies
                ? "text-[#C6B39A] hover:text-[#F5EEE6]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:scale-110"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
            </svg>
          </button>

          {/* ==================== NOTIFICATIONS ==================== */}
          <button
            onClick={() => navigate("/notifications")}
            aria-label="Notifications"
            className={`group relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
              isRoomies
                ? "text-[#C6B39A] hover:text-[#F5EEE6]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:scale-110"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>

            {unreadNotifications > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8D3A3C] px-1 text-[10px] font-semibold text-white shadow-[0_0_8px_rgba(141,58,60,0.5)]">
                {unreadNotifications > 99 ? "99+" : unreadNotifications}
              </span>
            )}
          </button>

          {/* ==================== PROFILE AVATAR ==================== */}
          <button
            onClick={() => navigate("/profile")}
            aria-label="Profile"
            title={username || "Profile"}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 hover:scale-105 ${
              isRoomies
                ? "bg-[#C6B39A] text-[#280B0F] hover:shadow-[0_0_12px_rgba(198,179,154,0.35)]"
                : "bg-white text-black hover:shadow-[0_0_12px_rgba(255,255,255,0.35)]"
            }`}
          >
            {username ? username.charAt(0).toUpperCase() : "?"}
          </button>
        </div>
>>>>>>> Stashed changes
      </div>
    </nav>
  );
}

export default Navbar;
