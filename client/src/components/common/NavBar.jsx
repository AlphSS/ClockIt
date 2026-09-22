import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

function Navbar() {
  const navigate = useNavigate();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error);
      return;
    }

    navigate("/login", { replace: true });
  }

  return (
    <nav className="flex items-center justify-between border-b border-gray-200 px-8 py-4">
      {/* Logo */}
      <button onClick={() => navigate("/")} className="text-2xl font-bold">
        ClockIt
      </button>

      {/* Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/")}
          className="rounded-lg px-4 py-2 hover:bg-gray-100"
        >
          Home
        </button>

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

        <button
          onClick={() => navigate("/stays")}
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

        <button
          onClick={handleLogout}
          className="ml-2 rounded-lg px-4 py-2 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
