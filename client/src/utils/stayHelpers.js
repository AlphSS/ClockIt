// Format rent as INR
export function formatRent(amount) {
  if (!amount) return "₹0";
  return `₹${parseInt(amount).toLocaleString("en-IN")}`;
}

// Format area sqft
export function formatArea(sqft) {
  if (!sqft) return null;
  return `${sqft} sqft`;
}

// Get furnishing label
export function getFurnishingLabel(furnishing) {
  const map = {
    furnished: "Fully Furnished",
    "semi-furnished": "Semi Furnished",
    unfurnished: "Unfurnished",
  };
  return map[furnishing] || furnishing;
}

// Format date like "15 Jun 2025"
export function formatDate(dateStr) {
  if (!dateStr) return "Immediate";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// Get amenity icon (emoji fallback)
const amenityIcons = {
  WiFi: "📶",
  Parking: "🚗",
  Lift: "🛗",
  "Power Backup": "⚡",
  Security: "🔒",
  "Water Supply": "💧",
  AC: "❄️",
  "Washing Machine": "🫧",
  Kitchen: "🍳",
  Balcony: "🏡",
  Gym: "💪",
  "Swimming Pool": "🏊",
};

export function getAmenityIcon(amenity) {
  return amenityIcons[amenity] || "✓";
}

// Star rating display (returns filled/half/empty counts)
export function getRatingBreakdown(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return { full, half, empty };
}

// Truncate text
export function truncate(text, maxLength = 100) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Build query string from filter state
export function buildFilterQuery(filters) {
  const params = {};
  if (filters.location) params.location = filters.location;
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.bhk && filters.bhk !== "any") params.bhk = filters.bhk;
  if (filters.furnishing && filters.furnishing !== "all") params.furnishing = filters.furnishing;
  if (filters.amenities?.length) params.amenities = filters.amenities.join(",");
  if (filters.sort) params.sort = filters.sort;
  if (filters.page) params.page = filters.page;
  return params;
}

// Get first image or placeholder
export function getFirstImage(images) {
  if (images?.length > 0) return images[0];
  return "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800";
}

// Verification badge
export function getVerificationBadge(status) {
  if (status === "verified") return { label: "Verified", color: "verified" };
  if (status === "pending") return { label: "Pending", color: "pending" };
  return { label: "Unverified", color: "unverified" };
}
