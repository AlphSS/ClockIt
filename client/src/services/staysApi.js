const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5800/api/stays";

// ─── Helper ───────────────────────────────────────────────────────────────────

async function apiFetch(path, options = {}, token = null) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// ─── Stays ────────────────────────────────────────────────────────────────────

export async function fetchStays(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") query.set(k, v);
  });
  return apiFetch(`/stays?${query.toString()}`);
}

export async function fetchFeaturedStays() {
  return apiFetch("/stays/featured");
}

export async function fetchStayById(id) {
  return apiFetch(`/stays/${id}`);
}

export async function fetchMyListings(token) {
  return apiFetch("/stays/my/listings", {}, token);
}

export async function createStay(stayData, token) {
  return apiFetch("/stays", { method: "POST", body: JSON.stringify(stayData) }, token);
}

export async function updateStay(id, stayData, token) {
  return apiFetch(`/stays/${id}`, { method: "PUT", body: JSON.stringify(stayData) }, token);
}

export async function updateStayStatus(id, status, token) {
  return apiFetch(`/stays/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }, token);
}

export async function deleteStay(id, token) {
  return apiFetch(`/stays/${id}`, { method: "DELETE" }, token);
}

export async function saveStay(id, token) {
  return apiFetch(`/stays/${id}/save`, { method: "POST" }, token);
}

export async function unsaveStay(id, token) {
  return apiFetch(`/stays/${id}/save`, { method: "DELETE" }, token);
}

export async function recordStayView(id, token = null) {
  return apiFetch(`/stays/${id}/view`, { method: "POST" }, token);
}

export async function createInquiry(stayId, message, token) {
  return apiFetch(
    `/stays/${stayId}/inquiries`,
    { method: "POST", body: JSON.stringify({ message }) },
    token
  );
}

export async function uploadStayImage(file, token) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${API_URL}/stays/upload/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data;
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function fetchStayReviews(stayId) {
  return apiFetch(`/stays/${stayId}/reviews`);
}

export async function createStayReview(stayId, reviewData, token) {
  return apiFetch(
    `/stays/${stayId}/reviews`,
    { method: "POST", body: JSON.stringify(reviewData) },
    token
  );
}

export async function updateStayReview(stayId, reviewId, reviewData, token) {
  return apiFetch(
    `/stays/${stayId}/reviews/${reviewId}`,
    { method: "PUT", body: JSON.stringify(reviewData) },
    token
  );
}

export async function deleteStayReview(stayId, reviewId, token) {
  return apiFetch(
    `/stays/${stayId}/reviews/${reviewId}`,
    { method: "DELETE" },
    token
  );
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function fetchSavedStays(token) {
  return apiFetch("/users/me/saved-stays", {}, token);
}

export async function fetchRecentlyViewed(token) {
  return apiFetch("/users/me/recently-viewed", {}, token);
}

export async function fetchMyInquiries(token) {
  return apiFetch("/users/me/inquiries", {}, token);
}

// ─── Areas ────────────────────────────────────────────────────────────────────

export async function fetchAreas() {
  return apiFetch("/areas");
}

export async function fetchAreaReviews(areaId, page = 1) {
  return apiFetch(`/areas/${areaId}/reviews?page=${page}`);
}

export async function createAreaReview(areaId, reviewData, token) {
  return apiFetch(
    `/areas/${areaId}/reviews`,
    { method: "POST", body: JSON.stringify(reviewData) },
    token
  );
}

// ─── Seed ─────────────────────────────────────────────────────────────────────

export async function seedDatabase() {
  return apiFetch("/stays/seed");
}
