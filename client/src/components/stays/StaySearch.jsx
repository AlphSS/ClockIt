import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";

const BHK_OPTIONS = ["Any", "1 RK", "1 BHK", "2 BHK", "3+ BHK"];
const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
];

export default function StaySearch({ filters, updateFilter, updateFilters, onMoreFilters }) {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const currentSort = SORT_OPTIONS.find((o) => o.value === filters.sort) || SORT_OPTIONS[0];

  const inputStyle = {
    backgroundColor: "#FDFAF5",
    border: "1.5px solid #E8E0D8",
    color: "#18100E",
    borderRadius: "12px",
    outline: "none",
    width: "100%",
    padding: "12px 16px",
    fontSize: "14px",
    transition: "border-color 0.15s",
  };

  function focusInput(e) { e.target.style.borderColor = "#7B3045"; }
  function blurInput(e) { e.target.style.borderColor = "#E8E0D8"; }

  return (
    <div
      className="rounded-2xl p-8"
      style={{ backgroundColor: "#18100E" }}
    >
      {/* Breadcrumb */}
      <p
        className="text-xs font-semibold tracking-[0.18em] uppercase mb-3"
        style={{ color: "#7B3045" }}
      >
        ClockIt &bull; Stays
      </p>

      {/* Heading */}
      <h1
        className="font-bold mb-2"
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
          color: "#F3EEE7",
          lineHeight: 1.1,
        }}
      >
        Find your perfect flat.
      </h1>
      <p className="text-sm mb-7" style={{ color: "#9CA3AF" }}>
        Discover verified rooms &amp; apartments near your campus.
      </p>

      {/* Search row */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Location */}
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#6B7280" }}>
            Location
          </label>
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
            <input
              type="text"
              placeholder="Search area, locality..."
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              style={{ ...inputStyle, paddingLeft: "38px" }}
              onFocus={focusInput}
              onBlur={blurInput}
            />
          </div>
        </div>

        {/* Budget */}
        <div className="flex gap-2 md:w-52">
          <div className="flex-1">
            <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#6B7280" }}>
              Min ₹
            </label>
            <input
              type="number"
              placeholder="3,000"
              value={filters.minPrice}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
              style={inputStyle}
              onFocus={focusInput}
              onBlur={blurInput}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#6B7280" }}>
              Max ₹
            </label>
            <input
              type="number"
              placeholder="25,000"
              value={filters.maxPrice}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
              style={inputStyle}
              onFocus={focusInput}
              onBlur={blurInput}
            />
          </div>
        </div>

        {/* BHK */}
        <div className="md:w-36">
          <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#6B7280" }}>
            BHK
          </label>
          <select
            value={filters.bhk}
            onChange={(e) => updateFilter("bhk", e.target.value)}
            style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
            onFocus={focusInput}
            onBlur={blurInput}
          >
            {BHK_OPTIONS.map((opt) => (
              <option key={opt} value={opt === "Any" ? "any" : opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 items-end">
          <button
            onClick={onMoreFilters}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              backgroundColor: "rgba(243,238,231,0.08)",
              border: "1.5px solid rgba(243,238,231,0.15)",
              color: "#D1C7BB",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(243,238,231,0.14)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(243,238,231,0.08)"}
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filters</span>
          </button>
          <button
            className="px-6 py-3 rounded-xl text-sm font-bold tracking-wide transition-all"
            style={{ backgroundColor: "#7B3045", color: "#F3EEE7" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#6a2638"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#7B3045"}
          >
            Search
          </button>
        </div>
      </div>

      {/* Sort row */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs" style={{ color: "#6B7280" }}>
          Use filters to narrow your search
        </p>
        <div className="relative">
          <button
            onClick={() => setShowSortMenu((o) => !o)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              backgroundColor: "rgba(243,238,231,0.08)",
              border: "1px solid rgba(243,238,231,0.12)",
              color: "#D1C7BB",
            }}
          >
            <span>{currentSort.label}</span>
            <ChevronDown size={11} className={showSortMenu ? "rotate-180" : ""} />
          </button>
          {showSortMenu && (
            <div
              className="absolute right-0 top-full mt-1.5 w-48 rounded-xl py-1 z-30"
              style={{ backgroundColor: "#FDFAF5", boxShadow: "0 8px 24px rgba(24,16,14,0.14)", border: "1px solid #E8E0D8" }}
            >
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { updateFilter("sort", opt.value); setShowSortMenu(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                  style={{
                    color: filters.sort === opt.value ? "#7B3045" : "#18100E",
                    backgroundColor: filters.sort === opt.value ? "#F3EEE7" : "transparent",
                    fontWeight: filters.sort === opt.value ? "600" : "400",
                  }}
                  onMouseEnter={(e) => { if (filters.sort !== opt.value) e.currentTarget.style.backgroundColor = "#F8F4EF"; }}
                  onMouseLeave={(e) => { if (filters.sort !== opt.value) e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
