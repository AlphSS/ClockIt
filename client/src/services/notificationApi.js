import { supabase } from "./supabase";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5800/api";

async function request(path, options = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token)
    throw new Error("Your session has expired. Please log in again.");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      ...(options.headers || {}),
    },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(result.message || "Notification request failed.");
  return result;
}
export async function getNotifications(type = "all") {
  return request(`/notifications?type=${encodeURIComponent(type)}`);
}
export async function markNotificationRead(id) {
  return request(`/notifications/${encodeURIComponent(id)}/read`, {
    method: "PATCH",
  });
}
export async function markAllNotificationsRead() {
  return request("/notifications/read-all", { method: "PATCH" });
}
