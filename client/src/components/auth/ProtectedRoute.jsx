import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!active) return;

      setSession(error ? null : data.session);
      setLoading(false);
    }

    checkSession();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
