<<<<<<< Updated upstream
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      <h1>Welcome to UniNest</h1>
      <p>You are logged in.</p>

      <button onClick={handleLogout}>
        Logout
      </button>
=======
      <main className="px-8 py-12">
        <h1 className="text-4xl font-bold">Welcome to ClockIt</h1>

        <p className="mt-3 text-gray-600">
          Your student community starts here.
        </p>
      </main>
>>>>>>> Stashed changes
    </div>
  );
}

export default Home;
