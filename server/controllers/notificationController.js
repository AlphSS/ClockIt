import { supabaseAdmin } from "../config/supabase.js";

const allowedTypes = new Set(["all", "unread", "chat", "roomies", "marketplace", "stays", "system"]);

export async function getNotifications(req, res) {
  try {
    const userId = req.user.id;
    const type = String(req.query.type || "all");
    if (!allowedTypes.has(type)) return res.status(400).json({ success: false, message: "Invalid notification filter." });
    let query = supabaseAdmin.from("notifications").select("id, user_id, type, title, description, entity_type, entity_id, action_url, is_read, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(100);
    if (type === "unread") query = query.eq("is_read", false);
    else if (type !== "all") query = query.eq("type", type);
    const { data, error } = await query;
    if (error) throw error;
    const { count, error: countError } = await supabaseAdmin.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("is_read", false);
    if (countError) throw countError;
    return res.json({ success: true, notifications: data || [], unreadCount: count || 0 });
  } catch (error) {
    console.error("Get notifications error:", error);
    return res.status(500).json({ success: false, message: "Unable to fetch notifications." });
  }
}

export async function markNotificationRead(req, res) {
  try {
    const { data, error } = await supabaseAdmin.from("notifications").update({ is_read: true, read_at: new Date().toISOString() }).eq("id", req.params.id).eq("user_id", req.user.id).select("id, is_read, read_at").maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: "Notification not found." });
    return res.json({ success: true, notification: data });
  } catch (error) {
    console.error("Mark notification read error:", error);
    return res.status(500).json({ success: false, message: "Unable to update notification." });
  }
}

export async function markAllNotificationsRead(req, res) {
  try {
    const { error } = await supabaseAdmin.from("notifications").update({ is_read: true, read_at: new Date().toISOString() }).eq("user_id", req.user.id).eq("is_read", false);
    if (error) throw error;
    return res.json({ success: true, message: "All notifications marked as read." });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    return res.status(500).json({ success: false, message: "Unable to update notifications." });
  }
}
