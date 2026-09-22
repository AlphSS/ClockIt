import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is missing in the .env file");
}

if (!supabasePublishableKey) {
  throw new Error("SUPABASE_PUBLISHABLE_KEY is missing in the .env file");
}

if (!supabaseSecretKey) {
  throw new Error("SUPABASE_SECRET_KEY is missing in the .env file");
}

// Normal Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);

// Admin Supabase client
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