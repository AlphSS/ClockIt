import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [showSortMenu, setShowSortMenu] = useState(false);

  function handleSearch() {
    // Triggers the debounced fetch via useStays — nothing extra needed
  }

  function handleAreaClick(area) {
    updateFilter("location", area);
  }

  const currentSort = SORT_OPTIONS.find((o) => o.value === filters.sort) || SORT_OPTIONS[0];

  return (
    <div className="bg-gradient-to-br from-cyan-600 via-cyan-500 to-teal-500 rounded-2xl p-6 md:p-8 shadow-lg">
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
          Find Your Perfect Stay 🏠
        </h1>
        <p className="text-cyan-100 text-sm md:text-base">
          Discover verified flats and rooms near your campus.
        </p>
      </div>

      {/* Search bar row */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Location */}
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-semibold text-cyan-100 mb-1.5 uppercase tracking-wide">
            Location
          </label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search area..."
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-9 pr-4 py-3 bg-white rounded-xl text-sm text-gray-800 placeholder:text-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 shadow-sm"
            />
          </div>
        </div>

        {/* Budget */}
        <div className="flex gap-2 md:w-56">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-cyan-100 mb-1.5 uppercase tracking-wide">
              Min ₹
            </label>
            <input
              type="number"
              placeholder="3,000"
              value={filters.minPrice}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
              className="w-full px-3 py-3 bg-white rounded-xl text-sm text-gray-800 placeholder:text-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 shadow-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-cyan-100 mb-1.5 uppercase tracking-wide">
              Max ₹
            </label>
            <input
              type="number"
              placeholder="25,000"
              value={filters.maxPrice}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
              className="w-full px-3 py-3 bg-white rounded-xl text-sm text-gray-800 placeholder:text-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 shadow-sm"
            />
          </div>
        </div>

        {/* BHK */}
        <div className="md:w-40">
          <label className="block text-xs font-semibold text-cyan-100 mb-1.5 uppercase tracking-wide">
            BHK
          </label>
          <select
            value={filters.bhk}
            onChange={(e) => updateFilter("bhk", e.target.value)}
            className="w-full px-3 py-3 bg-white rounded-xl text-sm text-gray-800 border-0 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 shadow-sm appearance-none cursor-pointer"
          >
            {BHK_OPTIONS.map((opt) => (
              <option key={opt} value={opt === "Any" ? "any" : opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 items-end">
          <button
            onClick={onMoreFilters}
            className="flex items-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-xl transition border border-white/30 backdrop-blur-sm"
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">More Filters</span>
          </button>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Search
          </button>
        </div>
      </div>

      {/* Sort row */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-cyan-100 text-xs">
          Use the filters below to narrow your search
        </p>
        <div className="relative">
          <button
            onClick={() => setShowSortMenu((o) => !o)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-medium rounded-lg transition border border-white/20"
          >
            <span>{currentSort.label}</span>
            <ChevronDown size={12} className={showSortMenu ? "rotate-180" : ""} />
          </button>
          {showSortMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-30">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    updateFilter("sort", opt.value);
                    setShowSortMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition ${
                    filters.sort === opt.value
                      ? "bg-cyan-50 text-cyan-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
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
