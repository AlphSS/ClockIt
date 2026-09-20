import StayCard from "./StayCard";
import { Building2, AlertCircle } from "lucide-react";

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden animate-pulse"
      style={{ backgroundColor: "#FDFAF5", border: "1px solid #E8E0D8" }}
    >
      <div className="h-48" style={{ backgroundColor: "#E8E0D8" }} />
      <div className="p-4 space-y-3">
        <div className="h-4 rounded-full w-3/4" style={{ backgroundColor: "#E8E0D8" }} />
        <div className="h-3 rounded-full w-1/2" style={{ backgroundColor: "#E8E0D8" }} />
        <div className="flex gap-3">
          <div className="h-3 rounded-full w-16" style={{ backgroundColor: "#E8E0D8" }} />
          <div className="h-3 rounded-full w-16" style={{ backgroundColor: "#E8E0D8" }} />
          <div className="h-3 rounded-full w-16" style={{ backgroundColor: "#E8E0D8" }} />
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full" style={{ backgroundColor: "#E8E0D8" }} />
          <div className="h-5 w-16 rounded-full" style={{ backgroundColor: "#E8E0D8" }} />
        </div>
      </div>
    </div>
  );
}

export default function StayGrid({
  stays, loading, error, hasMore, onLoadMore,
  isSaved, onToggleSave, saveLoading, title,
}) {
  if (loading && stays.length === 0) {
    return (
      <div>
        {title && (
          <h2
            className="font-bold mb-4"
            style={{ color: "#18100E", fontFamily: "Georgia, serif", fontSize: "1.25rem" }}
          >
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: "#FEF2F2" }}
        >
          <AlertCircle size={24} style={{ color: "#991B1B" }} />
        </div>
        <h3 className="font-semibold mb-1" style={{ color: "#18100E" }}>Something went wrong</h3>
        <p className="text-sm" style={{ color: "#9CA3AF" }}>Please try refreshing the page.</p>
      </div>
    );
  }

  if (!loading && stays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: "#F3EEE7" }}
        >
          <Building2 size={28} style={{ color: "#C4B8AE" }} />
        </div>
        <h3 className="font-bold mb-1" style={{ color: "#18100E" }}>No flats found</h3>
        <p className="text-sm max-w-xs" style={{ color: "#9CA3AF" }}>
          Try changing your filters or searching another area.
        </p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2
            className="font-bold"
            style={{ color: "#18100E", fontFamily: "Georgia, serif", fontSize: "1.25rem" }}
          >
            {title}
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stays.map((stay) => (
          <StayCard
            key={stay.id}
            stay={stay}
            isSaved={isSaved?.(stay.id)}
            onToggleSave={onToggleSave}
            saveLoading={saveLoading}
          />
        ))}
        {loading && stays.length > 0 &&
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)
        }
      </div>

      {hasMore && !loading && (
        <div className="mt-8 text-center">
          <button
            onClick={onLoadMore}
            className="px-8 py-3 text-sm font-bold rounded-xl transition-all"
            style={{
              backgroundColor: "#FDFAF5",
              border: "2px solid #18100E",
              color: "#18100E",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#18100E";
              e.currentTarget.style.color = "#F3EEE7";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FDFAF5";
              e.currentTarget.style.color = "#18100E";
            }}
          >
            Load More Flats
          </button>
        </div>
      )}
    </div>
  );
}
