import { supabase } from "./supabase";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5800/api";

async function request(path, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Your session has expired. Please log in again.");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}`, ...(options.headers || {}) },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || "Chat request failed.");
  return result;
}
export async function getConversations() { return request("/chat/conversations"); }
export async function searchChatUsers(q) { return request(`/chat/users?q=${encodeURIComponent(q)}`); }
export async function startConversation(userId) { return request("/chat/conversations", { method: "POST", body: JSON.stringify({ userId }) }); }
export async function getMessages(conversationId) { return request(`/chat/conversations/${encodeURIComponent(conversationId)}/messages`); }
export async function sendChatMessage(conversationId, body) { return request(`/chat/conversations/${encodeURIComponent(conversationId)}/messages`, { method: "POST", body: JSON.stringify({ body }) }); }
