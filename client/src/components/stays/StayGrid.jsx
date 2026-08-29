import StayCard from "./StayCard";
import { Loader2, Building2, AlertCircle } from "lucide-react";

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded-full w-3/4" />
        <div className="h-3 bg-gray-200 rounded-full w-1/2" />
        <div className="flex gap-3">
          <div className="h-3 bg-gray-200 rounded-full w-16" />
          <div className="h-3 bg-gray-200 rounded-full w-16" />
          <div className="h-3 bg-gray-200 rounded-full w-16" />
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function StayGrid({
  stays,
  loading,
  error,
  hasMore,
  onLoadMore,
  isSaved,
  onToggleSave,
  saveLoading,
  title,
}) {
  // Initial load (no stays yet)
  if (loading && stays.length === 0) {
    return (
      <div>
        {title && <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertCircle size={24} className="text-red-400" />
        </div>
        <h3 className="font-semibold text-gray-700 mb-1">Something went wrong</h3>
        <p className="text-sm text-gray-400">Please try refreshing the page.</p>
      </div>
    );
  }

  if (!loading && stays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
          <Building2 size={28} className="text-gray-300" />
        </div>
        <h3 className="font-semibold text-gray-700 mb-1">No flats found</h3>
        <p className="text-sm text-gray-400 max-w-xs">
          Try changing your filters or searching another area.
        </p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
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
        {/* Loading skeletons for load-more */}
        {loading && stays.length > 0 &&
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)
        }
      </div>

      {hasMore && !loading && (
        <div className="mt-8 text-center">
          <button
            onClick={onLoadMore}
            className="px-8 py-3 bg-white border-2 border-cyan-500 text-cyan-600 font-semibold text-sm rounded-xl hover:bg-cyan-50 transition"
          >
            Load More Flats
          </button>
        </div>
      )}
    </div>
  );
}
