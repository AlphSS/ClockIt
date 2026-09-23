import { useState, useCallback } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import NavBar from "../../components/common/NavBar";
import StaySearch from "../../components/stays/StaySearch";
import StayGrid from "../../components/stays/StayGrid";
import StayFilters from "../../components/stays/StayFilters";
import PopularAreas from "../../components/stays/PopularAreas";
import FeaturedStays from "../../components/stays/FeaturedStays";
import AreaReviews from "../../components/stays/AreaReviews";
import PostFlatCard from "../../components/stays/PostFlatCard";
import { useStays } from "../../hooks/useStays";
import { useSavedStays } from "../../hooks/useSavedStays";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function StaysHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const {
    stays, loading, error, filters,
    updateFilter, updateFilters, resetFilters,
    loadMore, hasMore, total,
  } = useStays();

  const { isSaved, toggle: toggleSave, loading: saveLoading } = useSavedStays();

  function handleToggleSave(stayId) {
    if (!user) {
      navigate("/login");
      return;
    }
    toggleSave(stayId);
  }

  function handleAreaClick(area) {
    updateFilter("location", area);
    window.scrollTo({ top: 400, behavior: "smooth" });
  }

  const sharedCardProps = {
    isSaved,
    onToggleSave: handleToggleSave,
    saveLoading,
  };

  const isSearching = Object.values(filters).some((v) =>
    Array.isArray(v) ? v.length > 0 : v && v !== "any" && v !== "all" && v !== "recommended"
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3EEE7" }}>
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Search hero */}
        <StaySearch
          filters={filters}
          updateFilter={updateFilter}
          updateFilters={updateFilters}
          onMoreFilters={() => setMobileFiltersOpen(true)}
        />

        {/* Popular areas */}
        <PopularAreas
          onAreaClick={handleAreaClick}
          activeArea={filters.location}
        />

        {/* Main content layout */}
        <div className="flex gap-6">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-4">
            <StayFilters
              filters={filters}
              updateFilter={updateFilter}
              updateFilters={updateFilters}
              resetFilters={resetFilters}
              total={total}
            />
            <PostFlatCard />
          </aside>

          {/* Feed */}
          <div className="flex-1 min-w-0 space-y-10">
            {/* Mobile filter strip */}
            <div className="lg:hidden flex items-center justify-between">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{ backgroundColor: "#FDFAF5", border: "1.5px solid #E8E0D8", color: "#18100E", boxShadow: "0 2px 8px rgba(24,16,14,0.06)" }}
              >
                <SlidersHorizontal size={15} />
                Filters
                {total > 0 && (
                  <span className="text-xs font-bold" style={{ color: "#7B3045" }}>({total})</span>
                )}
              </button>
              <PostFlatCard />
            </div>

            {/* Featured flats (only when not searching) */}
            {!isSearching && (
              <FeaturedStays {...sharedCardProps} />
            )}

            {/* All / Filtered flats */}
            <StayGrid
              stays={stays}
              loading={loading}
              error={error}
              hasMore={hasMore}
              onLoadMore={loadMore}
              title={isSearching ? `Search Results ${total > 0 ? `(${total})` : ""}` : "All Flats"}
              {...sharedCardProps}
            />

            {/* Area reviews (only when not searching) */}
            {!isSearching && <AreaReviews />}
          </div>
        </div>
      </main>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div
            className="w-80 max-w-full h-full overflow-y-auto shadow-2xl p-4"
            style={{ backgroundColor: "#F3EEE7" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: "#18100E" }}>Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: "#9CA3AF" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#E8E0D8"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <X size={16} />
              </button>
            </div>
            <StayFilters
              filters={filters}
              updateFilter={updateFilter}
              updateFilters={updateFilters}
              resetFilters={resetFilters}
              total={total}
            />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-4 w-full py-3 text-sm font-bold rounded-xl transition-all"
              style={{ backgroundColor: "#18100E", color: "#F3EEE7" }}
            >
              Show {total} Flats
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
