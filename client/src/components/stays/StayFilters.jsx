import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { useState } from "react";

const BHK_OPTIONS = ["1 RK", "1 BHK", "2 BHK", "3+ BHK"];
const FURNISHING_OPTIONS = [
  { value: "all", label: "All" },
  { value: "furnished", label: "Furnished" },
  { value: "semi-furnished", label: "Semi Furnished" },
  { value: "unfurnished", label: "Unfurnished" },
];
const ALL_AMENITIES = [
  "WiFi", "Parking", "Lift", "Power Backup", "Security", "Water Supply",
  "AC", "Washing Machine", "Kitchen", "Balcony", "Gym",
];

export default function StayFilters({ filters, updateFilter, updateFilters, resetFilters, total }) {
  const [showMoreAmenities, setShowMoreAmenities] = useState(false);
  const visibleAmenities = showMoreAmenities ? ALL_AMENITIES : ALL_AMENITIES.slice(0, 6);

  function toggleBhk(value) {
    const current = Array.isArray(filters.bhk) ? filters.bhk : [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter("bhk", next.length === 0 ? "any" : next.join(","));
  }

  function isBhkSelected(value) {
    if (!filters.bhk || filters.bhk === "any") return false;
    return filters.bhk.split(",").includes(value);
  }

  function toggleAmenity(amenity) {
    const current = filters.amenities || [];
    const next = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    updateFilter("amenities", next);
  }

  const hasActiveFilters =
    filters.minPrice || filters.maxPrice ||
    (filters.bhk && filters.bhk !== "any") ||
    (filters.furnishing && filters.furnishing !== "all") ||
    filters.amenities?.length > 0;

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    fontSize: "13px",
    borderRadius: "10px",
    border: "1.5px solid #E8E0D8",
    backgroundColor: "#F8F4EF",
    color: "#18100E",
    outline: "none",
    transition: "border-color 0.15s",
  };

  return (
    <aside
      className="rounded-2xl p-5"
      style={{ backgroundColor: "#FDFAF5", border: "1px solid #E8E0D8", boxShadow: "0 2px 12px rgba(24,16,14,0.05)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: "#18100E" }}>Filters</h3>
          {total > 0 && (
            <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{total} flats found</p>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-semibold transition-colors"
            style={{ color: "#7B3045" }}
          >
            <RotateCcw size={11} /> Reset
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-5">
        <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#18100E" }}>
          Price Range
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs mb-1 block" style={{ color: "#9CA3AF" }}>Min ₹</label>
            <input
              type="number"
              placeholder="3,000"
              value={filters.minPrice}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#7B3045"}
              onBlur={(e) => e.target.style.borderColor = "#E8E0D8"}
            />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: "#9CA3AF" }}>Max ₹</label>
            <input
              type="number"
              placeholder="25,000"
              value={filters.maxPrice}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#7B3045"}
              onBlur={(e) => e.target.style.borderColor = "#E8E0D8"}
            />
          </div>
        </div>
      </div>

      <div className="mb-5 h-px" style={{ backgroundColor: "#E8E0D8" }} />

      {/* BHK */}
      <div className="mb-5">
        <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#18100E" }}>
          BHK Type
        </h4>
        <div className="flex flex-wrap gap-2">
          {BHK_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => toggleBhk(opt)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={
                isBhkSelected(opt)
                  ? { backgroundColor: "#18100E", color: "#F3EEE7", border: "1.5px solid #18100E" }
                  : { backgroundColor: "#F3EEE7", color: "#6B7280", border: "1.5px solid #E8E0D8" }
              }
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 h-px" style={{ backgroundColor: "#E8E0D8" }} />

      {/* Furnishing */}
      <div className="mb-5">
        <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#18100E" }}>
          Furnishing
        </h4>
        <div className="space-y-2.5">
          {FURNISHING_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => updateFilter("furnishing", opt.value)}
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer"
                style={{
                  borderColor: (filters.furnishing || "all") === opt.value ? "#7B3045" : "#C4B8AE",
                  backgroundColor: (filters.furnishing || "all") === opt.value ? "#7B3045" : "transparent",
                }}
              >
                {(filters.furnishing || "all") === opt.value && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <span className="text-sm" style={{ color: "#18100E" }}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-5 h-px" style={{ backgroundColor: "#E8E0D8" }} />

      {/* Amenities */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#18100E" }}>
          Amenities
        </h4>
        <div className="space-y-2.5">
          {visibleAmenities.map((amenity) => {
            const checked = (filters.amenities || []).includes(amenity);
            return (
              <label key={amenity} className="flex items-center gap-2.5 cursor-pointer">
                <div
                  onClick={() => toggleAmenity(amenity)}
                  className="w-4 h-4 rounded flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
                  style={{
                    border: `1.5px solid ${checked ? "#7B3045" : "#C4B8AE"}`,
                    backgroundColor: checked ? "#7B3045" : "transparent",
                  }}
                >
                  {checked && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm" style={{ color: "#18100E" }}>{amenity}</span>
              </label>
            );
          })}
        </div>
        <button
          onClick={() => setShowMoreAmenities((o) => !o)}
          className="mt-3 flex items-center gap-1 text-xs font-semibold"
          style={{ color: "#7B3045" }}
        >
          {showMoreAmenities
            ? <><ChevronUp size={12} /> Show less</>
            : <><ChevronDown size={12} /> Show more ({ALL_AMENITIES.length - 6}+)</>
          }
        </button>
      </div>
    </aside>
  );
}
