import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, Plus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const BHK_OPTIONS = ["Any", "1 RK", "1 BHK", "2 BHK", "3+ BHK"];
const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest Listings" },
  { value: "price_asc", label: "Rent: Low to High" },
  { value: "price_desc", label: "Rent: High to Low" },
  { value: "closest", label: "Closest to College" },
  { value: "rating", label: "Highest Rated" },
];

export default function StaySearch({ filters, updateFilter, updateFilters, onMoreFilters }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showSortMenu, setShowSortMenu] = useState(false);
  const currentSort = SORT_OPTIONS.find((o) => o.value === filters.sort) || SORT_OPTIONS[0];

  const inputStyle = {
    backgroundColor: "#FDFAF5",
    border: "1.5px solid #E8E0D8",
    color: "#18100E",
    borderRadius: "14px",
    outline: "none",
    width: "100%",
    padding: "12px 16px",
    fontSize: "14px",
    transition: "all 0.2s ease",
  };

  function focusInput(e) { e.target.style.borderColor = "#7B3045"; }
  function blurInput(e) { e.target.style.borderColor = "#E8E0D8"; }

  function handleListYourPlace() {
    if (user) {
      navigate("/stays/create");
    } else {
      navigate("/login");
    }
  }

  function scrollToGrid() {
    const element = document.getElementById("stays-grid-container");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="space-y-6">
      {/* Editorial Hero Container */}
      <div
        className="rounded-3xl p-6 sm:p-10 relative overflow-hidden transition-all"
        style={{
          backgroundColor: "#18100E",
          boxShadow: "0 12px 40px rgba(24,16,14,0.18)",
        }}
      >
        {/* Background accent glow */}
        <div
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: "#7B3045" }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-[0.2em] uppercase"
                 style={{ backgroundColor: "rgba(123,48,69,0.25)", color: "#F3EEE7", border: "1px solid rgba(123,48,69,0.4)" }}>
              <Sparkles size={12} style={{ color: "#F3EEE7" }} />
              CLOCKIT STAYS
            </div>

            <h1
              className="font-bold leading-[1.08] tracking-tight"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
                color: "#F3EEE7",
              }}
            >
              Find a place <br />
              <span className="italic font-normal" style={{ color: "#E8E0D8" }}>that feels like</span> home.
            </h1>

            <p className="text-base sm:text-lg max-w-xl leading-relaxed" style={{ color: "#9CA3AF" }}>
              Discover student-friendly flats, rooms, and shared spaces close to campus with verified pricing and zero brokerage hassle.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={scrollToGrid}
                className="px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all shadow-md"
                style={{ backgroundColor: "#7B3045", color: "#F3EEE7" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#6a2638"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#7B3045"}
              >
                Explore stays
              </button>

              <button
                onClick={handleListYourPlace}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all"
                style={{
                  backgroundColor: "rgba(243,238,231,0.08)",
                  border: "1.5px solid rgba(243,238,231,0.18)",
                  color: "#F3EEE7",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(243,238,231,0.16)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(243,238,231,0.08)"}
              >
                <Plus size={16} /> List your place
              </button>
            </div>
          </div>

          {/* Right Layered Hero Image */}
          <div className="lg:col-span-5 relative hidden sm:block">
            <div
              className="rounded-3xl overflow-hidden shadow-2xl transform rotate-1 transition-transform hover:rotate-0 duration-500"
              style={{ border: "2px solid rgba(243,238,231,0.1)" }}
            >
              <img
                src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
                alt="ClockIt Stays Showcase"
                className="w-full h-64 lg:h-72 object-cover"
              />
            </div>

            {/* Floating Info Pill */}
            <div
              className="absolute -bottom-4 -left-4 p-4 rounded-2xl shadow-xl flex items-center gap-3"
              style={{
                backgroundColor: "#FDFAF5",
                border: "1px solid #E8E0D8",
                color: "#18100E",
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg" style={{ backgroundColor: "#7B3045", color: "#FDFAF5" }}>
                100%
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Student Verified</p>
                <p className="text-xs font-medium text-gray-800">Close to Pune Campuses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Integrated Search Bar Section inside Hero */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-end">
            {/* Search Input */}
            <div className="md:col-span-5">
              <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#9CA3AF" }}>
                Keyword Search
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
                <input
                  type="text"
                  placeholder="Search title, area, college, locality..."
                  value={filters.search}
                  onChange={(e) => updateFilter("search", e.target.value)}
                  style={{ ...inputStyle, paddingLeft: "40px" }}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </div>
            </div>

            {/* Location Input */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#9CA3AF" }}>
                Location / Area
              </label>
              <input
                type="text"
                placeholder="e.g. Kothrud, Baner"
                value={filters.location}
                onChange={(e) => updateFilter("location", e.target.value)}
                style={inputStyle}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>

            {/* BHK Select */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#9CA3AF" }}>
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

            {/* Filter Toggle Button */}
            <div className="md:col-span-2">
              <button
                onClick={onMoreFilters}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  backgroundColor: "rgba(243,238,231,0.08)",
                  border: "1.5px solid rgba(243,238,231,0.18)",
                  color: "#F3EEE7",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(243,238,231,0.16)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(243,238,231,0.08)"}
              >
                <SlidersHorizontal size={15} />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Sort Bar */}
        <div className="mt-4 flex items-center justify-between text-xs" style={{ color: "#9CA3AF" }}>
          <span>Find housing tailored for university life</span>
          <div className="relative">
            <button
              onClick={() => setShowSortMenu((o) => !o)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: "rgba(243,238,231,0.08)",
                border: "1px solid rgba(243,238,231,0.12)",
                color: "#E8E0D8",
              }}
            >
              <span>Sort: {currentSort.label}</span>
              <ChevronDown size={11} className={showSortMenu ? "rotate-180" : ""} />
            </button>
            {showSortMenu && (
              <div
                className="absolute right-0 top-full mt-1.5 w-48 rounded-xl py-1 z-30 shadow-2xl"
                style={{ backgroundColor: "#FDFAF5", border: "1px solid #E8E0D8" }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { updateFilter("sort", opt.value); setShowSortMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm transition-colors"
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
    </div>
  );
}
