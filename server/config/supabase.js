import { createClient } from "@supabase/supabase-js";
import ws from "ws";

if (!globalThis.WebSocket) {
  globalThis.WebSocket = ws;
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseSecretKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);