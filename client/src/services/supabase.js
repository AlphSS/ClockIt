import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Temporary to get bearer code
window.getClockItToken = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("Access Token:", session?.access_token);

  return session?.access_token;
};
