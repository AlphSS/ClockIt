import { createClient } from "@supabase/supabase-js";
import ws from "ws";

if (!globalThis.WebSocket) {
  globalThis.WebSocket = ws;
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);


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