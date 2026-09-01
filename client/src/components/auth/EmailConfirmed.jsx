import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

function EmailConfirmed() {
  const navigate = useNavigate();

  useEffect(() => {
    async function checkVerification() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      if (user.email_confirmed_at) {
        navigate("/account-created", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }

    checkVerification();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-text-secondary">Verifying your email...</p>
    </div>
  );
}

export default EmailConfirmed;
