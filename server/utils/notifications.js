import { supabaseAdmin } from "../config/supabase.js";

const allowedTypes = new Set(["chat", "roomies", "marketplace", "stays", "system"]);

// Shared helper for future modules: use this after a real business event succeeds.
export async function createNotification({ userId, type = "system", title, description = "", entityType = null, entityId = null, actionUrl = null }) {
  if (!userId || !title || !allowedTypes.has(type)) return { data: null, error: new Error("Invalid notification input") };
  return supabaseAdmin.from("notifications").insert({
    user_id: userId,
    type,
    title: String(title).slice(0, 180),
    description: String(description).slice(0, 500),
    entity_type: entityType,
    entity_id: entityId,
    action_url: actionUrl,
  }).select("id, user_id, type, title, description, entity_type, entity_id, action_url, is_read, created_at").single();
}
