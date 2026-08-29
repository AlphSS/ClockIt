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

  return (
    <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-gray-900">Filters</h3>
          {total > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">{total} flats found</p>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-700 font-medium"
          >
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Price Range</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Min ₹</label>
            <input
              type="number"
              placeholder="3,000"
              value={filters.minPrice}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Max ₹</label>
            <input
              type="number"
              placeholder="25,000"
              value={filters.maxPrice}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 mb-6" />

      {/* BHK */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">BHK Type</h4>
        <div className="flex flex-wrap gap-2">
          {BHK_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => toggleBhk(opt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                isBhkSelected(opt)
                  ? "bg-cyan-500 text-white border-cyan-500"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-cyan-300 hover:text-cyan-600"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 mb-6" />

      {/* Furnishing */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Furnishing</h4>
        <div className="space-y-2">
          {FURNISHING_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="furnishing"
                value={opt.value}
                checked={(filters.furnishing || "all") === opt.value}
                onChange={() => updateFilter("furnishing", opt.value)}
                className="w-4 h-4 text-cyan-500 border-gray-300 focus:ring-cyan-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 mb-6" />

      {/* Amenities */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Amenities</h4>
        <div className="space-y-2">
          {visibleAmenities.map((amenity) => (
            <label key={amenity} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={(filters.amenities || []).includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition">
                {amenity}
              </span>
            </label>
          ))}
        </div>
        <button
          onClick={() => setShowMoreAmenities((o) => !o)}
          className="mt-3 flex items-center gap-1 text-xs font-medium text-cyan-600 hover:text-cyan-700"
        >
          {showMoreAmenities ? (
            <><ChevronUp size={12} /> Show less</>
          ) : (
            <><ChevronDown size={12} /> Show more ({ALL_AMENITIES.length - 6}+)</>
          )}
        </button>
      </div>
    </aside>
  );
}
