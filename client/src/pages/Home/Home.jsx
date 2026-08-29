import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

function Home() {
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
    <div>
      <h1>Welcome to UniNest</h1>
      <p>You are logged in.</p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Home;