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
    <nav>
      <div>
        <h2>UniNest</h2>
      </div>

      <div>
        <button onClick={() => navigate("/")}>
          Home
        </button>

        <button onClick={() => navigate("/marketplace")}>
          Marketplace
        </button>

        <button onClick={() => navigate("/roomies")}>
          Roomies
        </button>

        <button onClick={() => navigate("/stay")}>
          Stay
        </button>

        <button onClick={() => navigate("/profile")}>
          Profile
        </button>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;